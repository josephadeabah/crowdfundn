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
      campaign: {
        id: @investment.campaign.id,
        title: @investment.campaign.title,
        slug: @investment.campaign.slug,
        status: @investment.campaign.status,
        valuation: @investment.campaign.valuation,
        equity_offered: @investment.campaign.equity_offered,
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
      }
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
end