class CreateBackerRewards < ActiveRecord::Migration[7.1]
  def change
    create_table :backer_rewards do |t|
      t.references :user, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: true
      t.string :level
      t.integer :points_required
      t.text :description

      t.timestamps
    end
  end
end
