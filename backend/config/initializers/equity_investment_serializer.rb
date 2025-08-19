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
        equity_offered: @investment.campaign.equity_offered
      },
      certificate: {
        exists: @investment.certificate_present?,
        url: @investment.certificate_url,
        number: @investment.certificate_number
      }
    }
  end
end