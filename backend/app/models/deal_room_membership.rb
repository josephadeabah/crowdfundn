# app/models/deal_room_membership.rb
class DealRoomMembership < ApplicationRecord
  belongs_to :deal_room
  belongs_to :user
  
  enum :role, {
    admin: 'admin',
    member: 'member',
    viewer: 'viewer'
  }
  
  enum :status, {
    pending: 'pending',
    active: 'active',
    inactive: 'inactive'
  }
  
  validates :user_id, uniqueness: { scope: :deal_room_id }
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :role, :status, :created_at, :updated_at]
    )).merge(
      user: { id: user.id, full_name: user.full_name, email: user.email },
      deal_room_id: deal_room_id
    )
  end
end