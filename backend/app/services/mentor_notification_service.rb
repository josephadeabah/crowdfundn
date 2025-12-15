# app/services/notification_service.rb
class MentorNotificationService
  def self.new_mentor_application_submitted(application)
    # Notify admins about new mentor application
    admin_users = User.joins(:roles).where(roles: { name: 'Admin' })
    
    admin_users.each do |admin|
      Notification.create(
        user: admin,
        title: 'New Mentor Application',
        message: "#{application.user.full_name} has submitted a mentor application",
        notification_type: 'mentor_application',
        metadata: {
          application_id: application.id,
          applicant_name: application.user.full_name
        }
      )
    end
  end
  
  def self.new_mentor_request(assignment)
    # Notify mentor about new request
    Notification.create(
      user: assignment.mentor.user,
      title: 'New Mentor Request',
      message: "#{assignment.entrepreneur.full_name} has requested you as a mentor for their venture",
      notification_type: 'mentor_request',
      metadata: {
        assignment_id: assignment.id,
        campaign_id: assignment.campaign.id,
        campaign_title: assignment.campaign.title,
        entrepreneur_name: assignment.entrepreneur.full_name
      }
    )
    
    # Notify entrepreneur that request was sent
    Notification.create(
      user: assignment.entrepreneur,
      title: 'Mentor Request Sent',
      message: "Your mentor request to #{assignment.mentor.user.full_name} has been sent",
      notification_type: 'mentor_request_sent',
      metadata: {
        assignment_id: assignment.id,
        mentor_name: assignment.mentor.user.full_name
      }
    )
  end
  
  def self.send_mentor_assignment_notification(assignment, event_type)
    case event_type
    when :assignment_approved
      Notification.create(
        user: assignment.entrepreneur,
        title: 'Mentor Request Approved',
        message: "#{assignment.mentor.user.full_name} has accepted your mentor request",
        notification_type: 'mentor_assignment_approved',
        metadata: {
          assignment_id: assignment.id,
          mentor_name: assignment.mentor.user.full_name
        }
      )
    when :assignment_completed
      Notification.create(
        user: assignment.entrepreneur,
        title: 'Mentorship Completed',
        message: "Your mentorship with #{assignment.mentor.user.full_name} has been completed",
        notification_type: 'mentor_assignment_completed',
        metadata: {
          assignment_id: assignment.id,
          mentor_name: assignment.mentor.user.full_name,
          rating: assignment.rating
        }
      )
      
      Notification.create(
        user: assignment.mentor.user,
        title: 'Mentorship Completed',
        message: "Your mentorship with #{assignment.entrepreneur.full_name} has been completed",
        notification_type: 'mentor_assignment_completed',
        metadata: {
          assignment_id: assignment.id,
          entrepreneur_name: assignment.entrepreneur.full_name,
          rating: assignment.rating
        }
      )
    when :assignment_cancelled
      Notification.create(
        user: assignment.entrepreneur,
        title: 'Mentorship Cancelled',
        message: "Your mentorship with #{assignment.mentor.user.full_name} has been cancelled",
        notification_type: 'mentor_assignment_cancelled',
        metadata: {
          assignment_id: assignment.id,
          mentor_name: assignment.mentor.user.full_name,
          reason: assignment.cancellation_reason
        }
      )
      
      Notification.create(
        user: assignment.mentor.user,
        title: 'Mentorship Cancelled',
        message: "Your mentorship with #{assignment.entrepreneur.full_name} has been cancelled",
        notification_type: 'mentor_assignment_cancelled',
        metadata: {
          assignment_id: assignment.id,
          entrepreneur_name: assignment.entrepreneur.full_name,
          reason: assignment.cancellation_reason
        }
      )
    end
  end
end