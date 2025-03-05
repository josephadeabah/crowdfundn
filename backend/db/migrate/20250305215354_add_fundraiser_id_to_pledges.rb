class AddFundraiserIdToPledges < ActiveRecord::Migration[7.1]
  def change
    add_column :pledges, :fundraiser_id, :integer
  end
end
