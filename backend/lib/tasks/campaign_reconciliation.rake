# lib/tasks/campaign_reconciliation.rake
namespace :campaigns do
  desc "Reconcile transferred_amount for all campaigns"
  task reconcile_transferred_amounts: :environment do
    Campaign.find_each do |campaign|
      if campaign.is_a?(EquityCampaign)
        total_transferred = campaign.equity_investments
                                    .successful
                                    .sum(:net_amount)
        
        if campaign.transferred_amount != total_transferred
          puts "Campaign #{campaign.id}: #{campaign.transferred_amount} -> #{total_transferred}"
          campaign.update_column(:transferred_amount, total_transferred)
        end
      end
    end
  end
end