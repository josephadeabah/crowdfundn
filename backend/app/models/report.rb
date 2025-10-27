class Report < ApplicationRecord
  # Enums
  enum report_type: {
    spam: 0,
    inappropriate_content: 1,
    fraudulent_activity: 2,
    misleading_information: 3,
    harassment: 4,
    intellectual_property: 5,
    privacy_violation: 6,
    other: 7
  }

  enum status: {
    pending: 0,
    under_review: 1,
    resolved: 2,
    dismissed: 3
  }

  enum priority: {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3
  }

  # Associations
  belongs_to :reporter, class_name: 'User', foreign_key: 'reporter_id'
  belongs_to :campaign, optional: true
  belongs_to :reported_user, class_name: 'User', foreign_key: 'reported_user_id', optional: true
  belongs_to :assigned_admin, class_name: 'User', foreign_key: 'assigned_admin_id', optional: true

  # Validations
  validates :report_type, presence: true
  validates :description, presence: true, length: { minimum: 10, maximum: 1000 }
  validates :reporter_id, presence: true
  validate :either_campaign_or_user

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :needs_review, -> { where(status: [:pending, :under_review]) }
  scope :by_type, ->(type) { where(report_type: type) }
  scope :high_priority, -> { where(priority: [:high, :critical]) }

  # Callbacks
  before_save :set_priority
  after_create :notify_admins
  after_update :notify_reporter_if_resolved, if: -> { saved_change_to_status? && resolved? }

  def set_priority
    self.priority = case report_type
                   when 'fraudulent_activity', 'harassment'
                     :high
                   when 'inappropriate_content', 'privacy_violation'
                     :medium
                   else
                     :low
                   end
  end

  def notify_admins
    # AdminNotificationService.new_report_created(self)
  end

  def notify_reporter_if_resolved
    # ReportMailerService.send_report_resolved_email(self)
  end

  def assign_to_admin(admin_user)
    update!(assigned_admin: admin_user, status: :under_review)
  end

  def resolve_with_action(action_taken, resolution_notes = nil)
    update!(
      status: :resolved,
      action_taken: action_taken,
      resolution_notes: resolution_notes,
      resolved_at: Time.current
    )
  end

  def dismiss(reason = nil)
    update!(
      status: :dismissed,
      resolution_notes: reason,
      resolved_at: Time.current
    )
  end

  def report_target
    campaign || reported_user
  end

  def report_target_type
    campaign ? 'campaign' : 'user'
  end

  def report_target_name
    if campaign
      campaign.title
    elsif reported_user
      reported_user.full_name
    else
      'Unknown Target'
    end
  end

  private

  def either_campaign_or_user
    if campaign_id.blank? && reported_user_id.blank?
      errors.add(:base, 'Either campaign or user must be reported')
    end

    if campaign_id.present? && reported_user_id.present?
      errors.add(:base, 'Cannot report both campaign and user simultaneously')
    end
  end
end