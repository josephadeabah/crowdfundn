# app/mailers/club_mailer.rb
class ClubMailer < ApplicationMailer
  def pending_member_notification(admin, membership)
    @admin = admin
    @membership = membership
    @club = membership.investment_club
    
    mail(
      to: @admin.email,
      subject: "New member request for #{@club.name}"
    )
  end

    # ADD THIS MISSING METHOD
  def membership_approved(user, membership)
    @user = user
    @membership = membership
    @club = membership.investment_club
    
    mail(
      to: @user.email,
      subject: "Your membership to #{@club.name} has been approved!"
    )
  end

  def membership_rejected(user, membership)
    @user = user
    @membership = membership
    @club = membership.investment_club
    
    mail(
      to: @user.email,
      subject: "Update on your membership request for #{@club.name}"
    )
  end

  def membership_role_changed(user, membership)
    @user = user
    @membership = membership
    @club = membership.investment_club
    
    mail(
      to: @user.email,
      subject: "Your role in #{@club.name} has been updated"
    )
  end
  
  def membership_status_changed(user, membership)
    @user = user
    @membership = membership
    @club = membership.investment_club
    
    mail(
      to: @user.email,
      subject: "Your membership status in #{@club.name} has been updated"
    )
  end
  
  def voting_reminder(user, club_investment)
    @user = user
    @club_investment = club_investment
    @club = club_investment.investment_club
    @campaign = club_investment.campaign
    
    mail(
      to: @user.email,
      subject: "Vote pending: #{@campaign.title} in #{@club.name}"
    )
  end
  
  def investment_executed(club_investment)
    @club_investment = club_investment
    @club = club_investment.investment_club
    @campaign = club_investment.campaign
    
    # Send to all club members
    @club.active_members.each do |member|
      mail(
        to: member.email,
        subject: "Investment executed: #{@campaign.title}"
      )
    end
  end
end