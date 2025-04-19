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
  
  def avatar_url
    return unless avatar.attached?
    "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{avatar.blob.key}"
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
  rescue => e
    errors.add(:base, "Failed to create user: #{e.message}")
    false
  end
  
  private

  def avatar_content_type
    return unless avatar.attached?
    
    unless avatar.content_type.in?(%w[image/jpeg image/png image/gif])
      errors.add(:avatar, 'must be a JPEG, PNG, or GIF')
    end
  end
  
  def founder_equity_limit
    return unless role == 'founder' && equity_percentage.present?
    return unless campaign.is_a?(EquityCampaign)

    available_equity = 100 - campaign.equity_offered.to_f
    if equity_percentage > available_equity
      errors.add(:equity_percentage, "cannot exceed #{available_equity}% for founders")
    end
  end
end