class DealRoomMessage < ApplicationRecord
  belongs_to :deal_room_conversation
  belongs_to :user, optional: true
  has_many :deal_room_message_reads, dependent: :destroy
  has_many :read_by_users, through: :deal_room_message_reads, source: :user
  
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
        message: as_json,
        conversation_id: deal_room_conversation_id
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
        data: { 
          deal_room_id: deal_room_conversation.deal_room_id,
          conversation_id: deal_room_conversation_id,
          message_id: id
        }
      )
    end
  end
  
  def mark_as_read!(user)
    deal_room_message_reads.find_or_create_by(user: user)
  end
  
  def read_by?(user)
    deal_room_message_reads.exists?(user: user)
  end
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :content, :message_type, :created_at, :updated_at]
    )).merge(
      user: user ? { 
        id: user.id, 
        full_name: user.full_name, 
        email: user.email,
        avatar: user.avatar_url 
      } : nil,
      attachment_url: attachment.attached? ? file_url : nil,
      attachment_metadata: attachment.attached? ? file_metadata : nil,
      deal_room_conversation_id: deal_room_conversation_id,
      read_by: deal_room_message_reads.count,
      can_edit: options[:current_user] ? (user == options[:current_user] || options[:current_user].admin?) : false
    )
  end
  
  private
  
  def file_url
    return unless attachment.attached?
    
    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{attachment.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(attachment, only_path: false)
    end
  end
  
  def file_metadata
    return {} unless attachment.attached?
    
    {
      filename: attachment.filename.to_s,
      content_type: attachment.content_type,
      byte_size: attachment.byte_size,
      human_size: ActiveSupport::NumberHelper.number_to_human_size(attachment.byte_size)
    }
  end
end