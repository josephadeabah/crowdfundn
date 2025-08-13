# db/migrate/[timestamp]_revert_equity_investments_sti.rb
class RevertEquityInvestmentsSti < ActiveRecord::Migration[7.1]
  class TempDonation < ApplicationRecord
    self.table_name = 'donations'
    has_one_attached :certificate
  end

  def up
    # 1. Recreate the equity_investments table with all columns
    create_table :equity_investments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: { to_table: :campaigns }
      t.decimal :amount, precision: 12, scale: 2
      t.decimal :shares, precision: 20, scale: 4
      t.decimal :percentage, precision: 10, scale: 8
      t.string :certificate_number
      t.date :investment_date
      t.string :transaction_reference
      t.jsonb :metadata, default: {}
      t.string :status
      t.string :email, default: "noemail@example.com", null: false
      t.string :full_name
      t.string :phone
      t.string :country
      t.string :ip_address

      t.timestamps
    end

    # 2. Move data back from donations to equity_investments
    TempDonation.where(type: 'EquityInvestment').find_each do |donation|
      investment = EquityInvestment.create!(
        user_id: donation.user_id,
        campaign_id: donation.campaign_id,
        amount: donation.amount,
        shares: donation.shares,
        percentage: donation.percentage,
        certificate_number: donation.certificate_number,
        investment_date: donation.investment_date,
        transaction_reference: donation.transaction_reference,
        metadata: donation.metadata,
        full_name: donation.full_name,
        phone: donation.phone,
        country: donation.country,
        ip_address: donation.ip_address,
        status: donation.status,
        created_at: donation.created_at,
        updated_at: donation.updated_at
      )
      
      if donation.certificate.attached?
        investment.certificate.attach(donation.certificate.blob)
      end
    end

    # 3. Remove STI columns from donations table
    remove_column :donations, :type
    remove_column :donations, :shares
    remove_column :donations, :percentage
    remove_column :donations, :certificate_number
    remove_column :donations, :investment_date

    # 4. Revert polymorphic association if it exists
    if column_exists?(:donations, :campaign_type)
      rename_column :donations, :campaign_id, :campaign_id_new
      add_column :donations, :campaign_id, :bigint
      execute <<-SQL
        UPDATE donations 
        SET campaign_id = campaign_id_new
        WHERE campaign_type = 'Campaign'
      SQL
      remove_column :donations, :campaign_type
      remove_column :donations, :campaign_id_new
    end

    # 5. Add back foreign key constraint for donations
    add_foreign_key :donations, :campaigns
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end