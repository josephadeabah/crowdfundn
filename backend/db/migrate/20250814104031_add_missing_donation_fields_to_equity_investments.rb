# db/migrate/[timestamp]_add_missing_donation_fields_to_equity_investments.rb
class AddMissingDonationFieldsToEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    # Only add columns if they don't exist
    unless column_exists?(:equity_investments, :gross_amount)
      add_column :equity_investments, :gross_amount, :decimal, precision: 15, scale: 2, default: 0.0, null: false
    end

    unless column_exists?(:equity_investments, :net_amount)
      add_column :equity_investments, :net_amount, :decimal, precision: 15, scale: 2, default: 0.0, null: false
    end

    unless column_exists?(:equity_investments, :plan)
      add_column :equity_investments, :plan, :string
    end

    unless column_exists?(:equity_investments, :subscription_code)
      add_column :equity_investments, :subscription_code, :string
    end

    unless column_exists?(:equity_investments, :platform_fee)
      add_column :equity_investments, :platform_fee, :decimal, precision: 10, scale: 2, default: 0.0
    end

    unless column_exists?(:equity_investments, :processed)
      add_column :equity_investments, :processed, :boolean, default: false, null: false
    end

    unless column_exists?(:equity_investments, :reward_id)
      add_column :equity_investments, :reward_id, :integer
    end

    # Don't add campaign_id reference if it already exists
    unless column_exists?(:equity_investments, :campaign_id)
      add_reference :equity_investments, :campaign, foreign_key: true
    end

    # Change status to string if it exists
    if column_exists?(:equity_investments, :status)
      change_column :equity_investments, :status, :string, default: 'pending'
    else
      add_column :equity_investments, :status, :string, default: 'pending'
    end

    # Only add indexes if they don't exist
    unless index_exists?(:equity_investments, :status)
      add_index :equity_investments, :status
    end

    unless index_exists?(:equity_investments, :subscription_code)
      add_index :equity_investments, :subscription_code, unique: true
    end
  end
end