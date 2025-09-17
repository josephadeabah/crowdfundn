# app/models/premium_subscription.rb
class PremiumSubscription < ApplicationRecord
  belongs_to :user
  belongs_to :premium_plan, optional: true
  
  STATUSES = %w[active inactive cancelled expired].freeze
  INTERVALS = %w[monthly quarterly annually one_time].freeze
  
  validates :status, inclusion: { in: STATUSES }
  validates :interval, inclusion: { in: INTERVALS }
  validates :transaction_reference, presence: true, uniqueness: true
  
  scope :active, -> { where(status: 'active').where('expires_at > ? OR expires_at IS NULL', Time.current) }
  scope :expired, -> { where('expires_at < ?', Time.current) }
  
  def active?
    status == 'active' && (expires_at.nil? || expires_at > Time.current)
  end
  
  def cancel!
    update(status: 'cancelled', auto_renew: false)
  end
  
  # Set interval from plan if not specified
  before_validation :set_interval_from_plan, if: -> { premium_plan.present? && interval.blank? }
  
  private
  
  def set_interval_from_plan
    self.interval = premium_plan.interval
  end
end