# migration file
class ChangeSignatureColumnsToJson < ActiveRecord::Migration[7.1]
  def change
    change_column :kycs, :signature_data, :json
    change_column :kycs, :investor_signature_data, :json  
    change_column :kycs, :issuer_signature_data, :json
  end
end