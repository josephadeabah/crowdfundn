# app/serializers/equity_investment_serializer.rb
class EquityInvestmentSerializer
  def initialize(investment)
    @investment = investment
  end

  def as_json
    {
      id: @investment.id,
      amount: @investment.amount,
      shares: @investment.shares,
      percentage: @investment.percentage,
      status: @investment.status,
      created_at: @investment.created_at,
      current_value: @investment.current_value,
      total_returns: @investment.total_returns,
      roi: @investment.roi,
      # Add currency information to the investment
      currency: @investment.campaign.currency,
      currency_symbol: @investment.campaign.currency_symbol,
      # ADD CANCELLATION WINDOW FIELDS:
      can_be_cancelled: @investment.can_be_cancelled?,
      cancel_window_expires_at: @investment.cancel_window_expires_at,
      committed_at: @investment.committed_at,
      time_remaining_for_cancellation: @investment.time_remaining_for_cancellation, # NEW: Added for countdown timer
      campaign: {
        id: @investment.campaign.id,
        title: @investment.campaign.title,
        slug: @investment.campaign.slug,
        status: @investment.campaign.status,
        valuation: @investment.campaign.valuation,
        equity_offered: @investment.campaign.equity_offered,
        company_name: @investment.campaign.company_name,
        company_description: @investment.campaign.company_description,
        company_headquarters: @investment.campaign.company_headquarters,
        company_website: @investment.campaign.company_website,
        contract_term: @investment.campaign.contract_term,
        # Add currency to campaign as well
        currency: @investment.campaign.currency,
        currency_symbol: @investment.campaign.currency_symbol,
        fundraiser: {
          id: @investment.campaign.fundraiser.id,
          name: @investment.campaign.fundraiser.full_name,
          email: @investment.campaign.fundraiser.email
        }
      },
      certificate: {
        exists: @investment.certificate_present?,
        url: @investment.certificate_url,
        number: @investment.certificate_number
      },
      signatures: {
        investor: investor_signature_url,
        issuer: issuer_signature_url
      },
      investor: {
        id: @investment.user&.id,
        name: @investment.user&.full_name || @investment.full_name,
        email: @investment.user&.email || @investment.email
      },
      # ADD COMPANY INFO AND TEAM MEMBERS FOR EXPANDED VIEW:
      company_info: {
        name: @investment.campaign.company_name,
        description: @investment.campaign.company_description,
        headquarters: @investment.campaign.company_headquarters,
        website: @investment.campaign.company_website,
        contract_term: @investment.campaign.contract_term
      },
      team_members: team_members_data
    }
  end

  private

  def investor_signature_url
    return nil unless @investment.user
    @investment.user.latest_kyc&.signature_image_url
  end

  def issuer_signature_url
    issuer = @investment.campaign.fundraiser
    return nil unless issuer
    issuer.latest_kyc&.issuer_signature_url || issuer.latest_kyc&.signature_image_url
  end

  def team_members_data
    @investment.campaign.campaign_team_members.map do |team_member|
      {
        id: team_member.id,
        name: team_member.name,
        email: team_member.email,
        role: team_member.role,
        title: team_member.title,
        equity_percentage: team_member.equity_percentage,
        description: team_member.description,
        avatar_url: team_member.avatar_url,
        user: team_member.user ? {
          id: team_member.user.id,
          name: team_member.user.full_name
        } : nil
      }
    end
  end
end