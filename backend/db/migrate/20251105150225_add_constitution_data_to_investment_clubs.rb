class AddConstitutionDataToInvestmentClubs < ActiveRecord::Migration[7.1]
  def change
    add_column :investment_clubs, :constitution_data, :jsonb
  end
end
