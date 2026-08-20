# app/models/investor_portfolio_statement.rb
class InvestorPortfolioStatement < ApplicationRecord
  belongs_to :user
  
  has_one_attached :file
  
  validates :period, presence: true
  validates :file_format, inclusion: { in: %w[pdf csv excel json] }
  
  before_destroy :purge_file
  
  def file_url
    return unless file.attached?
    
    if Rails.env.production?
      "#{ENV.fetch('SUPABASE_URL')}/storage/v1/object/public/#{ENV.fetch('SUPABASE_STORAGE_BUCKET')}/#{file.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(file)
    end
  end
  
  def download_filename
    "portfolio_statement_#{user.id}_#{generated_at.to_i}.#{file_format}"
  end
  
  private
  
  def purge_file
    file.purge if file.attached?
  end
end