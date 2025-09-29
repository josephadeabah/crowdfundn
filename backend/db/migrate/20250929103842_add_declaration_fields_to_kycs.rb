class AddDeclarationFieldsToKycs < ActiveRecord::Migration[7.1]
  def change
    add_column :kycs, :accredited_investor, :boolean
    add_column :kycs, :nominee_agreement_accepted, :boolean
    add_column :kycs, :risk_acknowledgment, :boolean
    add_column :kycs, :terms_accepted, :boolean
    add_column :kycs, :data_consent, :boolean
  end
end
