# app/models/campaign_team_member.rb
class CampaignTeamMember < ApplicationRecord
  attribute :name, :string
  attribute :email, :string

  belongs_to :campaign
  belongs_to :user, optional: true

  has_one_attached :avatar

  ROLES = %w[founder advisor employee].freeze
  validates :role, inclusion: { in: ROLES }
  validates :equity_percentage, numericality: { greater_than_or_equal_to: 0 }
  validates :title, presence: true
  validates :description, length: { maximum: 1000 }, allow_blank: true
  validates :name, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :avatar, presence: true
  validate :avatar_content_type

  # Ensure founder equity doesn't exceed available equity
  validate :founder_equity_limit
  # Ensure total equity allocation equals exactly 100%
  validate :total_equity_allocation_exactly_100_percent

  def avatar_url
    return unless avatar.attached?

    "#{Rails.application.credentials.dig(:digitalocean,
                                         :endpoint)}/#{Rails.application.credentials.dig(:digitalocean,
                                                                                         :bucket)}/#{avatar.blob.key}"
  end

  def convert_to_user
    return if user.present?
    return if email.blank? # Can't create user without email

    new_user = User.invite!(
      email: email,
      full_name: name,
      # Set default password or let devise invitable handle it
      password: Devise.friendly_token[0, 20],
      # Add other required user attributes
      status: 'active'
    )

    update(user: new_user)
  rescue StandardError => e
    errors.add(:base, "Failed to create user: #{e.message}")
    false
  end

  private

  def avatar_content_type
    return unless avatar.attached?

    return if avatar.content_type.in?(%w[image/jpeg image/png image/gif])

    errors.add(:avatar, 'must be a JPEG, PNG, or GIF')
  end

  def founder_equity_limit
    return unless role == 'founder' && equity_percentage.present?
    return unless campaign.is_a?(EquityCampaign)

    available_equity = 100 - campaign.equity_offered.to_f
    return unless equity_percentage > available_equity

    errors.add(:equity_percentage, "cannot exceed #{available_equity}% for founders")
  end

  def total_equity_allocation_exactly_100_percent
    return unless equity_percentage.present? && campaign.is_a?(EquityCampaign)
    
    # Calculate total equity already allocated to team members (excluding current member if updating)
    existing_allocations = campaign.campaign_team_members.where.not(id: id).sum(:equity_percentage)
    total_allocated = existing_allocations + equity_percentage
    
    # Total must equal exactly 100% when combined with campaign equity
    required_total = 100 - campaign.equity_offered.to_f
    
    if total_allocated != required_total
      if total_allocated > required_total
        errors.add(:equity_percentage, "Total team allocation exceeds available equity. Maximum allowed is #{required_total}%, but would be #{total_allocated}%")
      else
        errors.add(:equity_percentage, "Total team allocation is insufficient. Required total is #{required_total}%, but would be #{total_allocated}%")
      end
    end
  end
end