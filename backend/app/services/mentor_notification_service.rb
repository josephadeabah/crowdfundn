# app/services/mentor_notification_service.rb
class MentorNotificationService
  def self.new_mentor_application_submitted(application:)
    # Notify admins about new mentor application
    admin_users = User.joins(:roles).where(roles: { name: 'Admin' })
    
    admin_users.each do |admin|
      self.send_mentor_application_email(
        admin: admin,
        application: application
      )
    end
  end
  
  def self.new_mentor_request(assignment:)
    # Send email notification to mentor
    self.send_mentor_request_email(
      mentor: assignment.mentor.user,
      assignment: assignment
    )
    
    # Send email notification to entrepreneur
    self.send_mentor_request_confirmation_email(
      entrepreneur: assignment.entrepreneur,
      assignment: assignment
    )
  end
  
  def self.send_mentor_assignment_notification(assignment:, event_type:)
    case event_type
    when :assignment_approved
      self.send_mentor_request_approved_email(
        entrepreneur: assignment.entrepreneur,
        assignment: assignment
      )
    when :assignment_completed
      self.send_mentorship_completed_email(
        entrepreneur: assignment.entrepreneur,
        mentor: assignment.mentor.user,
        assignment: assignment
      )
    when :assignment_cancelled
      self.send_mentorship_cancelled_email(
        entrepreneur: assignment.entrepreneur,
        mentor: assignment.mentor.user,
        assignment: assignment
      )
    end
  end
  
  # Private email sending methods
  private
  
  def self.send_mentor_application_email(admin:, application:)
    applicant_name = application.user.full_name
    applicant_email = application.user.email
    professional_title = application.professional_title
    years_of_experience = application.years_of_experience
    submission_date = application.submitted_at&.strftime('%B %d, %Y') || Time.current.strftime('%B %d, %Y')
    application_id = application.id
    redirect_url = ENV['FRONTEND_URL'] ? "#{ENV['FRONTEND_URL']}/admin/mentor/applications/#{application.id}" : "https://bantuhive.com/admin/mentor/applications/#{application.id}"
    
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => admin.email,
          'name' => admin.full_name
        }
      ],
      template_id: 2, # Use your email template ID
      params: {
        'admin_name' => admin.full_name,
        'applicant_name' => applicant_name,
        'applicant_email' => applicant_email,
        'professional_title' => professional_title,
        'years_of_experience' => years_of_experience,
        'submission_date' => submission_date,
        'application_id' => application_id,
        'redirect_url' => redirect_url
      },
      sender: {
        'name' => 'Bantuhive Mentorship',
        'email' => 'help@bantuhive.com'
      },
      subject: "New Mentor Application: #{applicant_name}",
      headers: {
        'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        'charset' => 'iso-8859-1',
        'Content-Type' => 'text/html; charset=iso-8859-1',
        'Accept' => 'application/json'
      },
      htmlContent: <<~HTML
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0faf0;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #4CAF50;
                padding: 20px;
                text-align: center;
                color: white;
              }
              .content {
                padding: 20px;
                color: #333333;
              }
              .content h1 {
                color: #4CAF50;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .details {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                border-left: 4px solid #4CAF50;
              }
              .footer {
                background-color: #f0faf0;
                padding: 15px;
                text-align: center;
                font-size: 14px;
                color: #666666;
              }
              .button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>New Mentor Application Submitted</h1>
              </div>
              
              <div class="content">
                <p>Hi #{admin.full_name},</p>
                <p>A new mentor application has been submitted and requires your review.</p>
                
                <div class="details">
                  <p><strong>Applicant:</strong> #{applicant_name}</p>
                  <p><strong>Email:</strong> #{applicant_email}</p>
                  <p><strong>Professional Title:</strong> #{professional_title}</p>
                  <p><strong>Years of Experience:</strong> #{years_of_experience}</p>
                  <p><strong>Submitted:</strong> #{submission_date}</p>
                </div>
                
                <p>Please review this application at your earliest convenience:</p>
                <a href="#{redirect_url}" class="button">Review Application</a>
                
                <p>Best regards,<br>The Bantuhive Mentorship Team</p>
              </div>
              
              <div class="footer">
                <p>© BantuHive Ltd #{Time.current.year}</p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )
    
    self.send_email(send_smtp_email)
  end
  
  def self.send_mentor_request_email(mentor:, assignment:)
    entrepreneur_name = assignment.entrepreneur.full_name
    campaign_title = assignment.campaign.title
    request_date = assignment.created_at.strftime('%B %d, %Y')
    campaign_id = assignment.campaign.id
    entrepreneur_notes = assignment.entrepreneur_notes || "No additional notes provided."
    redirect_url = ENV['FRONTEND_URL'] ? "#{ENV['FRONTEND_URL']}/mentor/assignments/#{assignment.id}" : "https://bantuhive.com/mentor/assignments/#{assignment.id}"
    
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => mentor.email,
          'name' => mentor.full_name
        }
      ],
      template_id: 2,
      params: {
        'mentor_name' => mentor.full_name,
        'entrepreneur_name' => entrepreneur_name,
        'campaign_title' => campaign_title,
        'request_date' => request_date,
        'campaign_id' => campaign_id,
        'entrepreneur_notes' => entrepreneur_notes,
        'redirect_url' => redirect_url
      },
      sender: {
        'name' => 'Bantuhive Mentorship',
        'email' => 'help@bantuhive.com'
      },
      subject: "New Mentor Request: #{entrepreneur_name} needs your guidance",
      headers: {
        'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        'charset' => 'iso-8859-1',
        'Content-Type' => 'text/html; charset=iso-8859-1',
        'Accept' => 'application/json'
      },
      htmlContent: <<~HTML
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f0faf0; margin: 0; padding: 0; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
              .header { background-color: #4CAF50; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; color: #333333; }
              .content h1 { color: #4CAF50; font-size: 24px; margin-bottom: 20px; }
              .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
              .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50; }
              .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
              .footer { background-color: #f0faf0; padding: 15px; text-align: center; font-size: 14px; color: #666666; }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>New Mentor Request!</h1>
              </div>
              
              <div class="content">
                <p>Hi #{mentor.full_name},</p>
                <p>You have received a new mentor request from <strong>#{entrepreneur_name}</strong> for their campaign: <strong>#{campaign_title}</strong>.</p>
                
                <div class="details">
                  <p><strong>Request Details:</strong></p>
                  <p><strong>Entrepreneur:</strong> #{entrepreneur_name}</p>
                  <p><strong>Campaign:</strong> #{campaign_title}</p>
                  <p><strong>Request Date:</strong> #{request_date}</p>
                  <p><strong>Entrepreneur's Notes:</strong> #{entrepreneur_notes}</p>
                </div>
                
                <p>Please review this request and decide if you can take on this mentorship:</p>
                <a href="#{redirect_url}" class="button">Review Request</a>
                
                <p>Your expertise is valuable to our community. Thank you for considering this request!</p>
                <p>Best regards,<br>The Bantuhive Mentorship Team</p>
              </div>
              
              <div class="footer">
                <p>© BantuHive Ltd #{Time.current.year}</p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )
    
    self.send_email(send_smtp_email)
  end
  
  def self.send_mentor_request_confirmation_email(entrepreneur:, assignment:)
    mentor_name = assignment.mentor.user.full_name
    campaign_title = assignment.campaign.title
    request_date = assignment.created_at.strftime('%B %d, %Y')
    campaign_id = assignment.campaign.id
    redirect_url = ENV['FRONTEND_URL'] ? "#{ENV['FRONTEND_URL']}/campaigns/#{campaign_id}/mentors" : "https://bantuhive.com/campaigns/#{campaign_id}/mentors"
    
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => entrepreneur.email,
          'name' => entrepreneur.full_name
        }
      ],
      template_id: 2,
      params: {
        'entrepreneur_name' => entrepreneur.full_name,
        'mentor_name' => mentor_name,
        'campaign_title' => campaign_title,
        'request_date' => request_date,
        'campaign_id' => campaign_id,
        'redirect_url' => redirect_url
      },
      sender: {
        'name' => 'Bantuhive Mentorship',
        'email' => 'help@bantuhive.com'
      },
      subject: "Mentor Request Confirmation: #{mentor_name} has been notified",
      headers: {
        'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        'charset' => 'iso-8859-1',
        'Content-Type' => 'text/html; charset=iso-8859-1',
        'Accept' => 'application/json'
      },
      htmlContent: <<~HTML
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f0faf0; margin: 0; padding: 0; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
              .header { background-color: #4CAF50; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; color: #333333; }
              .content h1 { color: #4CAF50; font-size: 24px; margin-bottom: 20px; }
              .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
              .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50; }
              .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
              .footer { background-color: #f0faf0; padding: 15px; text-align: center; font-size: 14px; color: #666666; }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Mentor Request Sent!</h1>
              </div>
              
              <div class="content">
                <p>Hi #{entrepreneur.full_name},</p>
                <p>Your mentor request to <strong>#{mentor_name}</strong> has been successfully sent.</p>
                
                <div class="details">
                  <p><strong>Request Details:</strong></p>
                  <p><strong>Mentor:</strong> #{mentor_name}</p>
                  <p><strong>Campaign:</strong> #{campaign_title}</p>
                  <p><strong>Request Date:</strong> #{request_date}</p>
                </div>
                
                <p>The mentor has been notified and will review your request. You'll receive another email when they respond.</p>
                <a href="#{redirect_url}" class="button">View Campaign Mentors</a>
                
                <p>Best of luck with your venture!<br>The Bantuhive Mentorship Team</p>
              </div>
              
              <div class="footer">
                <p>© BantuHive Ltd #{Time.current.year}</p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )
    
    self.send_email(send_smtp_email)
  end
  
  def self.send_mentor_request_approved_email(entrepreneur:, assignment:)
    mentor_name = assignment.mentor.user.full_name
    campaign_title = assignment.campaign.title
    approval_date = assignment.started_at.strftime('%B %d, %Y')
    campaign_id = assignment.campaign.id
    redirect_url = ENV['FRONTEND_URL'] ? "#{ENV['FRONTEND_URL']}/campaigns/#{campaign_id}/mentors" : "https://bantuhive.com/campaigns/#{campaign_id}/mentors"
    
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => entrepreneur.email,
          'name' => entrepreneur.full_name
        }
      ],
      template_id: 2,
      params: {
        'entrepreneur_name' => entrepreneur.full_name,
        'mentor_name' => mentor_name,
        'campaign_title' => campaign_title,
        'approval_date' => approval_date,
        'redirect_url' => redirect_url
      },
      sender: {
        'name' => 'Bantuhive Mentorship',
        'email' => 'help@bantuhive.com'
      },
      subject: "Great News! #{mentor_name} has accepted your mentor request",
      headers: {
        'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        'charset' => 'iso-8859-1',
        'Content-Type' => 'text/html; charset=iso-8859-1',
        'Accept' => 'application/json'
      },
      htmlContent: <<~HTML
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f0faf0; margin: 0; padding: 0; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
              .header { background-color: #4CAF50; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; color: #333333; }
              .content h1 { color: #4CAF50; font-size: 24px; margin-bottom: 20px; }
              .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
              .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50; }
              .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
              .footer { background-color: #f0faf0; padding: 15px; text-align: center; font-size: 14px; color: #666666; }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Mentor Request Approved! 🎉</h1>
              </div>
              
              <div class="content">
                <p>Hi #{entrepreneur.full_name},</p>
                <p>Great news! <strong>#{mentor_name}</strong> has accepted your mentor request for <strong>#{campaign_title}</strong>.</p>
                
                <div class="details">
                  <p><strong>Mentorship Details:</strong></p>
                  <p><strong>Mentor:</strong> #{mentor_name}</p>
                  <p><strong>Campaign:</strong> #{campaign_title}</p>
                  <p><strong>Start Date:</strong> #{approval_date}</p>
                </div>
                
                <p>You can now begin your mentorship journey. Your mentor will reach out to you shortly to schedule your first session.</p>
                <a href="#{redirect_url}" class="button">View Mentorship Details</a>
                
                <p>Best regards,<br>The Bantuhive Mentorship Team</p>
              </div>
              
              <div class="footer">
                <p>© BantuHive Ltd #{Time.current.year}</p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )
    
    self.send_email(send_smtp_email)
  end
  
  def self.send_mentorship_completed_email(entrepreneur:, mentor:, assignment:)
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => entrepreneur.email,
          'name' => entrepreneur.full_name
        }
      ],
      template_id: 2,
      params: {
        'recipient_name' => entrepreneur.full_name,
        'counterpart_name' => mentor.full_name,
        'campaign_title' => assignment.campaign.title,
        'completion_date' => assignment.completed_at.strftime('%B %d, %Y'),
        'rating' => assignment.rating || 'Not rated'
      },
      sender: {
        'name' => 'Bantuhive Mentorship',
        'email' => 'help@bantuhive.com'
      },
      subject: "Mentorship Completed: Thank you for your participation",
      headers: {
        'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        'charset' => 'iso-8859-1',
        'Content-Type' => 'text/html; charset=iso-8859-1',
        'Accept' => 'application/json'
      },
      htmlContent: <<~HTML
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f0faf0; margin: 0; padding: 0; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
              .header { background-color: #4CAF50; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; color: #333333; }
              .content h1 { color: #4CAF50; font-size: 24px; margin-bottom: 20px; }
              .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
              .footer { background-color: #f0faf0; padding: 15px; text-align: center; font-size: 14px; color: #666666; }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Mentorship Completed</h1>
              </div>
              
              <div class="content">
                <p>Hi #{entrepreneur.full_name},</p>
                <p>Your mentorship with <strong>#{mentor.full_name}</strong> for <strong>#{assignment.campaign.title}</strong> has been successfully completed.</p>
                <p><strong>Completion Date:</strong> #{assignment.completed_at.strftime('%B %d, %Y')}</p>
                <p><strong>Rating:</strong> #{assignment.rating || 'Not rated'}/5</p>
                <p>Thank you for participating in our mentorship program. We hope this experience was valuable for your venture.</p>
                <p>Best regards,<br>The Bantuhive Mentorship Team</p>
              </div>
              
              <div class="footer">
                <p>© BantuHive Ltd #{Time.current.year}</p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )
    
    self.send_email(send_smtp_email)
  end
  
  def self.send_mentorship_cancelled_email(entrepreneur:, mentor:, assignment:)
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => entrepreneur.email,
          'name' => entrepreneur.full_name
        }
      ],
      template_id: 2,
      params: {
        'recipient_name' => entrepreneur.full_name,
        'counterpart_name' => mentor.full_name,
        'campaign_title' => assignment.campaign.title,
        'cancellation_date' => assignment.cancelled_at.strftime('%B %d, %Y'),
        'reason' => assignment.cancellation_reason || 'No reason provided'
      },
      sender: {
        'name' => 'Bantuhive Mentorship',
        'email' => 'help@bantuhive.com'
      },
      subject: "Mentorship Cancelled",
      headers: {
        'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        'charset' => 'iso-8859-1',
        'Content-Type' => 'text/html; charset=iso-8859-1',
        'Accept' => 'application/json'
      },
      htmlContent: <<~HTML
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f0faf0; margin: 0; padding: 0; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
              .header { background-color: #ff9800; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; color: #333333; }
              .content h1 { color: #ff9800; font-size: 24px; margin-bottom: 20px; }
              .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
              .footer { background-color: #f0faf0; padding: 15px; text-align: center; font-size: 14px; color: #666666; }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Mentorship Cancelled</h1>
              </div>
              
              <div class="content">
                <p>Hi #{entrepreneur.full_name},</p>
                <p>Your mentorship with <strong>#{mentor.full_name}</strong> for <strong>#{assignment.campaign.title}</strong> has been cancelled.</p>
                <p><strong>Cancellation Date:</strong> #{assignment.cancelled_at.strftime('%B %d, %Y')}</p>
                <p><strong>Reason:</strong> #{assignment.cancellation_reason || 'No reason provided'}</p>
                <p>You can request another mentor for your campaign if needed.</p>
                <p>Best regards,<br>The Bantuhive Mentorship Team</p>
              </div>
              
              <div class="footer">
                <p>© BantuHive Ltd #{Time.current.year}</p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )
    
    self.send_email(send_smtp_email)
  end
  
  def self.send_email(send_smtp_email)
    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new

    begin
      result = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Mentorship notification email sent successfully: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending mentorship notification email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end
end