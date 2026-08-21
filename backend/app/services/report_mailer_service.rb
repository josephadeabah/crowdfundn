# app/services/report_mailer_service.rb
class ReportMailerService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Ltd')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def admin_roles
      ENV.fetch('REPORT_ADMIN_ROLES', 'Admin,SuperAdmin,Moderator').split(',')
    end

    # Public Methods
    def send_report_resolved_email(report)
      return false unless validate_report(report)
      return false unless report.resolved?
      return false unless report.reporter&.email.present?

      user = report.reporter.full_name
      email = report.reporter.email
      report_type = report.report_type.to_s.humanize
      report_target = report.report_target_name || 'Unknown'
      action_taken = report.action_taken || 'appropriate action'
      resolution_notes = report.resolution_notes || 'The issue has been addressed.'
      resolved_date = format_date(report.resolved_at)

      subject = "Your report has been resolved"

      html_content = build_resolved_html(
        user_name: user,
        report_type: report_type,
        report_target: report_target,
        action_taken: action_taken,
        resolution_notes: resolution_notes,
        resolved_date: resolved_date,
        report_id: report.id
      )

      text_content = build_resolved_text(
        user_name: user,
        report_type: report_type,
        report_target: report_target,
        action_taken: action_taken,
        resolution_notes: resolution_notes,
        resolved_date: resolved_date,
        report_id: report.id
      )

      send_email(
        recipient_email: email,
        recipient_name: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'report_resolved',
        report: report
      )
    end

    def send_new_report_notification_to_admins(report)
      return false unless validate_report(report)

      admin_users = User.joins(:roles).where(roles: { name: admin_roles })
      return false if admin_users.empty?

      results = []
      admin_users.each do |admin|
        next unless admin.email.present?

        result = send_admin_report_notification(admin, report)
        results << result
      end

      results.all?
    end

    def send_report_received_email(report)
      return false unless validate_report(report)
      return false unless report.reporter&.email.present?

      user = report.reporter.full_name
      email = report.reporter.email
      report_type = report.report_type.to_s.humanize
      report_id = report.id
      submission_date = format_date(report.created_at)

      subject = "Your report has been received"

      html_content = build_received_html(
        user_name: user,
        report_type: report_type,
        report_id: report_id,
        submission_date: submission_date,
        report_target: report.report_target_name || 'Unknown'
      )

      text_content = build_received_text(
        user_name: user,
        report_type: report_type,
        report_id: report_id,
        submission_date: submission_date,
        report_target: report.report_target_name || 'Unknown'
      )

      send_email(
        recipient_email: email,
        recipient_name: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'report_received',
        report: report
      )
    end

    def send_report_escalation_email(report, reason)
      return false unless validate_report(report)

      # Notify senior admins
      senior_admins = User.joins(:roles).where(roles: { name: ['SuperAdmin', 'Admin'] })
      return false if senior_admins.empty?

      results = []
      senior_admins.each do |admin|
        next unless admin.email.present?

        result = send_escalation_notification(admin, report, reason)
        results << result
      end

      results.all?
    end

    private

    # Validation Methods
    def validate_report(report)
      return false unless report
      return false unless report.respond_to?(:report_type)
      return false unless report.respond_to?(:reporter)
      true
    end

    # Helper Methods
    def format_date(date)
      return 'N/A' unless date
      date.strftime('%B %d, %Y')
    rescue => e
      date.to_s
    end

    def format_datetime(date)
      return 'N/A' unless date
      date.strftime('%B %d, %Y at %H:%M')
    rescue => e
      date.to_s
    end

    def get_priority_color(priority)
      case priority.to_s.downcase
      when 'high', 'urgent'
        '#e74c3c'  # Red
      when 'medium'
        '#f39c12'  # Orange
      else
        '#3498db'  # Blue
      end
    end

    def get_priority_icon(priority)
      case priority.to_s.downcase
      when 'high', 'urgent'
        '🔴'
      when 'medium'
        '🟠'
      else
        '🔵'
      end
    end

    # Email Builders - HTML
    def build_resolved_html(user_name:, report_type:, report_target:, action_taken:, resolution_notes:, resolved_date:, report_id:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Report Resolved</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>✅ Report Resolved</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user_name},</p>

                <p>Thank you for helping us keep our platform safe. Your report has been reviewed and resolved.</p>

                <div class="report-details" style="border-left-color: #27ae60;">
                  <h3>📋 Report Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Report ID:</span>
                    <span class="detail-value">##{report_id}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Type:</span>
                    <span class="detail-value">#{report_type}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🎯 Target:</span>
                    <span class="detail-value">#{report_target}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">✅ Action Taken:</span>
                    <span class="detail-value">#{action_taken}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Resolved Date:</span>
                    <span class="detail-value">#{resolved_date}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">📝 Resolution Notes:</span>
                    <span class="detail-value">#{resolution_notes}</span>
                  </div>
                </div>

                <p>We appreciate you taking the time to report this issue. Your vigilance helps us maintain a trustworthy environment for all users.</p>

                <div class="action-section">
                  <a href="#{frontend_url}/reports/#{report_id}" class="cta-button" style="background-color: #3498db;">View Report Details</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about this resolution?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for your cooperation,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_received_html(user_name:, report_type:, report_id:, submission_date:, report_target:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Report Received</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #3498db;">
                <h1>📋 Report Received</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user_name},</p>

                <p>Thank you for submitting a report. We take all reports seriously and will review it promptly.</p>

                <div class="report-details" style="border-left-color: #3498db;">
                  <h3>📋 Report Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Report ID:</span>
                    <span class="detail-value">##{report_id}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Type:</span>
                    <span class="detail-value">#{report_type}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🎯 Target:</span>
                    <span class="detail-value">#{report_target}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Submitted:</span>
                    <span class="detail-value">#{submission_date}</span>
                  </div>
                </div>

                <div class="whats-next">
                  <h3>📌 What Happens Next?</h3>
                  <ol>
                    <li>Our team will review your report</li>
                    <li>We may reach out for additional information</li>
                    <li>You'll receive an update when the report is resolved</li>
                  </ol>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/reports/#{report_id}" class="cta-button" style="background-color: #3498db;">Track Report</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your report?</strong> Contact us:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for helping keep our community safe,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def send_admin_report_notification(admin, report)
      priority_color = get_priority_color(report.priority)
      priority_icon = get_priority_icon(report.priority)
      priority_label = report.priority.to_s.humanize

      report_url = "#{frontend_url}/admin/reports/#{report.id}"
      admin_reports_url = "#{frontend_url}/admin/reports"

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: admin.email,
          name: admin.full_name
        }],
        subject: "#{priority_icon} New Report ##{report.id} - #{report.report_type.to_s.humanize}",
        htmlContent: build_admin_notification_html(
          admin_name: admin.full_name,
          report_id: report.id,
          report_type: report.report_type.to_s.humanize,
          reporter_name: report.reporter.full_name,
          report_target: report.report_target_name || 'Unknown',
          priority: priority_label,
          priority_color: priority_color,
          priority_icon: priority_icon,
          description: report.description.to_s.truncate(300),
          created_at: format_datetime(report.created_at),
          report_url: report_url,
          admin_reports_url: admin_reports_url,
          support_email: support_email
        ),
        textContent: build_admin_notification_text(
          admin_name: admin.full_name,
          report_id: report.id,
          report_type: report.report_type.to_s.humanize,
          reporter_name: report.reporter.full_name,
          report_target: report.report_target_name || 'Unknown',
          priority: priority_label,
          description: report.description.to_s.truncate(300),
          created_at: format_datetime(report.created_at),
          report_url: report_url,
          admin_reports_url: admin_reports_url,
          support_email: support_email
        ),
        sender: {
          name: sender_name,
          email: sender_email
        },
        headers: {
          'X-Mailin-custom' => 'admin_report_notification',
          'X-Entity-Ref-ID' => "admin_report_notification_#{report.id}",
          'X-Entity-Ref-Type' => 'admin_report_notification',
          'X-Priority' => report.priority.to_s.downcase == 'high' ? '1 (Highest)' : '3 (Normal)'
        }
      )

      send_email_raw(send_smtp_email, "admin_report_notification", admin.email)
    end

    def send_escalation_notification(admin, report, reason)
      report_url = "#{frontend_url}/admin/reports/#{report.id}"

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: admin.email,
          name: admin.full_name
        }],
        subject: "🚨 URGENT: Report ##{report.id} Escalated",
        htmlContent: build_escalation_html(
          admin_name: admin.full_name,
          report_id: report.id,
          report_type: report.report_type.to_s.humanize,
          reporter_name: report.reporter.full_name,
          report_target: report.report_target_name || 'Unknown',
          reason: reason,
          priority: report.priority.to_s.humanize,
          description: report.description.to_s.truncate(300),
          created_at: format_datetime(report.created_at),
          report_url: report_url
        ),
        textContent: build_escalation_text(
          admin_name: admin.full_name,
          report_id: report.id,
          report_type: report.report_type.to_s.humanize,
          reporter_name: report.reporter.full_name,
          report_target: report.report_target_name || 'Unknown',
          reason: reason,
          priority: report.priority.to_s.humanize,
          description: report.description.to_s.truncate(300),
          created_at: format_datetime(report.created_at),
          report_url: report_url
        ),
        sender: {
          name: sender_name,
          email: sender_email
        },
        headers: {
          'X-Mailin-custom' => 'report_escalation',
          'X-Entity-Ref-ID' => "report_escalation_#{report.id}",
          'X-Entity-Ref-Type' => 'report_escalation',
          'X-Priority' => '1 (Highest)'
        }
      )

      send_email_raw(send_smtp_email, "report_escalation", admin.email)
    end

    # Email Builders - HTML (Admin)
    def build_admin_notification_html(admin_name:, report_id:, report_type:, reporter_name:, report_target:, priority:, priority_color:, priority_icon:, description:, created_at:, report_url:, admin_reports_url:, support_email:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>New Report</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{priority_color};">
                <h1>#{priority_icon} New Report ##{report_id}</h1>
                <p>Priority: #{priority}</p>
              </div>

              <div class="content">
                <p class="greeting">Dear #{admin_name},</p>

                <p>A new report has been submitted and requires review.</p>

                <div class="report-details" style="border-left-color: #{priority_color};">
                  <h3>📋 Report Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Report ID:</span>
                    <span class="detail-value">##{report_id}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Type:</span>
                    <span class="detail-value">#{report_type}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">👤 Submitted By:</span>
                    <span class="detail-value">#{reporter_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🎯 Target:</span>
                    <span class="detail-value">#{report_target}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">#{priority_icon} Priority:</span>
                    <span class="detail-value" style="color: #{priority_color}; font-weight: 600;">#{priority}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Submitted:</span>
                    <span class="detail-value">#{created_at}</span>
                  </div>
                </div>

                <div class="description">
                  <h4>📝 Description</h4>
                  <p>#{description}</p>
                </div>

                <div class="action-section">
                  <a href="#{report_url}" class="cta-button" style="background-color: #{priority_color};">Review Report</a>
                  <a href="#{admin_reports_url}" class="cta-button" style="background-color: #2c3e50;">View All Reports</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about this report?</strong> Contact support:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for your attention to this matter,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_escalation_html(admin_name:, report_id:, report_type:, reporter_name:, report_target:, reason:, priority:, description:, created_at:, report_url:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Report Escalated</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>🚨 Report Escalated</h1>
                <p>Action Required Immediately</p>
              </div>

              <div class="content">
                <p class="greeting">Dear #{admin_name},</p>

                <p>A report has been escalated and requires your immediate attention.</p>

                <div class="report-details" style="border-left-color: #e74c3c;">
                  <h3>📋 Escalated Report</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Report ID:</span>
                    <span class="detail-value">##{report_id}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Type:</span>
                    <span class="detail-value">#{report_type}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">👤 Submitted By:</span>
                    <span class="detail-value">#{reporter_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🎯 Target:</span>
                    <span class="detail-value">#{report_target}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Priority:</span>
                    <span class="detail-value" style="color: #e74c3c; font-weight: 600;">#{priority}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">📝 Escalation Reason:</span>
                    <span class="detail-value" style="color: #c0392b;">#{reason}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Created:</span>
                    <span class="detail-value">#{created_at}</span>
                  </div>
                </div>

                <div class="description">
                  <h4>📝 Description</h4>
                  <p>#{description}</p>
                </div>

                <div class="action-required">
                  <h3>⚡ Action Required</h3>
                  <p>This report has been escalated due to its severity or sensitivity. Please review and take appropriate action immediately.</p>
                </div>

                <div class="action-section">
                  <a href="#{report_url}" class="cta-button" style="background-color: #e74c3c;">Review Escalated Report</a>
                </div>

                <p>Thank you for your urgent attention,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Email Builders - Text
    def build_resolved_text(user_name:, report_type:, report_target:, action_taken:, resolution_notes:, resolved_date:, report_id:)
      <<~TEXT
        Your Report Has Been Resolved

        Dear #{user_name},

        Thank you for helping us keep our platform safe. Your report has been reviewed and resolved.

        Report Details:
        - Report ID: ##{report_id}
        - Type: #{report_type}
        - Target: #{report_target}
        - Action Taken: #{action_taken}
        - Resolved Date: #{resolved_date}
        - Resolution Notes: #{resolution_notes}

        View Report Details: #{frontend_url}/reports/#{report_id}

        Questions? Contact our support team: #{support_email}

        Thank you for your cooperation,
        #{sender_name}
      TEXT
    end

    def build_received_text(user_name:, report_type:, report_id:, submission_date:, report_target:)
      <<~TEXT
        Your Report Has Been Received

        Dear #{user_name},

        Thank you for submitting a report. We take all reports seriously and will review it promptly.

        Report Details:
        - Report ID: ##{report_id}
        - Type: #{report_type}
        - Target: #{report_target}
        - Submitted: #{submission_date}

        What Happens Next?
        1. Our team will review your report
        2. We may reach out for additional information
        3. You'll receive an update when the report is resolved

        Track Report: #{frontend_url}/reports/#{report_id}

        Questions? Contact us: #{support_email}

        Thank you for helping keep our community safe,
        #{sender_name}
      TEXT
    end

    def build_admin_notification_text(admin_name:, report_id:, report_type:, reporter_name:, report_target:, priority:, description:, created_at:, report_url:, admin_reports_url:, support_email:)
      <<~TEXT
        New Report ##{report_id} - #{report_type}

        Dear #{admin_name},

        A new report has been submitted and requires review.

        Report Details:
        - Report ID: ##{report_id}
        - Type: #{report_type}
        - Submitted By: #{reporter_name}
        - Target: #{report_target}
        - Priority: #{priority}
        - Submitted: #{created_at}

        Description:
        #{description}

        Review Report: #{report_url}
        View All Reports: #{admin_reports_url}

        Questions? Contact support: #{support_email}

        Thank you for your attention to this matter,
        #{sender_name}
      TEXT
    end

    def build_escalation_text(admin_name:, report_id:, report_type:, reporter_name:, report_target:, reason:, priority:, description:, created_at:, report_url:)
      <<~TEXT
        URGENT: Report ##{report_id} Escalated

        Dear #{admin_name},

        A report has been escalated and requires your immediate attention.

        Escalated Report Details:
        - Report ID: ##{report_id}
        - Type: #{report_type}
        - Submitted By: #{reporter_name}
        - Target: #{report_target}
        - Priority: #{priority}
        - Escalation Reason: #{reason}
        - Created: #{created_at}

        Description:
        #{description}

        This report has been escalated due to its severity or sensitivity. Please review and take appropriate action immediately.

        Review Escalated Report: #{report_url}

        Thank you for your urgent attention,
        #{sender_name}
      TEXT
    end

    # Email Sending Methods
    def send_email(recipient_email:, recipient_name:, subject:, html_content:, text_content:, email_type:, report:)
      return false if recipient_email.blank?

      begin
        send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
          to: [{
            email: recipient_email,
            name: recipient_name
          }],
          subject: subject,
          htmlContent: html_content,
          textContent: text_content,
          sender: {
            name: sender_name,
            email: sender_email
          },
          headers: {
            'X-Mailin-custom' => email_type,
            'X-Entity-Ref-ID' => "#{email_type}_#{report&.id || Time.current.to_i}",
            'X-Entity-Ref-Type' => email_type
          }
        )

        send_email_raw(send_smtp_email, email_type, recipient_email)
      rescue => e
        Rails.logger.error "Failed to send #{email_type} email to #{recipient_email}: #{e.message}"
        false
      end
    end

    def send_email_raw(send_smtp_email, email_type, recipient_email)
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

    def log_email_sent(recipient_email, email_type)
      log_data = {
        recipient_email: recipient_email,
        email_type: email_type,
        sent_at: Time.current.iso8601
      }

      Rails.logger.info "Report email sent: #{log_data.to_json}"
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
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .report-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .report-details h3 {
          margin-top: 0;
        }
        .detail-row {
          display: flex;
          margin-bottom: 8px;
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
          width: 180px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .description {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
        }
        .whats-next {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .whats-next ol {
          padding-left: 20px;
          margin: 10px 0;
        }
        .whats-next li {
          margin-bottom: 5px;
        }
        .action-required {
          background-color: #fdedec;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #e74c3c;
          text-align: center;
        }
        .action-required h3 {
          margin-top: 0;
          color: #c0392b;
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
          <p>You are receiving this email because you are part of the Bantuhive reporting system.</p>

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