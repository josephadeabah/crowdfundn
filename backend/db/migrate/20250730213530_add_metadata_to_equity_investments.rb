class AddMetadataToEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :equity_investments, :metadata, :jsonb, default: {}
    add_index :equity_investments, :metadata, using: :gin  # Optional but recommended for querying
  end
end
