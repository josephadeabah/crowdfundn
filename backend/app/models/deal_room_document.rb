# app/models/deal_room_document.rb
class DealRoomDocument < ApplicationRecord
  belongs_to :deal_room
  belongs_to :user, optional: true
  
  has_one_attached :file
  
  DOCUMENT_TYPES = %w[
    pitch_deck
    financial_model
    term_sheet
    due_diligence
    legal
    other
  ].freeze
  
  validates :document_type, inclusion: { in: DOCUMENT_TYPES }
  validates :title, presence: true
  
  def file_url
    return unless file.attached?
    
    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{file.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(file)
    end
  end
  
  def file_metadata
    return {} unless file.attached?
    
    {
      filename: file.filename.to_s,
      content_type: file.content_type,
      byte_size: file.byte_size,
      human_size: ActiveSupport::NumberHelper.number_to_human_size(file.byte_size),
      uploaded_at: file.created_at
    }
  end
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :title, :document_type, :description, :created_at, :updated_at]
    )).merge(
      file_url: file_url,
      file_metadata: file_metadata,
      user: user ? { id: user.id, full_name: user.full_name } : nil,
      deal_room_id: deal_room_id
    )
  end
end