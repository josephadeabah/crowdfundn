# db/migrate/[timestamp]_add_missing_fields_to_equity_investments.rb
class AddMissingFieldsToEquityInvestments < ActiveRecord::Migration[7.1]
  def up
    change_table :equity_investments do |t|
      t.decimal :percentage, precision: 10, scale: 4
      t.string :certificate_number
      t.date :investment_date
      t.rename :share_count, :shares
      
      # Remove the old status column
      t.remove :status
      
      # Add new status column as integer with default
      t.integer :status, default: 0
    end

    add_index :equity_investments, :certificate_number, unique: true
    
    # Convert existing string statuses to integer values
    EquityInvestment.reset_column_information
    EquityInvestment.find_each do |investment|
      status_value = case investment.read_attribute(:status)
                     when 'pending' then 0
                     when 'completed' then 1
                     when 'canceled' then 2
                     when 'refunded' then 3
                     when 'failed' then 4
                     else 0
                     end
      investment.update_column(:status, status_value)
    end
  end

  def down
    change_table :equity_investments do |t|
      t.remove :percentage
      t.remove :certificate_number
      t.remove :investment_date
      t.rename :shares, :share_count
      
      # Remove the integer status column
      t.remove :status
      
      # Add back string status column
      t.string :status
    end
    
    remove_index :equity_investments, :certificate_number
  end
end