# app/models/deal_room.rb
class DealRoom < ApplicationRecord
  belongs_to :campaign
  belongs_to :user
  
  has_many :deal_room_memberships, dependent: :destroy
  has_many :members, through: :deal_room_memberships, source: :user
  has_many :deal_room_documents, dependent: :destroy
  has_many :deal_room_conversations, dependent: :destroy
  has_many :deal_room_messages, dependent: :destroy
  has_many :deal_room_meetings, dependent: :destroy
  
  # FIX: Use different key names that don't conflict with Ruby keywords
  enum :room_type, {
    private_access: 'private',
    public_access: 'public',
    syndicate: 'syndicate'
  }
  
  enum :status, {
    draft: 'draft',
    active: 'active',
    closed: 'closed',
    archived: 'archived'
  }
  
  validates :campaign_id, uniqueness: true
  validates :name, presence: true

  after_create :add_creator_as_member
  
  scope :active, -> { where(status: :active) }
  scope :for_user, ->(user) {
    left_joins(:deal_room_memberships)
      .where("deal_rooms.user_id = ? OR deal_room_memberships.user_id = ?", user.id, user.id)
      .distinct
  }
  
  # Update scope to use the correct enum value
  scope :public_deals, -> {
    where(room_type: :public_access, status: :active)
      .includes(campaign: [:fundraiser, :equity_investments])
  }
  
  # Helper methods to check room type
  def private?
    room_type == 'private_access'
  end
  
  def public?
    room_type == 'public_access'
  end
  
  # Alias methods for compatibility
  def public_room?
    public?
  end
  
  def private_room?
    private?
  end
  
  def add_member(user, role = 'member')
    deal_room_memberships.create!(user: user, role: role, status: 'active')
  end
  
  def remove_member(user)
    deal_room_memberships.where(user: user).destroy_all
  end
  
  def member_count
    deal_room_memberships.active.count
  end
  
  def investor_count
    campaign.equity_investments.successful.distinct.count(:user_id)
  end
  
  def interested_count
    campaign.subscriptions.count
  end
  
  def meetings_count
    deal_room_meetings.scheduled.count
  end
  
  def available_documents
    campaign.investor_documents.where(document_type: ['pitch', 'financial_statement', 'business_plan', 'agreement'])
  end
  
  # And update as_json:
  def as_json(options = {})
    super(options.merge(
      only: [:id, :name, :description, :room_type, :status, :created_at, :updated_at],
      methods: [:member_count, :investor_count, :interested_count, :meetings_count, :private?, :public?]
    )).merge(
      campaign_id: campaign_id,
      user_id: user_id
    )
  end

  def add_creator_as_member
    # Ensure the creator is always a member
    deal_room_memberships.find_or_create_by(user: user) do |membership|
      membership.role = 'admin'
      membership.status = 'active'
    end
  end
end