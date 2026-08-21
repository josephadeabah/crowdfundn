# app/services/mentor_notification_service.rb
class MentorNotificationService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Mentorship')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def admin_roles
      ENV.fetch('MENTOR_ADMIN_ROLES', 'Admin,SuperAdmin').split(',')
    end

    # Public Methods
    def new_mentor_application_submitted(application:)
      return false unless validate_application(application)

      admin_users = User.joins(:roles).where(roles: { name: admin_roles })
      
      results = []
      admin_users.each do |admin|
        result = send_mentor_application_email(admin: admin, application: application)
        results << result
      end

      results.all?
    end

    def new_mentor_request(assignment:)
      return false unless validate_assignment(assignment)

      mentor_result = send_mentor_request_email(
        mentor: assignment.mentor.user,
        assignment: assignment
      )

      entrepreneur_result = send_mentor_request_confirmation_email(
        entrepreneur: assignment.entrepreneur,
        assignment: assignment
      )

      mentor_result && entrepreneur_result
    end

    def send_mentor_assignment_notification(assignment:, event_type:)
      return false unless validate_assignment(assignment)

      case event_type
      when :assignment_approved
        send_mentor_request_approved_email(
          entrepreneur: assignment.entrepreneur,
          assignment: assignment
        )
      when :assignment_completed
        send_mentorship_completed_email(
          entrepreneur: assignment.entrepreneur,
          mentor: assignment.mentor.user,
          assignment: assignment
        )
      when :assignment_cancelled
        send_mentorship_cancelled_email(
          entrepreneur: assignment.entrepreneur,
          mentor: assignment.mentor.user,
          assignment: assignment
        )
      else
        Rails.logger.warn "Unknown mentor assignment event type: #{event_type}"
        false
      end
    end

    private

    # Validation Methods
    def validate_application(application)
      return false unless application
      return false unless application.respond_to?(:user)
      return false unless application.user
      true
    end

    def validate_assignment(assignment)
      return false unless assignment
      return false unless assignment.respond_to?(:mentor)
      return false unless assignment.mentor
      return false unless assignment.respond_to?(:entrepreneur)
      return false unless assignment.entrepreneur
      return false unless assignment.respond_to?(:campaign)
      return false unless assignment.campaign
      true
    end

    # Helper Methods
    def format_date(date)
      return 'N/A' unless date
      date.strftime('%B %d, %Y')
    rescue => e
      date.to_s
    end

    # Email Builders
    def send_mentor_application_email(admin:, application:)
      return false unless admin && application

      applicant_name = application.user.full_name
      applicant_email = application.user.email
      professional_title = application.professional_title || 'Not specified'
      years_of_experience = application.years_of_experience || 0
      submission_date = format_date(application.submitted_at)
      application_id = application.id

      redirect_url = "#{frontend_url}/admin/mentor/applications/#{application.id}"
      dashboard_url = "#{frontend_url}/admin/mentor/applications"

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: admin.email,
          name: admin.full_name
        }],
        subject: "New Mentor Application: #{applicant_name}",
        htmlContent: build_mentor_application_html(
          admin_name: admin.full_name,
          applicant_name: applicant_name,
          applicant_email: applicant_email,
          professional_title: professional_title,
          years_of_experience: years_of_experience,
          submission_date: submission_date,
          application_id: application_id,
          redirect_url: redirect_url,
          dashboard_url: dashboard_url
        ),
        textContent: build_mentor_application_text(
          admin_name: admin.full_name,
          applicant_name: applicant_name,
          applicant_email: applicant_email,
          professional_title: professional_title,
          years_of_experience: years_of_experience,
          submission_date: submission_date,
          redirect_url: redirect_url,
          dashboard_url: dashboard_url
        ),
        sender: {
          name: sender_name,
          email: sender_email
        },
        headers: {
          'X-Mailin-custom' => 'mentor_application',
          'X-Entity-Ref-ID' => "mentor_application_#{application.id}",
          'X-Entity-Ref-Type' => 'mentor_application'
        }
      )

      send_email(send_smtp_email, "mentor_application", admin.email)
    end

    def send_mentor_request_email(mentor:, assignment:)
      return false unless mentor && assignment

      entrepreneur_name = assignment.entrepreneur.full_name
      campaign_title = assignment.campaign.title
      request_date = format_date(assignment.created_at)
      entrepreneur_notes = assignment.entrepreneur_notes || "No additional notes provided."

      redirect_url = "#{frontend_url}/mentor/assignments/#{assignment.id}"
      dashboard_url = "#{frontend_url}/mentor/dashboard"

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: mentor.email,
          name: mentor.full_name
        }],
        subject: "New Mentor Request: #{entrepreneur_name} needs your guidance",
        htmlContent: build_mentor_request_html(
          mentor_name: mentor.full_name,
          entrepreneur_name: entrepreneur_name,
          campaign_title: campaign_title,
          request_date: request_date,
          entrepreneur_notes: entrepreneur_notes,
          redirect_url: redirect_url,
          dashboard_url: dashboard_url
        ),
        textContent: build_mentor_request_text(
          mentor_name: mentor.full_name,
          entrepreneur_name: entrepreneur_name,
          campaign_title: campaign_title,
          request_date: request_date,
          entrepreneur_notes: entrepreneur_notes,
          redirect_url: redirect_url,
          dashboard_url: dashboard_url
        ),
        sender: {
          name: sender_name,
          email: sender_email
        },
        headers: {
          'X-Mailin-custom' => 'mentor_request',
          'X-Entity-Ref-ID' => "mentor_request_#{assignment.id}",
          'X-Entity-Ref-Type' => 'mentor_request'
        }
      )

      send_email(send_smtp_email, "mentor_request", mentor.email)
    end

    def send_mentor_request_confirmation_email(entrepreneur:, assignment:)
      return false unless entrepreneur && assignment

      mentor_name = assignment.mentor.user.full_name
      campaign_title = assignment.campaign.title
      request_date = format_date(assignment.created_at)

      redirect_url = "#{frontend_url}/campaigns/#{assignment.campaign.id}/mentors"

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: entrepreneur.email,
          name: entrepreneur.full_name
        }],
        subject: "Mentor Request Confirmation: #{mentor_name} has been notified",
        htmlContent: build_mentor_request_confirmation_html(
          entrepreneur_name: entrepreneur.full_name,
          mentor_name: mentor_name,
          campaign_title: campaign_title,
          request_date: request_date,
          redirect_url: redirect_url
        ),
        textContent: build_mentor_request_confirmation_text(
          entrepreneur_name: entrepreneur.full_name,
          mentor_name: mentor_name,
          campaign_title: campaign_title,
          request_date: request_date,
          redirect_url: redirect_url
        ),
        sender: {
          name: sender_name,
          email: sender_email
        },
        headers: {
          'X-Mailin-custom' => 'mentor_request_confirmation',
          'X-Entity-Ref-ID' => "mentor_request_confirmation_#{assignment.id}",
          'X-Entity-Ref-Type' => 'mentor_request_confirmation'
        }
      )

      send_email(send_smtp_email, "mentor_request_confirmation", entrepreneur.email)
    end

    def send_mentor_request_approved_email(entrepreneur:, assignment:)
      return false unless entrepreneur && assignment

      mentor_name = assignment.mentor.user.full_name
      campaign_title = assignment.campaign.title
      approval_date = format_date(assignment.started_at)

      redirect_url = "#{frontend_url}/campaigns/#{assignment.campaign.id}/mentors"

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: entrepreneur.email,
          name: entrepreneur.full_name
        }],
        subject: "Great News! #{mentor_name} has accepted your mentor request",
        htmlContent: build_mentor_request_approved_html(
          entrepreneur_name: entrepreneur.full_name,
          mentor_name: mentor_name,
          campaign_title: campaign_title,
          approval_date: approval_date,
          redirect_url: redirect_url
        ),
        textContent: build_mentor_request_approved_text(
          entrepreneur_name: entrepreneur.full_name,
          mentor_name: mentor_name,
          campaign_title: campaign_title,
          approval_date: approval_date,
          redirect_url: redirect_url
        ),
        sender: {
          name: sender_name,
          email: sender_email
        },
        headers: {
          'X-Mailin-custom' => 'mentor_request_approved',
          'X-Entity-Ref-ID' => "mentor_request_approved_#{assignment.id}",
          'X-Entity-Ref-Type' => 'mentor_request_approved'
        }
      )

      send_email(send_smtp_email, "mentor_request_approved", entrepreneur.email)
    end

    def send_mentorship_completed_email(entrepreneur:, mentor:, assignment:)
      return false unless entrepreneur && mentor && assignment

      campaign_title = assignment.campaign.title
      completion_date = format_date(assignment.completed_at)
      rating = assignment.rating || 'Not rated'
      feedback = assignment.feedback || 'No feedback provided'

      redirect_url = "#{frontend_url}/mentor/assignments/#{assignment.id}"

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: entrepreneur.email,
          name: entrepreneur.full_name
        }],
        subject: "Mentorship Completed: #{campaign_title}",
        htmlContent: build_mentorship_completed_html(
          entrepreneur_name: entrepreneur.full_name,
          mentor_name: mentor.full_name,
          campaign_title: campaign_title,
          completion_date: completion_date,
          rating: rating,
          feedback: feedback,
          redirect_url: redirect_url
        ),
        textContent: build_mentorship_completed_text(
          entrepreneur_name: entrepreneur.full_name,
          mentor_name: mentor.full_name,
          campaign_title: campaign_title,
          completion_date: completion_date,
          rating: rating,
          feedback: feedback,
          redirect_url: redirect_url
        ),
        sender: {
          name: sender_name,
          email: sender_email
        },
        headers: {
          'X-Mailin-custom' => 'mentorship_completed',
          'X-Entity-Ref-ID' => "mentorship_completed_#{assignment.id}",
          'X-Entity-Ref-Type' => 'mentorship_completed'
        }
      )

      send_email(send_smtp_email, "mentorship_completed", entrepreneur.email)
    end

    def send_mentorship_cancelled_email(entrepreneur:, mentor:, assignment:)
      return false unless entrepreneur && mentor && assignment

      campaign_title = assignment.campaign.title
      cancellation_date = format_date(assignment.cancelled_at)
      reason = assignment.cancellation_reason || 'No reason provided'

      redirect_url = "#{frontend_url}/campaigns/#{assignment.campaign.id}/mentors"

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: entrepreneur.email,
          name: entrepreneur.full_name
        }],
        subject: "Mentorship Cancelled: #{campaign_title}",
        htmlContent: build_mentorship_cancelled_html(
          entrepreneur_name: entrepreneur.full_name,
          mentor_name: mentor.full_name,
          campaign_title: campaign_title,
          cancellation_date: cancellation_date,
          reason: reason,
          redirect_url: redirect_url
        ),
        textContent: build_mentorship_cancelled_text(
          entrepreneur_name: entrepreneur.full_name,
          mentor_name: mentor.full_name,
          campaign_title: campaign_title,
          cancellation_date: cancellation_date,
          reason: reason,
          redirect_url: redirect_url
        ),
        sender: {
          name: sender_name,
          email: sender_email
        },
        headers: {
          'X-Mailin-custom' => 'mentorship_cancelled',
          'X-Entity-Ref-ID' => "mentorship_cancelled_#{assignment.id}",
          'X-Entity-Ref-Type' => 'mentorship_cancelled'
        }
      )

      send_email(send_smtp_email, "mentorship_cancelled", entrepreneur.email)
    end

    # HTML Builders
    def build_mentor_application_html(admin_name:, applicant_name:, applicant_email:, professional_title:, years_of_experience:, submission_date:, application_id:, redirect_url:, dashboard_url:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>New Mentor Application</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #2c3e50;">
                <h1>📋 New Mentor Application</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{admin_name},</p>

                <p>A new mentor application has been submitted and requires your review.</p>

                <div class="mentor-details" style="border-left-color: #3498db;">
                  <div class="detail-row">
                    <span class="detail-label">👤 Applicant:</span>
                    <span class="detail-value">#{applicant_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📧 Email:</span>
                    <span class="detail-value"><a href="mailto:#{applicant_email}">#{applicant_email}</a></span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💼 Professional Title:</span>
                    <span class="detail-value">#{professional_title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Years of Experience:</span>
                    <span class="detail-value">#{years_of_experience}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Submitted:</span>
                    <span class="detail-value">#{submission_date}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{redirect_url}" class="cta-button" style="background-color: #3498db;">Review Application</a>
                  <a href="#{dashboard_url}" class="cta-button" style="background-color: #2c3e50;">View All Applications</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about this application?</strong> Contact our team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_mentor_request_html(mentor_name:, entrepreneur_name:, campaign_title:, request_date:, entrepreneur_notes:, redirect_url:, dashboard_url:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>New Mentor Request</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>🤝 New Mentor Request</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{mentor_name},</p>

                <p>You have received a new mentor request from <strong>#{entrepreneur_name}</strong> for their campaign: <strong>#{campaign_title}</strong>.</p>

                <div class="mentor-details" style="border-left-color: #27ae60;">
                  <div class="detail-row">
                    <span class="detail-label">👤 Entrepreneur:</span>
                    <span class="detail-value">#{entrepreneur_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Request Date:</span>
                    <span class="detail-value">#{request_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📝 Notes:</span>
                    <span class="detail-value">#{entrepreneur_notes}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{redirect_url}" class="cta-button" style="background-color: #27ae60;">Review Request</a>
                  <a href="#{dashboard_url}" class="cta-button" style="background-color: #2c3e50;">My Dashboard</a>
                </div>

                <div class="support-section">
                  <p><strong>Your expertise is valuable to our community!</strong> Thank you for considering this request.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_mentor_request_confirmation_html(entrepreneur_name:, mentor_name:, campaign_title:, request_date:, redirect_url:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Mentor Request Confirmation</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #2980b9;">
                <h1>📤 Mentor Request Sent</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{entrepreneur_name},</p>

                <p>Your mentor request to <strong>#{mentor_name}</strong> has been successfully sent.</p>

                <div class="mentor-details" style="border-left-color: #2980b9;">
                  <div class="detail-row">
                    <span class="detail-label">👤 Mentor:</span>
                    <span class="detail-value">#{mentor_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Request Date:</span>
                    <span class="detail-value">#{request_date}</span>
                  </div>
                </div>

                <div class="reminder">
                  <p>The mentor has been notified and will review your request. You'll receive another email when they respond.</p>
                </div>

                <div class="action-section">
                  <a href="#{redirect_url}" class="cta-button" style="background-color: #3498db;">View Campaign Mentors</a>
                </div>

                <div class="support-section">
                  <p><strong>Best of luck with your venture!</strong></p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_mentor_request_approved_html(entrepreneur_name:, mentor_name:, campaign_title:, approval_date:, redirect_url:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Mentor Request Approved</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>🎉 Mentor Request Approved</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{entrepreneur_name},</p>

                <p><strong>Great news!</strong> #{mentor_name} has accepted your mentor request for <strong>#{campaign_title}</strong>.</p>

                <div class="mentor-details" style="border-left-color: #27ae60;">
                  <div class="detail-row">
                    <span class="detail-label">👤 Mentor:</span>
                    <span class="detail-value">#{mentor_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Start Date:</span>
                    <span class="detail-value">#{approval_date}</span>
                  </div>
                </div>

                <div class="next-steps">
                  <h3>📌 What's Next?</h3>
                  <ol>
                    <li>Your mentor will reach out to you shortly</li>
                    <li>Schedule your first mentorship session</li>
                    <li>Begin your mentorship journey</li>
                  </ol>
                </div>

                <div class="action-section">
                  <a href="#{redirect_url}" class="cta-button" style="background-color: #27ae60;">View Mentorship Details</a>
                </div>

                <div class="support-section">
                  <p><strong>Congratulations!</strong> We're excited to see your growth.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_mentorship_completed_html(entrepreneur_name:, mentor_name:, campaign_title:, completion_date:, rating:, feedback:, redirect_url:)
      stars = rating.is_a?(Numeric) ? '⭐' * rating.to_i : 'N/A'

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Mentorship Completed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #2980b9;">
                <h1>📊 Mentorship Completed</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{entrepreneur_name},</p>

                <p>Your mentorship with <strong>#{mentor_name}</strong> for <strong>#{campaign_title}</strong> has been successfully completed.</p>

                <div class="mentor-details" style="border-left-color: #2980b9;">
                  <div class="detail-row">
                    <span class="detail-label">👤 Mentor:</span>
                    <span class="detail-value">#{mentor_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Completion Date:</span>
                    <span class="detail-value">#{completion_date}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">⭐ Rating:</span>
                    <span class="detail-value" style="font-weight: bold; font-size: 18px;">#{stars}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📝 Feedback:</span>
                    <span class="detail-value">#{feedback}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{redirect_url}" class="cta-button" style="background-color: #3498db;">View Details</a>
                </div>

                <div class="support-section">
                  <p><strong>Thank you for participating in our mentorship program!</strong></p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_mentorship_cancelled_html(entrepreneur_name:, mentor_name:, campaign_title:, cancellation_date:, reason:, redirect_url:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Mentorship Cancelled</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e67e22;">
                <h1>📋 Mentorship Cancelled</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{entrepreneur_name},</p>

                <p>Your mentorship with <strong>#{mentor_name}</strong> for <strong>#{campaign_title}</strong> has been cancelled.</p>

                <div class="mentor-details" style="border-left-color: #e67e22;">
                  <div class="detail-row">
                    <span class="detail-label">👤 Mentor:</span>
                    <span class="detail-value">#{mentor_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Cancellation Date:</span>
                    <span class="detail-value">#{cancellation_date}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">📝 Reason:</span>
                    <span class="detail-value" style="color: #e67e22;">#{reason}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{redirect_url}" class="cta-button" style="background-color: #3498db;">Request Another Mentor</a>
                </div>

                <div class="support-section">
                  <p><strong>Need help finding another mentor?</strong> Our team is here to assist.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Builders
    def build_mentor_application_text(admin_name:, applicant_name:, applicant_email:, professional_title:, years_of_experience:, submission_date:, redirect_url:, dashboard_url:)
      <<~TEXT
        New Mentor Application

        Dear #{admin_name},

        A new mentor application has been submitted and requires your review.

        Applicant: #{applicant_name}
        Email: #{applicant_email}
        Professional Title: #{professional_title}
        Years of Experience: #{years_of_experience}
        Submitted: #{submission_date}

        Review Application: #{redirect_url}
        View All Applications: #{dashboard_url}

        Questions? Contact our team: #{support_email}

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_mentor_request_text(mentor_name:, entrepreneur_name:, campaign_title:, request_date:, entrepreneur_notes:, redirect_url:, dashboard_url:)
      <<~TEXT
        New Mentor Request

        Dear #{mentor_name},

        You have received a new mentor request from #{entrepreneur_name} for their campaign: #{campaign_title}.

        Entrepreneur: #{entrepreneur_name}
        Campaign: #{campaign_title}
        Request Date: #{request_date}
        Notes: #{entrepreneur_notes}

        Review Request: #{redirect_url}
        My Dashboard: #{dashboard_url}

        Your expertise is valuable to our community! Thank you for considering this request.

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_mentor_request_confirmation_text(entrepreneur_name:, mentor_name:, campaign_title:, request_date:, redirect_url:)
      <<~TEXT
        Mentor Request Sent

        Dear #{entrepreneur_name},

        Your mentor request to #{mentor_name} has been successfully sent.

        Mentor: #{mentor_name}
        Campaign: #{campaign_title}
        Request Date: #{request_date}

        The mentor has been notified and will review your request. You'll receive another email when they respond.

        View Campaign Mentors: #{redirect_url}

        Best of luck with your venture!

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_mentor_request_approved_text(entrepreneur_name:, mentor_name:, campaign_title:, approval_date:, redirect_url:)
      <<~TEXT
        Mentor Request Approved

        Dear #{entrepreneur_name},

        Great news! #{mentor_name} has accepted your mentor request for #{campaign_title}.

        Mentor: #{mentor_name}
        Campaign: #{campaign_title}
        Start Date: #{approval_date}

        What's Next?
        1. Your mentor will reach out to you shortly
        2. Schedule your first mentorship session
        3. Begin your mentorship journey

        View Mentorship Details: #{redirect_url}

        Congratulations! We're excited to see your growth.

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_mentorship_completed_text(entrepreneur_name:, mentor_name:, campaign_title:, completion_date:, rating:, feedback:, redirect_url:)
      stars = rating.is_a?(Numeric) ? '⭐' * rating.to_i : 'N/A'

      <<~TEXT
        Mentorship Completed

        Dear #{entrepreneur_name},

        Your mentorship with #{mentor_name} for #{campaign_title} has been successfully completed.

        Mentor: #{mentor_name}
        Campaign: #{campaign_title}
        Completion Date: #{completion_date}
        Rating: #{stars}
        Feedback: #{feedback}

        View Details: #{redirect_url}

        Thank you for participating in our mentorship program!

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_mentorship_cancelled_text(entrepreneur_name:, mentor_name:, campaign_title:, cancellation_date:, reason:, redirect_url:)
      <<~TEXT
        Mentorship Cancelled

        Dear #{entrepreneur_name},

        Your mentorship with #{mentor_name} for #{campaign_title} has been cancelled.

        Mentor: #{mentor_name}
        Campaign: #{campaign_title}
        Cancellation Date: #{cancellation_date}
        Reason: #{reason}

        Request Another Mentor: #{redirect_url}

        Need help finding another mentor? Our team is here to assist: #{support_email}

        Best regards,
        #{sender_name}
      TEXT
    end

    # Email Sending Method
    def send_email(send_smtp_email, email_type, recipient_email)
      begin
        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        result = api_instance.send_transac_email(send_smtp_email)

        log_email_sent(recipient_email, email_type)
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending #{email_type} to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send #{email_type} email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    def log_email_sent(recipient_email, email_type)
      log_data = {
        recipient_email: recipient_email,
        email_type: email_type,
        sent_at: Time.current.iso8601
      }

      Rails.logger.info "Mentor notification email sent: #{log_data.to_json}"
    end

    # Email Styles
    def email_styles
      <<~CSS
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #2c3e50;
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .mentor-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
          padding: 5px 0;
          border-bottom: 1px solid #e8e8e8;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-row.highlight {
          background-color: #fafafa;
          border-radius: 4px;
          padding: 8px 0;
        }
        .detail-label {
          font-weight: 600;
          width: 200px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .detail-value a {
          color: #2980b9;
          text-decoration: none;
        }
        .detail-value a:hover {
          text-decoration: underline;
        }
        .reminder {
          background-color: #fff3cd;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .next-steps {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .next-steps ol {
          padding-left: 20px;
          margin: 10px 0;
        }
        .next-steps li {
          margin-bottom: 5px;
        }
        .action-section {
          text-align: center;
          margin: 25px 0;
        }
        .cta-button {
          display: inline-block;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 5px;
        }
        .cta-button:hover {
          opacity: 0.9;
        }
        .support-section {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .support-section a {
          color: #2980b9;
          text-decoration: none;
        }
        .support-section a:hover {
          text-decoration: underline;
        }
        .footer {
          background-color: #f0f2f5;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #e1e4e8;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: #2c3e50;
          text-decoration: none;
          margin: 0 10px;
          font-weight: 500;
        }
        .social-links a:hover {
          text-decoration: underline;
        }
        .company-address {
          font-size: 13px;
          color: #777;
          margin-top: 15px;
        }
        @media only screen and (max-width: 480px) {
          .detail-row {
            flex-direction: column;
          }
          .detail-label {
            width: 100%;
            margin-bottom: 2px;
          }
          .content {
            padding: 20px;
          }
          .header h1 {
            font-size: 22px;
          }
          .cta-button {
            display: block;
            margin: 10px 0;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you are part of the Bantuhive mentorship program.</p>

          <div class="social-links">
            <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
            <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
            <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
          </div>

          <div class="company-address">
            27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
          </div>

          <p style="margin-top: 15px;">
            <a href="#{frontend_url}" style="color: #2c3e50; text-decoration: none;">© #{Time.current.year} Bantuhive Ltd. All rights reserved.</a>
          </p>
        </div>
      HTML
    end
  end
end