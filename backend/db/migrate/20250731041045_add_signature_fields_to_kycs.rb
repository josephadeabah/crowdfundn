class AddSignatureFieldsToKycs < ActiveRecord::Migration[7.1]
  def change
    add_column :kycs, :investor_signature_data, :jsonb
    add_column :kycs, :issuer_accepted_terms, :boolean, default: false
  end
end