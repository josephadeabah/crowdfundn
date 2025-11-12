class CreateMemberShareChanges < ActiveRecord::Migration[7.1]
  def change
    create_table :member_share_changes do |t|
      t.references :investment_club_membership, null: false, foreign_key: true
      t.references :investment_club_contribution, null: true, foreign_key: true
      t.decimal :previous_share, precision: 8, scale: 4, null: false
      t.decimal :new_share, precision: 8, scale: 4, null: false
      t.decimal :change_amount, precision: 8, scale: 4, null: false
      t.decimal :total_contributions_at_time, precision: 12, scale: 2
      t.string :change_reason

      t.timestamps
    end

    add_index :member_share_changes, :created_at
    add_index :member_share_changes, [:investment_club_membership_id, :created_at], name: 'index_share_changes_on_membership_and_created_at'
  end
end
