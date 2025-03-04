class AddInvoiceAndShippingToRewards < ActiveRecord::Migration[7.1]
  def change
    add_column :rewards, :invoice_data, :jsonb
    add_column :rewards, :shipping_info, :jsonb
  end
end
