class AddSignatureTimestampsToKycs < ActiveRecord::Migration[7.1]
  def change
    add_column :kycs, :signature_completed_at, :datetime
    add_column :kycs, :issuer_signature_completed_at, :datetime
  end
end
