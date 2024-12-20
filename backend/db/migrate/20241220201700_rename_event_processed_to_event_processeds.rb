class RenameEventProcessedToEventProcesseds < ActiveRecord::Migration[7.1]
  def change
    rename_table :event_processed, :event_processeds
  end
end
