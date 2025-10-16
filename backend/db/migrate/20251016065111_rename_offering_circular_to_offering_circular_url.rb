class RenameOfferingCircularToOfferingCircularUrl < ActiveRecord::Migration[7.1]
  def change
    rename_column :campaigns, :offering_circular, :offering_circular_url
  end
end