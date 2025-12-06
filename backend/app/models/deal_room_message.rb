# app/models/deal_room_message.rb
class DealRoomMessage < ApplicationRecord
  belongs_to :deal_room_conversation
  belongs_to :user, optional: true
  
  has_one_attached :attachment
  
  enum :message_type, {
    text: 'text',
    system: 'system',
    file: 'file'
  }
  
  validates :content, presence: true, unless: -> { attachment.attached? }
  
  after_create_commit :broadcast_message
  after_create :notify_mentioned_users
  
  def broadcast_message
    DealRoomChannel.broadcast_to(
      deal_room_conversation.deal_room,
      {
        type: 'new_message',
        message: as_json
      }
    )
  end
  
  def notify_mentioned_users
    mentioned_usernames = content.scan(/@(\w+)/).flatten
    mentioned_users = User.where(username: mentioned_usernames)
    
    mentioned_users.each do |user|
      Notification.create!(
        user: user,
        title: "You were mentioned in #{deal_room_conversation.title}",
        body: content.truncate(100),
        notification_type: 'mention',
        data: { deal_room_id: deal_room_conversation.deal_room_id }
      )
    end
  end
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :content, :message_type, :created_at, :updated_at]
    )).merge(
      user: user ? { id: user.id, full_name: user.full_name, email: user.email } : nil,
      attachment_url: attachment.attached? ? file_url : nil,
      attachment_metadata: attachment.attached? ? file_metadata : nil,
      deal_room_conversation_id: deal_room_conversation_id
    )
  end
  
  private
  
  def file_url
    return unless attachment.attached?
    
    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{attachment.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(attachment)
    end
  end
  
  def file_metadata
    return {} unless attachment.attached?
    
    {
      filename: attachment.filename.to_s,
      content_type: attachment.content_type,
      byte_size: attachment.byte_size
    }
  end
end