# app/models/deal_room_conversation.rb
class DealRoomConversation < ApplicationRecord
  belongs_to :deal_room
  belongs_to :user, optional: true
  
  has_many :deal_room_messages, dependent: :destroy
  
  validates :title, presence: true
  
  scope :public_channels, -> { where(private: false) }
  scope :for_user, ->(user) {
    left_joins(:deal_room => :deal_room_memberships)
      .where("deal_room_memberships.user_id = ? OR deal_room_conversations.private = ?", user.id, false)
      .distinct
  }
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :title, :private, :created_at, :updated_at]
    )).merge(
      user: user ? { id: user.id, full_name: user.full_name } : nil,
      deal_room_id: deal_room_id,
      message_count: deal_room_messages.count
    )
  end
end