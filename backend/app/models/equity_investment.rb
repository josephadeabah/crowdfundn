# app/models/equity_investment.rb
class EquityInvestment < ApplicationRecord
  belongs_to :user
  belongs_to :campaign, class_name: 'EquityCampaign'
  
  has_one_attached :certificate
  
  validates :amount, :shares, :percentage, presence: true, numericality: { greater_than: 0 }
  validates :certificate_number, uniqueness: true, allow_nil: true
  
  enum status: {
    pending: 0,       # Investment initiated but payment not confirmed
    completed: 1,     # Payment confirmed and shares allocated
    canceled: 2,      # Investment canceled by user
    refunded: 3,      # Investment refunded
    failed: 4         # Payment failed
  }

  before_validation :calculate_shares_and_percentage, on: :create
  before_create :generate_certificate_number
  before_create :set_investment_date
  after_create :update_campaign_equity
  after_update :update_campaign_equity, if: :saved_change_to_amount?
  after_commit :generate_certificate_after_commit, on: [:create, :update], if: :completed?

  
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
    where(campaign_id: campaign_id, status: :completed).sum(:amount)
  end

  def certificate_url
    return unless certificate.attached?
    
    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/" \
      "#{Rails.application.credentials.dig(:digitalocean, :bucket)}/" \
      "#{certificate.blob.key}"
    else
      # For development/test, use Rails URL helpers
      Rails.application.routes.url_helpers.rails_blob_url(certificate, only_path: false)
    end
  end

    # Update the campaign's valuation whenever new investments come in
  after_commit :update_investor_portfolios, on: [:create, :update], if: :completed?

  private

  def update_portfolio_values
    # Update all investments in this campaign
    if saved_change_to_percentage? || saved_change_to_amount? || campaign.saved_change_to_valuation?
      campaign.update_all_investment_values
    end
  end

  def update_investor_portfolios
    # This will trigger updates for all investors in this campaign
    campaign.equity_investments.completed.each do |investment|
      InvestmentUpdateJob.perform_later(investment.id)
    end
  end

  def calculate_shares_and_percentage
    return unless campaign && amount.present? && amount.positive?

    # Calculate shares based on valuation and total shares
    price_per_share = campaign.valuation.to_f / campaign.total_shares.to_f
    self.shares = (amount / price_per_share).round(4)

    # Calculate ownership percentage
    total_equity_value = (campaign.valuation.to_f * campaign.equity_offered.to_f / 100)
    self.percentage = ((amount / total_equity_value) * 100).round(4)
  end

  def generate_certificate_number
    self.certificate_number ||= "BANTU-#{SecureRandom.alphanumeric(10).upcase}"
  end

  def set_investment_date
    self.investment_date ||= Date.current
  end

  def update_campaign_equity
    campaign.update_shares_available
  end

  def generate_certificate_after_commit
    return if certificate.attached?
    
    certificate = InvestmentCertificateService.generate_certificate(self)
    if certificate.nil?
      Rails.logger.error "Failed to generate certificate for investment #{id}"
    end
  end
end