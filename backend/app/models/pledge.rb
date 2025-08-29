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

  # Store accessors for JSONB columns
  store_accessor :shipping_data, :first_name, :last_name, :shipping_address, :entity_type
  store_accessor :selected_rewards, :title, :description, :amount, :image

  # Custom JSON serialization
  def as_json(options = {})
    super(options.merge(
      only: %i[id donation_id equity_investment_id reward_id campaign_id user_id amount status shipping_status created_at delivery_option],
      methods: [:investment_type, :shipping_first_name, :shipping_last_name, :shipping_address, :entity_type]
    )).merge(
      reward_title: reward&.title,
      reward_description: reward&.description,
      shipping_data: shipping_data || {},
      selected_rewards: selected_rewards || []
    )
  end

  def investment
    donation || equity_investment
  end

  def investment_type
    donation_id ? 'donation' : 'equity_investment'
  end

  # Helper methods for shipping data with safe access
  def shipping_first_name
    return nil unless shipping_data.is_a?(Hash)
    shipping_data['first_name'] || shipping_data[:first_name]
  end

  def shipping_last_name
    return nil unless shipping_data.is_a?(Hash)
    shipping_data['last_name'] || shipping_data[:last_name]
  end

  def shipping_address
    return nil unless shipping_data.is_a?(Hash)
    shipping_data['shipping_address'] || shipping_data[:shipping_address]
  end

  def entity_type
    return nil unless shipping_data.is_a?(Hash)
    shipping_data['entity_type'] || shipping_data[:entity_type]
  end
end