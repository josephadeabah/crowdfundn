class CreateFundraisers < ActiveRecord::Migration[7.1]
  def change
    create_table :fundraisers do |t|
      t.string :name
      t.string :contact_information
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
