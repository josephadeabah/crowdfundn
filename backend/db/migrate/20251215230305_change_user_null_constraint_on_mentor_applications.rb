class ChangeUserNullConstraintOnMentorApplications < ActiveRecord::Migration[7.1]
  def change
    change_column_null :mentor_applications, :user_id, true
  end
end
