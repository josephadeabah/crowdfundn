class AddOtpRequiredToTransfers < ActiveRecord::Migration[7.1]
  def change
    add_column :transfers, :otp_required, :boolean, default: false, null: false
  end
end
