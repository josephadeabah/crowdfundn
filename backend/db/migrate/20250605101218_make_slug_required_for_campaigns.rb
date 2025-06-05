class MakeSlugRequiredForCampaigns < ActiveRecord::Migration[7.1]
    def change
    change_column_null :campaigns, :slug, false
  end
end
