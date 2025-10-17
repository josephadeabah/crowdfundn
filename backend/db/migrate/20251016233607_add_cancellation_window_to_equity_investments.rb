class AddCancellationWindowToEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :equity_investments, :committed_at, :datetime
    add_column :equity_investments, :cancel_window_expires_at, :datetime
    add_column :equity_investments, :cancellation_reason, :text
    add_column :equity_investments, :cancelled_at, :datetime
  end
end
