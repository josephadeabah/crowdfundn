# app/models/equity_investment.rb
class EquityInvestment < ApplicationRecord
  belongs_to :user
  belongs_to :campaign, class_name: 'EquityCampaign'
  belongs_to :reward, optional: true
  has_many :pledges, dependent: :destroy
  has_many :points, dependent: :nullify

  has_one_attached :certificate

  # Status constants matching Paystack
  STATUS_PENDING = 'pending'
  STATUS_INITIALIZED = 'initialized'
  STATUS_SUCCESSFUL = 'successful'
  STATUS_FAILED = 'failed'
  STATUS_ABANDONED = 'abandoned'
  STATUS_CANCELED = 'canceled'
  STATUS_REFUNDED = 'refunded'

  VALID_STATUSES = [
    STATUS_PENDING,
    STATUS_INITIALIZED,
    STATUS_SUCCESSFUL,
    STATUS_FAILED,
    STATUS_ABANDONED,
    STATUS_CANCELED,
    STATUS_REFUNDED
  ].freeze

  validates :amount, :shares, :percentage, presence: true, numericality: { greater_than: 0 }
  validates :certificate_number, uniqueness: true, allow_nil: true
  validates :transaction_reference, uniqueness: true, allow_nil: true
  validates :email, presence: true
  validates :phone, presence: false
  validates :status, inclusion: { in: VALID_STATUSES }

  scope :successful, -> { where(status: STATUS_SUCCESSFUL) }

  before_validation :calculate_shares_and_percentage, on: :create
  before_create :generate_certificate_number
  before_create :set_investment_date
  # after_commit :generate_certificate_after_commit, on: [:create, :update], if: :should_generate_certificate?
  # after_commit :update_investor_portfolios, on: [:create, :update], if: :successful?
    after_commit :handle_post_success_actions, on: :update, if: :saved_change_to_status?
  after_commit :update_campaign_totals, on: [:create, :update], if: :saved_change_to_status?
  after_update :update_campaign_leaderboard, if: :saved_change_to_status?

  # Status query methods
  def pending?
    status == STATUS_PENDING
  end

  def initialized?
    status == STATUS_INITIALIZED
  end

  def successful?
    status == STATUS_SUCCESSFUL
  end

  def failed?
    status == STATUS_FAILED
  end

  def abandoned?
    status == STATUS_ABANDONED
  end

  def canceled?
    status == STATUS_CANCELED
  end

  def refunded?
    status == STATUS_REFUNDED
  end

  def current_value
    (campaign.valuation * percentage / 100).round(2)
  end

  def total_returns
    (current_value - amount).round(2)
  end

  def roi
    return 0 if amount.zero?
    ((total_returns / amount) * 100).round(2)
  end

  def self.total_invested(campaign_id)
    where(campaign_id: campaign_id, status: :successful).sum(:amount)
  end

  def certificate_url
    return unless certificate.attached?
    Rails.application.routes.url_helpers.url_for(certificate)
  end

  def certificate_present?
    certificate.attached? && certificate.blob.present?
  end

  def gross_amount
    self[:gross_amount] || amount
  end

  def net_amount
    self[:net_amount] || amount
  end

  def calculate_shares_and_percentage
    unless campaign && amount.present? && amount.positive?
      errors.add(:amount, "must be positive")
      return
    end

    if campaign.valuation.to_f <= 0
      errors.add(:base, "Campaign valuation must be greater than 0")
      return
    end

    if campaign.total_shares.to_f <= 0
      errors.add(:base, "Campaign must have shares available")
      return
    end

    if campaign.equity_offered.to_f <= 0
      errors.add(:base, "Campaign must offer equity")
      return
    end

    price_per_share = campaign.valuation.to_f / campaign.total_shares.to_f
    self.shares = (amount / price_per_share).round(4)

    total_equity_value = (campaign.valuation.to_f * campaign.equity_offered.to_f / 100)
    self.percentage = ((amount / total_equity_value) * 100).round(4)
  end

  private

  def generate_certificate_number
    self.certificate_number ||= "BHV-#{SecureRandom.alphanumeric(10).upcase}"
  end

  def set_investment_date
    self.investment_date ||= Date.current
  end

  def update_campaign_totals
    return unless successful?
    
    campaign.update_shares_available
    campaign.update!(
      current_amount: campaign.current_amount + net_amount,
      total_successful_donations: campaign.total_successful_donations + net_amount
    )
  end

    def handle_post_success_actions
    return unless successful?

    # Generate certificate and send email in transaction
    if InvestmentCertificateService.generate_certificate(self)
      InvestmentConfirmationEmailService.send_confirmation_email(
        investment: self,
        certificate_url: certificate_url,
        recipient_email: email,
        recipient_name: user&.full_name || full_name || 'Investor'
      )
    else
      CertificateGenerationJob.set(wait: 5.minutes).perform_later(id)
    end
  end

  # def generate_certificate_after_commit
  #   if InvestmentCertificateService.generate_certificate(self)
  #     Rails.logger.info "Successfully generated certificate for investment #{id}"
  #   else
  #     Rails.logger.error "Failed to generate certificate for investment #{id}"
  #     CertificateGenerationJob.set(wait: 5.minutes).perform_later(id)
  #   end
  # rescue => e
  #   Rails.logger.error "Certificate generation error: #{e.message}"
  #   CertificateGenerationJob.set(wait: 5.minutes).perform_later(id)
  # end

  # def should_generate_certificate?
  #   successful? && certificate_number.present? && 
  #   (certificate.blank? || certificate_needs_update?)
  # end

  # def certificate_needs_update?
  #   saved_change_to_amount? || saved_change_to_shares? || saved_change_to_percentage? ||
  #   saved_change_to_certificate_number? || certificate.blob.blank?
  # end

  # def update_investor_portfolios
  #   campaign.equity_investments.successful.each do |inv|
  #     InvestmentUpdateJob.perform_later(inv.id)
  #   end
  # end

  def update_campaign_leaderboard
    campaign.update_fundraiser_leaderboard if successful?
  end
end