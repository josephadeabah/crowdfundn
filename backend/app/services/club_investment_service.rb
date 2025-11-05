# app/services/club_investment_service.rb
class ClubInvestmentService
  def initialize(club_investment)
    @club_investment = club_investment
    @club = club_investment.investment_club
    @campaign = club_investment.campaign
  end

  def execute_investment
    # Check prerequisites
    return { success: false, error: 'Insufficient funds' } unless @club.can_invest?(@club_investment.investment_amount)
    return { success: false, error: 'Campaign not available' } unless @campaign.active?
    return { success: false, error: 'Investment not approved' } unless @club_investment.approved?

    # Get fundraiser's subaccount using PaystackService
    fundraiser_subaccount = get_fundraiser_subaccount
    return { success: false, error: 'Fundraiser payment account not found' } unless fundraiser_subaccount

    # Initialize transfer using PaystackService
    result = initialize_club_investment_transfer(fundraiser_subaccount)
    
    if result[:status] == true
      # Update investment status to mark transfer initiated
      @club_investment.update!(
        status: 'transfer_initiated',
        transaction_reference: result[:data][:reference]
      )
      
      { success: true, transfer_reference: result[:data][:reference] }
    else
      @club_investment.update!(status: 'failed')
      { success: false, error: result[:message] || 'Transfer initialization failed' }
    end
  end

  def process_investment_execution
    # This is called by the webhook handler after transfer is successful
    ActiveRecord::Base.transaction do
      if @campaign.is_a?(EquityCampaign)
        result = process_equity_investment
      else
        result = process_donation_investment
      end

      if result[:success]
        @club_investment.update!(
          status: 'executed',
          shares_acquired: result[:shares],
          percentage_acquired: result[:percentage],
          executed_at: Time.current
        )
        
        update_club_financials
        distribute_ownership_shares
        
        { success: true, club_investment: @club_investment }
      else
        @club_investment.update!(status: 'failed')
        { success: false, error: result[:error] }
      end
    end
  end

  private

  def get_fundraiser_subaccount
    paystack_service = PaystackService.new
    subaccount = @campaign.fundraiser.subaccount
    
    if subaccount&.subaccount_code.present?
      # Verify the subaccount exists on Paystack
      response = paystack_service.fetch_subaccount(subaccount.subaccount_code)
      response[:status] ? subaccount : nil
    else
      nil
    end
  end

  def initialize_club_investment_transfer(fundraiser_subaccount)
    paystack_service = PaystackService.new
    
    metadata = {
      type: 'club_investment',
      club_investment_id: @club_investment.id,
      club_id: @club.id,
      campaign_id: @campaign.id,
      amount: @club_investment.investment_amount
    }

    # Use PaystackService to initiate transfer
    paystack_service.initiate_transfer(
      amount: @club_investment.investment_amount,
      recipient: fundraiser_subaccount.subaccount_code,
      reason: "Club investment in #{@campaign.title}",
      currency: @campaign.currency.upcase
    )
  end

  def process_equity_investment
    # Use the same logic as your individual equity investments
    price_per_share = @campaign.valuation.to_f / @campaign.total_shares.to_f
    shares = (@club_investment.investment_amount / price_per_share).round(4)
    percentage = (shares / @campaign.total_shares.to_f) * 100

    # Update campaign shares available (same as individual investments)
    @campaign.with_lock do
      if shares > @campaign.shares_available
        return { success: false, error: 'Not enough shares available' }
      end
      @campaign.update!(shares_available: @campaign.shares_available - shares)
    end

    { success: true, shares: shares, percentage: percentage }
  end

  def process_donation_investment
    # For donation campaigns, update the campaign totals (same as individual donations)
    @campaign.with_lock do
      @campaign.update!(
        current_amount: @campaign.current_amount + @club_investment.investment_amount,
        total_successful_donations: @campaign.total_successful_donations + @club_investment.investment_amount
      )
    end

    { success: true, shares: nil, percentage: nil }
  end

  def update_club_financials
    @club.update_financials
  end

  def distribute_ownership_shares
    active_members = @club.active_members
    
    active_members.each do |member|
      membership = @club.membership_for(member)
      member_share = (membership.current_share / 100) * @club_investment.percentage_acquired.to_f
      
      MemberInvestmentShare.find_or_create_by(
        user: member,
        club_investment: @club_investment
      ).update!(
        share_percentage: member_share,
        effective_shares: (member_share / 100) * @club_investment.shares_acquired.to_f
      )
    end
  end
end