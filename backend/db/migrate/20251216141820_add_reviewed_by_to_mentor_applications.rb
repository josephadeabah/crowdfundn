class AddReviewedByToMentorApplications < ActiveRecord::Migration[7.1]
  def change
    add_reference :mentor_applications, :reviewed_by, foreign_key: { to_table: :users }
  end
end
