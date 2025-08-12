class AddPolymorphicToDonations < ActiveRecord::Migration[7.0]
  def change
    # Rename existing column first
    rename_column :donations, :campaign_id, :campaign_id_old
    
    # Add polymorphic columns (this will add both campaign_id and campaign_type)
    add_reference :donations, :campaign, polymorphic: true
    
    # Data migration
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE donations 
          SET campaign_type = 'Campaign', 
              campaign_id = campaign_id_old
        SQL
      end
      dir.down do
        execute <<-SQL
          UPDATE donations 
          SET campaign_id_old = campaign_id
        SQL
      end
    end
    
    # Remove old column (optional - you might want to keep it temporarily)
    remove_column :donations, :campaign_id_old
  end
end