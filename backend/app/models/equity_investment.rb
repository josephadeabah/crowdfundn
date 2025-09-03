# app/models/equity_investment.rb
class EquityInvestment < ApplicationRecord
  belongs_to :user
  belongs_to :campaign, class_name: 'EquityCampaign'
  belongs_to :reward, optional: true
  has_many :pledges, dependent: :destroy
  has_many :points, dependent: :nullify

  has_one_attached :certificate

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
  validate :certificate_only_for_successful_investments
  validates :certificate_number, uniqueness: true, allow_nil: true
  validates :transaction_reference, uniqueness: true, allow_nil: true
  validates :email, presence: true
  validates :phone, presence: false
  validates :status, inclusion: { in: VALID_STATUSES }

  scope :successful, -> { where(status: STATUS_SUCCESSFUL) }

  before_validation :calculate_shares_and_percentage, on: :create
  before_create :generate_certificate_number
  before_create :set_investment_date
  after_commit :update_campaign_leaderboard, if: :saved_change_to_status?
  after_save :update_campaign_shares, if: -> { saved_change_to_status? && successful? }
  before_save :update_current_value, if: -> { campaign_id_changed? || percentage_changed? }

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

  # FIXED: Use different approach to avoid recursion
  def calculate_current_value
    return amount unless campaign && campaign.valuation && percentage
    
    new_value = (campaign.valuation * percentage / 100).round(2)
    
    # Update the database column if value changed
    if self[:current_value] != new_value
      update_column(:current_value, new_value)
    end
    
    new_value
  end

  # Keep this as a simple reader method
  def current_value
    self[:current_value] || calculate_current_value
  end

  def total_returns
    (current_value - amount).round(2)
  end

  def roi
    return 0 if amount.zero?
    ((total_returns / amount) * 100).round(2)
  end

  def self.total_invested(campaign_id)
    where(campaign_id: campaign_id, status: STATUS_SUCCESSFUL).sum(:amount)
  end

  def self.portfolio_for(user)
    investments = user.equity_investments.includes(campaign: [:campaign_team_members])
    
    # Filter out pending investments for portfolio calculations
    successful_investments = investments.successful
    
    # Calculate unique campaigns from successful investments only
    successful_campaign_ids = successful_investments.pluck(:campaign_id).uniq
    
    {
      total_invested: successful_investments.sum(:amount),
      total_value: successful_investments.sum { |i| i.current_value },
      total_return: successful_investments.sum { |i| i.current_value - i.amount },
      investments: investments,
      successful_count: successful_investments.count,
      campaigns_invested: successful_campaign_ids.count
    }
  end

  def self.total_portfolio_value(user_id = nil)
    scope = successful.includes(:campaign)
    scope = scope.where(user_id: user_id) if user_id
    scope.sum { |investment| investment.current_value }
  end

  def self.total_investment_value(user_id = nil)
    scope = successful
    scope = scope.where(user_id: user_id) if user_id
    scope.sum(:amount)
  end

  def certificate_url
    return unless certificate.attached?
    
    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{certificate.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(certificate)
    end
  rescue => e
    Rails.logger.error "Failed to generate certificate URL for investment #{id}: #{e.message}"
    nil
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

  def investor_signature_url
    return nil unless user
    user.latest_kyc&.signature_image_url
  end

  def issuer_signature_url
    issuer = campaign.fundraiser
    return nil unless issuer
    issuer.latest_kyc&.signature_image_url
  end

  def to_frontend_format
    {
      id: id,
      amount: amount,
      shares: shares,
      percentage: percentage,
      status: status,
      certificate_url: certificate_url,
      certificate_number: certificate_number,
      investment_date: investment_date,
      current_value: current_value,
      total_returns: total_returns,
      roi: roi,
      currency: campaign.currency,
      currency_symbol: campaign.currency_symbol,
      campaign: {
        id: campaign.id,
        title: campaign.title,
        company_name: campaign.company_name,
        company_description: campaign.company_description,
        company_headquarters: campaign.company_headquarters,
        company_website: campaign.company_website,
        contract_term: campaign.contract_term,
        valuation: campaign.valuation,
        equity_offered: campaign.equity_offered,
        currency: campaign.currency.upcase,
        currency_symbol: campaign.currency_symbol
      },
      user: user ? {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      } : nil,
      signatures: {
        investor: investor_signature_url,
        issuer: issuer_signature_url
      },
      created_at: created_at,
      updated_at: updated_at
    }
  end

  private

  def update_current_value
    self.current_value = calculate_current_value
  end

  def generate_certificate_number
    self.certificate_number ||= "BHV-#{SecureRandom.alphanumeric(10).upcase}"
  end

  def certificate_only_for_successful_investments
    if certificate.attached? && !successful?
      errors.add(:certificate, "can only be attached to successful investments")
    end
  end

  def set_investment_date
    self.investment_date ||= Date.current
  end

  def update_campaign_leaderboard
    campaign.update_fundraiser_leaderboard if successful?
  end

  def update_campaign_shares
    campaign.with_lock do
      campaign.update!(
        current_amount: campaign.current_amount + amount,
        total_successful_donations: campaign.total_successful_donations + amount,
        total_equity_invested: campaign.total_equity_invested + amount
      )
    end
  rescue ActiveRecord::StaleObjectError => e
    Rails.logger.error "Failed to update campaign shares for investment #{id}: #{e.message}"
    retry if (retries ||= 0) && (retries += 1) < 3
  end
end