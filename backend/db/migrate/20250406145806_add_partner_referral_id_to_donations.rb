class AddPartnerReferralIdToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :partner_referral_id, :bigint
  end
end
