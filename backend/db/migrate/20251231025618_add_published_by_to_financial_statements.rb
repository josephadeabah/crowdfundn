class AddPublishedByToFinancialStatements < ActiveRecord::Migration[7.1]
  def change
    add_reference :financial_statements, :published_by, foreign_key: { to_table: :users }, null: true
  end
end
