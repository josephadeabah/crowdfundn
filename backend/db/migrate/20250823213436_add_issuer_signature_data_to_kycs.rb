class AddIssuerSignatureDataToKycs < ActiveRecord::Migration[7.1]
  def change
    add_column :kycs, :issuer_signature_data, :jsonb
  end
end
