# app/mailers/meeting_mailer.rb
class MeetingMailer < ApplicationMailer
  default from: 'meetings@yourplatform.com'
  
  def invitation_email(meeting, user)
    @meeting = meeting
    @user = user
    @deal_room = meeting.deal_room
    @accept_url = accept_meeting_invitation_url(meeting_id: @meeting.id, token: generate_token(@user))
    @decline_url = decline_meeting_invitation_url(meeting_id: @meeting.id, token: generate_token(@user))
    
    mail(
      to: @user.email,
      subject: "Meeting Invitation: #{@meeting.title}"
    )
  end
  
  def reminder_email(meeting, user)
    @meeting = meeting
    @user = user
    @join_url = @meeting.meeting_link
    
    mail(
      to: @user.email,
      subject: "Reminder: #{@meeting.title} starts in 1 hour"
    )
  end
  
  def update_email(meeting, user, changes)
    @meeting = meeting
    @user = user
    @changes = changes
    @join_url = @meeting.meeting_link
    
    mail(
      to: @user.email,
      subject: "Meeting Updated: #{@meeting.title}"
    )
  end
  
  def status_change_email(meeting, user, previous_status)
    @meeting = meeting
    @user = user
    @previous_status = previous_status
    @current_status = meeting.status
    
    mail(
      to: @user.email,
      subject: "Meeting #{@meeting.title} status changed"
    )
  end
  
  def rsvp_confirmation_email(meeting, user, status)
    @meeting = meeting
    @user = user
    @status = status
    
    mail(
      to: @user.email,
      subject: "RSVP Confirmation: #{@meeting.title}"
    )
  end
  
  def canceled_email(meeting, user, reason)
    @meeting = meeting
    @user = user
    @reason = reason
    
    mail(
      to: @user.email,
      subject: "Meeting Canceled: #{@meeting.title}"
    )
  end
  
  private
  
  def generate_token(user)
    # Generate a secure token for meeting actions
    JWT.encode({
      user_id: user.id,
      meeting_id: @meeting.id,
      exp: 7.days.from_now.to_i
    }, Rails.application.credentials.secret_key_base)
  end
end