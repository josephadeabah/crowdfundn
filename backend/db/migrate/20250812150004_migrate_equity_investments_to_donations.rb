class MigrateEquityInvestmentsToDonations < ActiveRecord::Migration[7.1]
  class TempEquityInvestment < ApplicationRecord
    self.table_name = 'equity_investments'
    has_one_attached :certificate
  end

  def up
    remove_foreign_key :pledges, :equity_investments
    TempEquityInvestment.find_each do |investment|
      donation = Donation.new(
        type: 'EquityInvestment',
        user_id: investment.user_id,
        campaign_id: investment.campaign_id,
        amount: investment.amount,
        shares: investment.shares,
        percentage: investment.percentage,
        certificate_number: investment.certificate_number,
        investment_date: investment.investment_date,
        transaction_reference: investment.transaction_reference,
        metadata: investment.metadata,
        full_name: investment.full_name,
        phone: investment.phone,
        country: investment.country,
        ip_address: investment.ip_address,
        status: investment.status,
        created_at: investment.created_at,
        updated_at: investment.updated_at
      )
      
      # Skip validations that might fail during migration
      donation.save!(validate: false)

      if investment.certificate.attached?
        donation.certificate.attach(investment.certificate.blob)
      end
    end

    drop_table :equity_investments
  end

  def down
    create_table :equity_investments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: { to_table: :equity_campaigns }
      t.references :reward, foreign_key: true
      t.decimal :amount, precision: 12, scale: 2
      t.decimal :shares, precision: 20, scale: 4
      t.decimal :percentage, precision: 10, scale: 8
      t.string :certificate_number
      t.date :investment_date
      t.string :transaction_reference
      t.jsonb :metadata, default: {}
      t.string :status
      t.string :email
      t.string :full_name
      t.string :phone
      t.string :country
      t.string :ip_address

      t.timestamps
    end

    add_foreign_key :pledges, :equity_investments
    Donation.where(type: 'EquityInvestment').find_each do |donation|
      EquityInvestment.create!(
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
        investment = EquityInvestment.find_by(transaction_reference: donation.transaction_reference)
        investment.certificate.attach(donation.certificate.blob) if investment
      end
    end
  end
end