# lib/tasks/vector_setup.rake
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
            
            # Drop the old column
            ActiveRecord::Base.connection.execute(<<~SQL)
              ALTER TABLE campaigns 
              DROP COLUMN ai_embedding
            SQL
            
            # Rename the new column
            ActiveRecord::Base.connection.execute(<<~SQL)
              ALTER TABLE campaigns 
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
          puts "Backtrace: #{e.backtrace.first(5).join("\n")}" # First 5 lines of backtrace
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

    desc "Rollback vector conversion (convert back to JSONB)"
    task rollback: :environment do
      if ActiveRecord::Base.connection.table_exists?('campaigns') && 
         Campaign.column_names.include?('ai_embedding')
        
        puts "Rolling back vector conversion..."
        
        begin
          # Check current column type
          column_info = ActiveRecord::Base.connection.columns('campaigns')
                                            .find { |c| c.name == 'ai_embedding' }
          
          if column_info.sql_type == 'USER-DEFINED' # This indicates vector type
            puts "Converting vector column back to JSONB..."
            
            # Add a temporary JSONB column
            ActiveRecord::Base.connection.execute(<<~SQL)
              ALTER TABLE campaigns 
              ADD COLUMN ai_embedding_temp JSONB
            SQL
            
            # Copy data from vector to JSONB
            ActiveRecord::Base.connection.execute(<<~SQL)
              UPDATE campaigns 
              SET ai_embedding_temp = ai_embedding::text::jsonb 
              WHERE ai_embedding IS NOT NULL
            SQL
            
            # Drop vector index if exists
            ActiveRecord::Base.connection.execute(<<~SQL)
              DROP INDEX IF EXISTS index_campaigns_on_ai_embedding_vector
            SQL
            
            # Drop the old column
            ActiveRecord::Base.connection.execute(<<~SQL)
              ALTER TABLE campaigns 
              DROP COLUMN ai_embedding
            SQL
            
            # Rename the new column
            ActiveRecord::Base.connection.execute(<<~SQL)
              ALTER TABLE campaigns 
              RENAME COLUMN ai_embedding_temp TO ai_embedding
            SQL
            
            puts "✅ Vector column converted back to JSONB"
          else
            puts "✅ Column is already JSONB type"
          end
          
        rescue => e
          puts "❌ Error rolling back vector conversion: #{e.message}"
          puts "Backtrace: #{e.backtrace.first(5).join("\n")}"
        end
        
      else
        puts "❌ Campaigns table or ai_embedding column not found"
      end
    end

    desc "Reset vector setup (disable extension and convert back to JSONB)"
    task reset: :environment do
      Rake::Task['db:vector:rollback'].invoke
      
      begin
        # Disable vector extension
        ActiveRecord::Base.connection.execute("DROP EXTENSION IF EXISTS vector")
        puts "✅ Vector extension disabled"
      rescue => e
        puts "❌ Error disabling vector extension: #{e.message}"
      end
    end
  end
end