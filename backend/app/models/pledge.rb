class Pledge < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :donation
  belongs_to :reward
  belongs_to :campaign

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :status, inclusion: { in: %w[pending fulfilled canceled] }
  validates :shipping_status, inclusion: { in: %w[not_shipped shipped delivered] }, allow_nil: true

  # Custom JSON serialization
  def as_json(_options = {})
    super(only: %i[id donation_id reward_id campaign_id user_id amount status shipping_status created_at]).merge(
      shipping_data: shipping_data,
      selected_rewards: selected_rewards,
      delivery_option: delivery_option
    )
  end
end