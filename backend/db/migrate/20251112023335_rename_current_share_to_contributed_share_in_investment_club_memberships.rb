class RenameCurrentShareToContributedShareInInvestmentClubMemberships < ActiveRecord::Migration[7.1]
  def change
    rename_column :investment_club_memberships, :current_share, :contributed_share
  end
end
