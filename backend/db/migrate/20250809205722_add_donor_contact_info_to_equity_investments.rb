# db/migrate/[timestamp]_add_donor_contact_info_to_equity_investments.rb
class AddDonorContactInfoToEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    change_table :equity_investments do |t|
      t.string :email, default: "noemail@example.com", null: false
      t.string :phone
      t.string :full_name
      
      # Update existing fields to match donations schema constraints
      t.change :ip_address, :string
      t.change :country, :string
    end
  end
end