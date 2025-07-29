class Pledge < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :donation, optional: true
  belongs_to :equity_investment, optional: true # Add this association
  belongs_to :reward
  belongs_to :campaign, polymorphic: true # Changed to polymorphic

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :status, inclusion: { in: %w[pending fulfilled canceled] }
  validates :shipping_status, inclusion: { in: %w[not_shipped shipped delivered] }, allow_nil: true
  # In Pledge model
  scope :for_donations, -> { where.not(donation_id: nil) }
  scope :for_investments, -> { where.not(equity_investment_id: nil) }

  # Ensure either donation or equity_investment is present
  validate :must_belong_to_donation_or_investment

  # Custom JSON serialization
  def as_json(_options = {})
    super(only: %i[id donation_id equity_investment_id reward_id campaign_id campaign_type user_id amount status shipping_status created_at]).merge(
      shipping_data: shipping_data,
      selected_rewards: selected_rewards,
      delivery_option: delivery_option
    )
  end

  # In Pledge model
  def source
    donation || equity_investment
  end

  private

  def must_belong_to_donation_or_investment
    unless donation_id.present? ^ equity_investment_id.present? # XOR operation
      errors.add(:base, "Pledge must belong to either a donation or an equity investment, but not both")
    end
  end
end