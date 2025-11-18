# app/models/club_investment.rb
class ClubInvestment < ApplicationRecord
  belongs_to :investment_club
  belongs_to :campaign
  belongs_to :created_by, class_name: 'User', foreign_key: 'created_by_id', optional: true
  
  has_many :member_investment_shares, dependent: :destroy
  has_many :members, through: :member_investment_shares, source: :user
  has_many :votes, as: :votable, dependent: :destroy
  has_one_attached :certificate
  
  # Add these missing attributes
  attribute :proposed_share_percentage, :decimal, precision: 5, scale: 2
  attribute :voting_session_id, :string
  attribute :voting_ends_at, :datetime
  attribute :shares_acquired, :integer, default: 0
  attribute :reference, :string
  
  # NEW: Equity investment attributes
  attribute :shares, :decimal, precision: 20, scale: 4
  attribute :percentage, :decimal, precision: 10, scale: 6
  attribute :investment_date, :date
  attribute :certificate_number, :string
  attribute :transaction_reference, :string
  attribute :equity_investment_id, :integer
  attribute :current_value, :decimal, precision: 15, scale: 2
  attribute :notes, :text
  
  validates :investment_amount, numericality: { greater_than: 0 }
  validates :proposed_share_percentage, numericality: { greater_than: 0, less_than_or_equal_to: 100 }, allow_nil: true

  # FIXED: Manual status implementation to avoid ActiveRecord enum conflicts
  STATUS_VALUES = {
    pending: 'pending',
    voting: 'voting',
    approved: 'approved',
    rejected: 'rejected',
    initialized: 'initialized',
    successful: 'successful',
    failed: 'failed',
    committed: 'committed',
    canceled: 'canceled',
    executed: 'executed'
  }.freeze

  # Add these after the STATUS_VALUES definition
  STATUS_PENDING = STATUS_VALUES[:pending]
  STATUS_VOTING = STATUS_VALUES[:voting]
  STATUS_APPROVED = STATUS_VALUES[:approved]
  STATUS_REJECTED = STATUS_VALUES[:rejected]
  STATUS_COMMITTED = STATUS_VALUES[:committed]
  STATUS_SUCCESSFUL = STATUS_VALUES[:successful]
  STATUS_FAILED = STATUS_VALUES[:failed]
  STATUS_INITIALIZED = STATUS_VALUES[:initialized]
  STATUS_CANCELED = STATUS_VALUES[:canceled]
  STATUS_EXECUTED = STATUS_VALUES[:executed]

  # Status validation
  validates :status, inclusion: { in: STATUS_VALUES.values }

  # FIXED: Status query methods - only define methods that don't conflict
  STATUS_VALUES.each do |method_name, status_value|
    # Only define methods that don't conflict with existing methods
    unless method_defined?("#{method_name}?")
      define_method("#{method_name}?") do
        status == status_value
      end
    end

    unless method_defined?("#{method_name}!")
      define_method("#{method_name}!") do
        update(status: status_value)
      end
    end
  end

  # Scopes for each status
  STATUS_VALUES.each do |method_name, status_value|
    scope method_name, -> { where(status: status_value) }
  end

  # Add the executed scope
  scope :executed, -> { where(status: 'executed') }
  
  # NEW: Equity investment scopes
  scope :successful, -> { where(status: 'successful') }
  scope :committed, -> { where(status: 'committed') }
  
  before_create :generate_reference
  before_create :set_voting_session_id
  # NEW: Equity investment callbacks
  before_create :generate_certificate_number
  before_create :set_investment_date
  before_create :calculate_shares_and_percentage, if: :is_equity_investment?
  
  # Method to check if investment is approved based on voting
  def approved?
    status == 'approved'
  end
  
  # NEW: Equity investment financial calculations
  def current_value
    return investment_amount unless campaign && campaign.valuation && percentage
    
    (campaign.valuation * percentage / 100).round(2)
  end

  def total_returns
    (current_value - investment_amount).round(2)
  end

  def roi
    return 0 if investment_amount.zero?
    ((total_returns / investment_amount) * 100).round(2)
  end

  # NEW: Certificate methods for equity investments
  def certificate_url
    return unless certificate.attached?
    
    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{certificate.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(certificate)
    end
  rescue => e
    Rails.logger.error "Failed to generate certificate URL for club investment #{id}: #{e.message}"
    nil
  end

  def certificate_present?
    certificate.attached? && certificate.blob.present?
  end

  # NEW: Signature methods for equity investments
  def club_signature_url
    # Use club's official signature or president's signature
    club_president = investment_club.admin_members.first
    club_president&.latest_kyc&.signature_image_url
  end

  def issuer_signature_url
    issuer = campaign.fundraiser
    return nil unless issuer
    issuer.latest_kyc&.signature_image_url
  end

  # NEW: Check if this is an equity investment
  def is_equity_investment?
    campaign.is_a?(EquityCampaign)
  end
  
  # Method to get voting statistics
  def voting_stats
    votes = self.votes.where(voting_session_id: voting_session_id)
    total_votes = votes.count
    yes_votes = votes.where(vote_type: 'yes').count
    no_votes = votes.where(vote_type: 'no').count
    
    # Use current_members_count from the club
    total_members = investment_club.current_members_count
    
    # Calculate if threshold is met (all members voted)
    all_members_voted = total_votes >= total_members
    threshold_met = all_members_voted && yes_votes > no_votes
    
    {
      total_votes: total_votes,
      yes_votes: yes_votes,
      no_votes: no_votes,
      approval_percentage: total_votes > 0 ? (yes_votes.to_f / total_votes * 100).round(2) : 0,
      total_members: total_members,
      all_members_voted: all_members_voted,
      threshold_met: threshold_met
    }
  end
  
  # Method to check if voting threshold is met
  def voting_threshold_met?
    stats = voting_stats
    stats[:threshold_met]
  end
  
  # Method to finalize voting and update status
  def finalize_voting
    if voting_threshold_met?
      update(status: 'approved')
      # Add to approved campaigns container
      add_to_approved_campaigns
    else
      update(status: 'rejected')
    end
  end
  
  # Class method to get all possible status values
  def self.statuses
    STATUS_VALUES.values
  end
  
  private
  
  def generate_reference
    return if reference.present?
    
    # Generate a unique reference
    self.reference = "CLUB-INV-#{SecureRandom.alphanumeric(10).upcase}"
    
    # Ensure uniqueness
    while ClubInvestment.exists?(reference: reference)
      self.reference = "CLUB-INV-#{SecureRandom.alphanumeric(10).upcase}"
    end
  end
  
  def set_voting_session_id
    self.voting_session_id ||= SecureRandom.uuid
  end
  
  def add_to_approved_campaigns
    ApprovedCampaign.find_or_create_by(
      investment_club: investment_club,
      campaign: campaign,
      club_investment: self
    )
  end

  # NEW: Equity investment private methods
  def generate_certificate_number
    return if certificate_number.present? || !is_equity_investment?
    self.certificate_number ||= "CLUB-#{SecureRandom.alphanumeric(10).upcase}"
  end

  def set_investment_date
    return if investment_date.present? || !is_equity_investment?
    self.investment_date ||= Date.current
  end

  def calculate_shares_and_percentage
    return unless is_equity_investment?
    return unless campaign && investment_amount.present? && investment_amount.positive?

    if campaign.valuation.to_f <= 0 || campaign.total_shares.to_f <= 0
      errors.add(:base, "Campaign must have valid valuation and shares")
      return
    end

    price_per_share = campaign.valuation.to_f / campaign.total_shares.to_f
    self.shares = (investment_amount / price_per_share).round(4)
    self.percentage = (shares / campaign.total_shares.to_f) * 100
  end
end