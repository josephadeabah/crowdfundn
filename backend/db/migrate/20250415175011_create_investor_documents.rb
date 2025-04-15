class CreateInvestorDocuments < ActiveRecord::Migration[7.1]
  def change
    create_table :investor_documents do |t|
      t.references :user, null: false, foreign_key: true
      t.string :document_type

      t.timestamps
    end
  end
end
