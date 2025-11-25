# app/models/equity_investment.rb
class EquityInvestment < ApplicationRecord
  # Associations
  belongs_to :user, optional: true  # CHANGED: Make user optional for club investments
  belongs_to :campaign, class_name: 'EquityCampaign'
  belongs_to :club_investment, optional: true
  belongs_to :reward, optional: true
  has_many :pledges, dependent: :destroy
  has_many :points, dependent: :nullify
  has_one_attached :certificate

  # Constants
  STATUS_PENDING = 'pending'
  STATUS_INITIALIZED = 'initialized'
  STATUS_SUCCESSFUL = 'successful'
  STATUS_FAILED = 'failed'
  STATUS_ABANDONED = 'abandoned'
  STATUS_CANCELED = 'canceled'
  STATUS_REFUNDED = 'refunded'
  STATUS_REVERSED = 'reversed'
  STATUS_QUEUED = 'queued'
  STATUS_PROCESSING = 'processing'
  STATUS_ONGOING = 'ongoing'
  STATUS_COMMITTED = 'committed'

  VALID_STATUSES = [
    STATUS_PENDING,
    STATUS_INITIALIZED,
    STATUS_SUCCESSFUL,
    STATUS_FAILED,
    STATUS_ABANDONED,
    STATUS_CANCELED,
    STATUS_REFUNDED,
    STATUS_REVERSED,
    STATUS_QUEUED,
    STATUS_PROCESSING,
    STATUS_ONGOING,
    STATUS_COMMITTED
  ].freeze

  # Validations
  validates :amount, :shares, :percentage, presence: true, numericality: { greater_than: 0 }
  validate :certificate_only_for_successful_investments
  validates :certificate_number, uniqueness: true, allow_nil: true
  validates :transaction_reference, uniqueness: true, allow_nil: true
  validates :email, presence: true
  validates :full_name, presence: true  # ADDED: Ensure full_name is validated
  validates :phone, presence: false
  validates :status, inclusion: { in: VALID_STATUSES }

  # NEW: Custom validation for club investments
  validate :validate_investor_presence

  # Scopes
  scope :successful, -> { where(status: STATUS_SUCCESSFUL) }
  scope :committed, -> { where(status: STATUS_COMMITTED) }
  scope :cancellable, -> { 
    where(status: STATUS_COMMITTED)
    .where('cancel_window_expires_at > ?', Time.current)
  }

  # NEW: Scope for club investments
  scope :club_investments, -> { where("metadata->>'club_investment' = ?", 'true') }
  scope :individual_investments, -> { where("metadata->>'club_investment' IS NULL OR metadata->>'club_investment' = ?", 'false') }

  # Callbacks
  before_validation :calculate_shares_and_percentage, on: :create
  before_create :generate_certificate_number
  before_create :set_investment_date
  after_commit :update_campaign_leaderboard, if: :saved_change_to_status?
  after_save :update_campaign_shares, if: -> { saved_change_to_status? && successful? }
  before_save :update_current_value, if: -> { campaign_id_changed? || percentage_changed? || will_save_change_to_percentage? }
  before_save :set_commitment_timestamps, if: -> { will_save_change_to_status?(to: STATUS_COMMITTED) }

  # ========== STATUS QUERY METHODS ==========
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
  
  def reversed?
    status == STATUS_REVERSED
  end

  def queued?
    status == STATUS_QUEUED
  end

  def processing?
    status == STATUS_PROCESSING
  end

  def ongoing?
    status == STATUS_ONGOING
  end

  def committed?
    status == STATUS_COMMITTED
  end

  # NEW: Check if this is a club investment
  def club_investment?
    metadata&.dig('club_investment') == true
  end

  # NEW: Get club information for club investments
  def club
    return nil unless club_investment?
    InvestmentClub.find_by(id: metadata&.dig('club_id'))
  end

   # NEW: Method to safely access club information
  def club_info
    return nil unless club_investment?
    
    {
      name: metadata&.dig('club_name'),
      id: metadata&.dig('club_id')
    }
  end

  # NEW: Method to get display name for public listings
  def public_investor_name
    if user.present?
      user.full_name
    elsif club_investment?
      metadata&.dig('club_name') || 'Investment Club'
    else
      full_name || 'Anonymous'
    end
  end

  # NEW: Method to get display email for public listings
  def public_investor_email
    if user.present?
      user.email
    else
      email
    end
  end

  # ========== CANCELLATION METHODS ==========
  def can_be_cancelled?
    committed? && cancel_window_expires_at > Time.current
  end

  def cancel!(reason = nil)
    return false unless can_be_cancelled?
    
    update!(
      status: STATUS_CANCELED,
      cancellation_reason: reason,
      cancelled_at: Time.current
    )
    
    # Void payment authorization if needed
    void_payment_authorization if transaction_reference.present?
    
    true
  end

  def void_payment_authorization
    return unless transaction_reference.present?
    
    paystack_service = PaystackService.new
    
    # First verify the transaction status
    verification_response = paystack_service.verify_transaction(transaction_reference)
    
    unless verification_response[:status]
      Rails.logger.error "Cannot verify transaction #{transaction_reference} for cancellation"
      mark_for_manual_refund("Transaction verification failed")
      return false
    end
    
    transaction_status = verification_response.dig(:data, :status)
    
    case transaction_status
    when 'success'
      # Transaction was successful - process refund
      process_refund_for_successful_transaction
    when 'abandoned', 'failed'
      # Transaction never completed - no refund needed
      Rails.logger.info "Transaction #{transaction_reference} was #{transaction_status}, no refund needed"
      update_refund_status('not_required', "Transaction was #{transaction_status}")
      true
    when 'pending', 'processing', 'ongoing'
      # Transaction is still pending - may need different handling
      process_pending_transaction_cancellation
    else
      Rails.logger.warn "Unknown transaction status: #{transaction_status} for #{transaction_reference}"
      mark_for_manual_refund("Unknown transaction status: #{transaction_status}")
      false
    end
  rescue => e
    Rails.logger.error "Error voiding payment authorization for investment #{id}: #{e.message}"
    mark_for_manual_refund("Exception: #{e.message}")
    false
  end

  # ========== FINANCIAL CALCULATION METHODS ==========
  def current_value
    # Return stored value if present, otherwise calculate it
    self[:current_value] || calculate_current_value
  end

  def total_returns
    (current_value - amount).round(2)
  end

  def roi
    return 0 if amount.zero?
    ((total_returns / amount) * 100).round(2)
  end

  def gross_amount
    self[:gross_amount] || amount
  end

  def net_amount
    self[:net_amount] || amount
  end

  # ========== CERTIFICATE METHODS ==========
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

  # ========== SHARE CALCULATION METHODS ==========
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

    # PERCENTAGE IS NOW DERIVED FROM SHARES (consistent with source of truth)
    self.percentage = (shares / campaign.total_shares.to_f) * 100
  end

  # ========== SIGNATURE METHODS ==========
  def investor_signature_url
    return nil unless user
    user.latest_kyc&.signature_image_url
  end

  def issuer_signature_url
    issuer = campaign.fundraiser
    return nil unless issuer
    issuer.latest_kyc&.signature_image_url
  end

  # ========== SERIALIZATION METHODS ==========
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
      club: club_investment? ? {
        id: metadata&.dig('club_id'),
        name: metadata&.dig('club_name')
      } : nil,
      signatures: {
        investor: investor_signature_url,
        issuer: issuer_signature_url
      },
      created_at: created_at,
      updated_at: updated_at
    }
  end

  # ========== CLASS METHODS ==========
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
      total_return: successful_investments.sum { |i| i.total_returns },
      investments: investments,
      successful_count: successful_investments.count,
      campaigns_invested: successful_campaign_ids.count
    }
  end

  def self.total_investment_value(user_id = nil)
    scope = successful
    scope = scope.where(user_id: user_id) if user_id
    scope.sum(:amount)
  end

  def self.total_portfolio_value(user_id = nil)
    scope = successful.includes(:campaign)
    scope = scope.where(user_id: user_id) if user_id
    scope.sum { |investment| investment.current_value }
  end

  # ========== PRIVATE METHODS ==========
  private

  # NEW: Custom validation for investor presence
  def validate_investor_presence
    if user_id.blank? && (email.blank? || full_name.blank?)
      errors.add(:base, "Either user or investor contact information (email and full_name) must be present")
    end
  end

  # Refund Processing Methods
  def process_refund_for_successful_transaction
    paystack_service = PaystackService.new
    
    refund_response = paystack_service.cancel_authorized_payment(
      transaction_reference,
      amount,
      campaign.currency.upcase,
      "48-hour cancellation window - Investment ID: #{id}"
    )
    
    handle_refund_response(refund_response)
  end

  def process_pending_transaction_cancellation
    # For pending transactions, we might not need to refund
    # since the payment hasn't been captured yet
    Rails.logger.info "Transaction #{transaction_reference} is pending - marking as cancelled without refund"
    
    update_refund_status('not_required', 'Pending transaction cancelled without refund')
    true
  end

  def handle_refund_response(refund_response)
    if refund_response[:status]
      update_refund_status(
        'initiated',
        'Refund initiated successfully',
        {
          'refund_reference' => refund_response.dig(:data, :reference),
          'refund_id' => refund_response.dig(:data, :id),
          'refund_status' => refund_response.dig(:data, :status)
        }
      )
      true
    else
      Rails.logger.error "Refund failed: #{refund_response[:message]}"
      mark_for_manual_refund(refund_response[:message])
      false
    end
  end

  def update_refund_status(status, message, additional_metadata = {})
    update!(
      metadata: metadata.merge(
        'refund_status' => status,
        'refund_message' => message,
        'refund_initiated_at' => Time.current.iso8601
      ).merge(additional_metadata)
    )
  end

  def mark_for_manual_refund(reason)
    update_refund_status('manual_intervention_required', reason)
    
    # Notify admin about failed refund (you can implement this later)
    # AdminMailer.refund_failed_notification(self, reason).deliver_later
  end

  # Timestamp Methods
  def set_commitment_timestamps
    self.committed_at ||= Time.current
    self.cancel_window_expires_at ||= 48.hours.from_now
  end

  def set_investment_date
    self.investment_date ||= Date.current
  end

  # Value Calculation Methods
  def calculate_current_value
    return amount unless campaign && campaign.valuation && percentage
    
    new_value = (campaign.valuation * percentage / 100).round(2)
    new_value
  end

  def update_current_value
    self.current_value = calculate_current_value
  end

  # Certificate Methods
  def generate_certificate_number
    self.certificate_number ||= "BHV-#{SecureRandom.alphanumeric(10).upcase}"
  end

  def certificate_only_for_successful_investments
    if certificate.attached? && !successful?
      errors.add(:certificate, "can only be attached to successful investments")
    end
  end

  # Campaign Update Methods
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