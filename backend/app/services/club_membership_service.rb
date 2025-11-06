# app/services/club_membership_service.rb
class ClubMembershipService
  def initialize(membership)
    @membership = membership
    @club = membership.investment_club
    @user = membership.user
  end

  def handle_member_removal
    return unless @membership.active?
    
    ActiveRecord::Base.transaction do
      redistribute_investment_shares
      update_club_financials
    end
  end

  def transfer_ownership(new_admin_id)
    new_admin_membership = @club.investment_club_memberships.find_by(user_id: new_admin_id)
    return { success: false, error: 'New admin not found' } unless new_admin_membership
    
    ActiveRecord::Base.transaction do
      @membership.update!(role: 'admin') # Demote current creator to admin
      new_admin_membership.update!(role: 'creator') # Promote new admin to creator
      
      { success: true, message: 'Ownership transferred successfully' }
    end
  rescue => e
    { success: false, error: e.message }
  end

  private

  def redistribute_investment_shares
    member_shares = MemberInvestmentShare.where(user: @user)
    
    member_shares.each do |share|
      club_investment = share.club_investment
      next unless club_investment.executed? # Only redistribute executed investments
      
      remaining_members = @club.active_members.where.not(id: @user.id)
      
      if remaining_members.any?
        share_per_member = share.share_percentage / remaining_members.count
        
        remaining_members.each do |member|
          existing_share = MemberInvestmentShare.find_or_initialize_by(
            user: member,
            club_investment: club_investment
          )
          
          new_share_percentage = existing_share.share_percentage.to_f + share_per_member
          existing_share.update!(
            share_percentage: new_share_percentage,
            effective_shares: (new_share_percentage / 100) * club_investment.shares_acquired.to_f
          )
        end
      end
      
      share.destroy
    end
  end

  def update_club_financials
    @club.update_financials
  end
end