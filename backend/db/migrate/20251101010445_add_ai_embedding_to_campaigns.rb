# db/migrate/20251101005543_add_ai_embedding_to_campaigns.rb
class AddAiEmbeddingToCampaigns < ActiveRecord::Migration[7.1]
  def change
    # Add JSONB column for local development
    # This will be converted to vector in production on DigitalOcean
    add_column :campaigns, :ai_embedding, :jsonb
    
    # Add index for JSONB (works for both JSON and vector in production)
    add_index :campaigns, :ai_embedding, using: :gin
  end
end