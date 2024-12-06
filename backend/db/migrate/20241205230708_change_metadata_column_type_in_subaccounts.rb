class ChangeMetadataColumnTypeInSubaccounts < ActiveRecord::Migration[7.1]
  def change
    # Change the metadata column type to jsonb
    change_column :subaccounts, :metadata, :jsonb, using: 'metadata::jsonb', default: {}
  end
end
