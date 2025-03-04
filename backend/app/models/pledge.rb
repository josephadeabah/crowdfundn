class Pledge < ApplicationRecord
  belongs_to :donation
  belongs_to :reward
  belongs_to :campaign

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :status, inclusion: { in: %w[pending fulfilled canceled] }
  validates :shipping_status, inclusion: { in: %w[not_shipped shipped delivered] }, allow_nil: true

  # Custom JSON serialization
  def as_json(_options = {})
    super(only: %i[id donation_id reward_id campaign_id amount status created_at]).merge(
      paystack_transaction_data: paystack_transaction_data,
      shipping_address: shipping_address
    )
  end
end
