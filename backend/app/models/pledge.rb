# app/models/pledge.rb
class Pledge < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :donation, optional: true
  belongs_to :equity_investment, optional: true
  belongs_to :reward
  belongs_to :campaign, optional: true

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :status, inclusion: { in: %w[pending fulfilled canceled] }
  validates :shipping_status, inclusion: { in: %w[not_shipped shipped delivered] }, allow_nil: true

  def investment
    donation || equity_investment
  end

  # Custom JSON serialization
  def as_json(_options = {})
    super(only: %i[id donation_id equity_investment_id reward_id campaign_id user_id amount status shipping_status created_at]).merge(
      shipping_data: shipping_data,
      selected_rewards: selected_rewards,
      delivery_option: delivery_option,
      investment_type: donation_id ? 'donation' : 'equity_investment'
    )
  end
end