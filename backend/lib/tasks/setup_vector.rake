# lib/tasks/setup_vector.rake
namespace :db do
  namespace :vector do
    desc "Enable vector extension and convert JSON to vector (for production)"
    task setup: :environment do
      if ActiveRecord::Base.connection.table_exists?('campaigns') && 
         Campaign.column_names.include?('ai_embedding')
        
        puts "Setting up vector extension..."
        
        begin
          # Enable vector extension
          ActiveRecord::Base.connection.execute("CREATE EXTENSION IF NOT EXISTS vector")
          puts "✅ Vector extension enabled"
          
          # Check if we need to convert from JSON to vector
          column_info = ActiveRecord::Base.connection.columns('campaigns')
                                            .find { |c| c.name == 'ai_embedding' }
          
          if column_info.sql_type == 'jsonb'
            puts "Converting JSONB column to vector..."
            
            # Add a temporary vector column
            ActiveRecord::Base.connection.execute(<<~SQL)
              ALTER TABLE campaigns 
              ADD COLUMN ai_embedding_temp vector(1536)
            SQL
            
            # Copy data from JSON to vector
            ActiveRecord::Base.connection.execute(<<~SQL)
              UPDATE campaigns 
              SET ai_embedding_temp = ai_embedding::text::vector 
              WHERE ai_embedding IS NOT NULL
            SQL
            
            # Drop the old column and rename the new one
            ActiveRecord::Base.connection.execute(<<~SQL)
              ALTER TABLE campaigns 
              DROP COLUMN ai_embedding,
              RENAME COLUMN ai_embedding_temp TO ai_embedding
            SQL
            
            # Add vector index
            ActiveRecord::Base.connection.execute(<<~SQL)
              CREATE INDEX CONCURRENTLY IF NOT EXISTS 
              index_campaigns_on_ai_embedding_vector 
              ON campaigns 
              USING ivfflat (ai_embedding vector_cosine_ops)
            SQL
            
            puts "✅ JSONB column converted to vector"
          else
            puts "✅ Column is already vector type"
          end
          
        rescue => e
          puts "❌ Error setting up vector: #{e.message}"
          puts "Continuing with JSON storage..."
        end
        
      else
        puts "❌ Campaigns table or ai_embedding column not found"
      end
    end

    desc "Check vector extension status"
    task status: :environment do
      begin
        # Check if vector extension is enabled
        result = ActiveRecord::Base.connection.execute(<<~SQL)
          SELECT EXISTS(
            SELECT 1 FROM pg_extension WHERE extname = 'vector'
          ) as vector_enabled
        SQL
        
        vector_enabled = result[0]['vector_enabled']
        
        # Check column type
        column_info = ActiveRecord::Base.connection.columns('campaigns')
                                          .find { |c| c.name == 'ai_embedding' }
        
        puts "Vector extension enabled: #{vector_enabled}"
        puts "ai_embedding column type: #{column_info&.sql_type || 'not found'}"
        
        if vector_enabled && column_info&.sql_type == 'USER-DEFINED'
          puts "✅ Vector setup is complete and working"
        elsif vector_enabled
          puts "⚠️  Vector enabled but column needs conversion"
        else
          puts "❌ Vector not enabled - using JSON storage"
        end
        
      rescue => e
        puts "❌ Error checking vector status: #{e.message}"
      end
    end
  end
end