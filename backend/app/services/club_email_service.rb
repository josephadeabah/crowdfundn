# app/services/club_email_service.rb
class ClubEmailService
  def self.send_pending_member_notification(admin:, membership:)
    return unless admin && membership

    club = membership.investment_club
    subject = "New member request for #{club.name}"
    
    html_content = build_pending_member_html(admin, membership, club)
    text_content = build_pending_member_text(admin, membership, club)

    send_email(admin.email, admin.full_name, subject, html_content, text_content)
  end

  def self.send_membership_approved(user:, membership:)
    return unless user && membership

    club = membership.investment_club
    subject = "Your membership to #{club.name} has been approved!"
    
    html_content = build_membership_approved_html(user, membership, club)
    text_content = build_membership_approved_text(user, membership, club)

    send_email(user.email, user.full_name, subject, html_content, text_content)
  end

  def self.send_membership_rejected(user:, membership:)
    return unless user && membership

    club = membership.investment_club
    subject = "Update on your membership request for #{club.name}"
    
    html_content = build_membership_rejected_html(user, membership, club)
    text_content = build_membership_rejected_text(user, membership, club)

    send_email(user.email, user.full_name, subject, html_content, text_content)
  end

  def self.send_membership_role_changed(user:, membership:)
    return unless user && membership

    club = membership.investment_club
    subject = "Your role in #{club.name} has been updated"
    
    html_content = build_role_changed_html(user, membership, club)
    text_content = build_role_changed_text(user, membership, club)

    send_email(user.email, user.full_name, subject, html_content, text_content)
  end

  def self.send_membership_status_changed(user:, membership:)
    return unless user && membership

    club = membership.investment_club
    subject = "Your membership status in #{club.name} has been updated"
    
    html_content = build_status_changed_html(user, membership, club)
    text_content = build_status_changed_text(user, membership, club)

    send_email(user.email, user.full_name, subject, html_content, text_content)
  end

  def self.send_voting_reminder(user:, club_investment:)
    return unless user && club_investment

    club = club_investment.investment_club
    campaign = club_investment.campaign
    subject = "Vote pending: #{campaign.title} in #{club.name}"
    
    html_content = build_voting_reminder_html(user, club_investment, club, campaign)
    text_content = build_voting_reminder_text(user, club_investment, club, campaign)

    send_email(user.email, user.full_name, subject, html_content, text_content)
  end

  def self.send_investment_executed(club_investment:)
    return unless club_investment

    club = club_investment.investment_club
    campaign = club_investment.campaign
    
    # Send to all club members
    club.active_members.each do |member|
      subject = "Investment executed: #{campaign.title}"
      
      html_content = build_investment_executed_html(member, club_investment, club, campaign)
      text_content = build_investment_executed_text(member, club_investment, club, campaign)

      send_email(member.email, member.full_name, subject, html_content, text_content)
    end
  end

  def self.send_contribution_confirmation(user:, contribution:)
    return unless user && contribution

    club = contribution.investment_club
    subject = "Contribution confirmed for #{club.name}"
    
    html_content = build_contribution_confirmation_html(user, contribution, club)
    text_content = build_contribution_confirmation_text(user, contribution, club)

    send_email(user.email, user.full_name, subject, html_content, text_content)
  end

  def self.send_contribution_failed(user:, contribution:)
    return unless user && contribution

    club = contribution.investment_club
    subject = "Contribution failed for #{club.name}"
    
    html_content = build_contribution_failed_html(user, contribution, club)
    text_content = build_contribution_failed_text(user, contribution, club)

    send_email(user.email, user.full_name, subject, html_content, text_content)
  end

  def self.send_contribution_refunded(user:, contribution:)
    return unless user && contribution

    club = contribution.investment_club
    subject = "Contribution refunded for #{club.name}"
    
    html_content = build_contribution_refunded_html(user, contribution, club)
    text_content = build_contribution_refunded_text(user, contribution, club)

    send_email(user.email, user.full_name, subject, html_content, text_content)
  end

  def self.send_investment_execution_failed(admin:, club_investment:, error:)
    return unless admin && club_investment

    club = club_investment.investment_club
    campaign = club_investment.campaign
    subject = "Investment execution failed: #{campaign.title}"
    
    html_content = build_investment_execution_failed_html(admin, club_investment, club, campaign, error)
    text_content = build_investment_execution_failed_text(admin, club_investment, club, campaign, error)

    send_email(admin.email, admin.full_name, subject, html_content, text_content)
  end

  private

  # HTML Content Builders
  def self.build_pending_member_html(admin, membership, club)
    applicant_name = membership.user.full_name
    club_url = Rails.application.routes.url_helpers.club_url(club.slug, host: 'bantuhive.com')

    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>New Member Request</title>
          <style>
            #{email_styles}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>New Member Request</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{admin.full_name},</p>
              
              <p><strong>#{applicant_name}</strong> has requested to join your investment club <strong>#{club.name}</strong>.</p>
              
              <div class="action-section">
                <p>Please review this request in your club management dashboard:</p>
                <a href="#{club_url}" class="cta-button">Review Request</a>
              </div>

              <p>Warm regards,<br>
              <strong>The Bantuhive Team</strong></p>
            </div>

            #{email_footer}
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_membership_approved_html(user, membership, club)
    club_url = Rails.application.routes.url_helpers.club_url(club.slug, host: 'bantuhive.com')

    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Membership Approved</title>
          <style>
            #{email_styles}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Membership Approved!</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{user.full_name},</p>
              
              <p>Congratulations! Your membership request for <strong>#{club.name}</strong> has been approved.</p>
              
              <div class="action-section">
                <p>You can now access all club features and participate in investment decisions:</p>
                <a href="#{club_url}" class="cta-button">Visit Club</a>
              </div>

              <p>Welcome to the club!<br>
              <strong>The Bantuhive Team</strong></p>
            </div>

            #{email_footer}
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_membership_rejected_html(user, membership, club)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Membership Update</title>
          <style>
            #{email_styles}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Membership Update</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{user.full_name},</p>
              
              <p>Thank you for your interest in joining <strong>#{club.name}</strong>.</p>
              
              <p>After careful review, the club admins have decided not to approve your membership request at this time.</p>
              
              <p>We encourage you to explore other investment clubs on Bantuhive that might be a better fit for your investment goals.</p>

              <p>Best regards,<br>
              <strong>The Bantuhive Team</strong></p>
            </div>

            #{email_footer}
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_voting_reminder_html(user, club_investment, club, campaign)
    voting_url = Rails.application.routes.url_helpers.club_investment_url(club.slug, club_investment.id, host: 'bantuhive.com')

    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Voting Reminder</title>
          <style>
            #{email_styles}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Vote Pending</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{user.full_name},</p>
              
              <p>Your vote is needed for an investment proposal in <strong>#{club.name}</strong>.</p>
              
              <div class="investment-details">
                <div class="detail-row">
                  <span class="detail-label">Campaign:</span>
                  <span class="detail-value">#{campaign.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Company:</span>
                  <span class="detail-value">#{campaign.company_name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Investment Amount:</span>
                  <span class="detail-value">#{campaign.currency_symbol}#{club_investment.investment_amount}</span>
                </div>
              </div>

              <div class="action-section">
                <p>Cast your vote now:</p>
                <a href="#{voting_url}" class="cta-button">Vote Now</a>
              </div>

              <p>Your participation helps shape the club's investment decisions!<br>
              <strong>The Bantuhive Team</strong></p>
            </div>

            #{email_footer}
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_investment_executed_html(member, club_investment, club, campaign)
    club_url = Rails.application.routes.url_helpers.club_url(club.slug, host: 'bantuhive.com')

    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Investment Executed</title>
          <style>
            #{email_styles}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Investment Executed</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{member.full_name},</p>
              
              <p>Great news! Your club <strong>#{club.name}</strong> has successfully executed an investment.</p>
              
              <div class="investment-details">
                <div class="detail-row">
                  <span class="detail-label">Campaign:</span>
                  <span class="detail-value">#{campaign.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Company:</span>
                  <span class="detail-value">#{campaign.company_name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Investment Amount:</span>
                  <span class="detail-value">#{campaign.currency_symbol}#{club_investment.investment_amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Execution Date:</span>
                  <span class="detail-value">#{club_investment.executed_at.strftime('%B %d, %Y')}</span>
                </div>
              </div>

              <div class="action-section">
                <p>View the investment details:</p>
                <a href="#{club_url}" class="cta-button">View Club Portfolio</a>
              </div>

              <p>Congratulations on this collective achievement!<br>
              <strong>The Bantuhive Team</strong></p>
            </div>

            #{email_footer}
          </div>
        </body>
      </html>
    HTML
  end

  # Text Content Builders
  def self.build_pending_member_text(admin, membership, club)
    applicant_name = membership.user.full_name
    club_url = Rails.application.routes.url_helpers.club_url(club.slug, host: 'bantuhive.com')

    <<~TEXT
      Hello #{admin.full_name},

      #{applicant_name} has requested to join your investment club #{club.name}.

      Please review this request in your club management dashboard:
      #{club_url}

      Warm regards,
      The Bantuhive Team
    TEXT
  end

  def self.build_membership_approved_text(user, membership, club)
    club_url = Rails.application.routes.url_helpers.club_url(club.slug, host: 'bantuhive.com')

    <<~TEXT
      Hello #{user.full_name},

      Congratulations! Your membership request for #{club.name} has been approved.

      You can now access all club features and participate in investment decisions:
      #{club_url}

      Welcome to the club!
      The Bantuhive Team
    TEXT
  end

  def self.build_membership_rejected_text(user, membership, club)
    <<~TEXT
      Hello #{user.full_name},

      Thank you for your interest in joining #{club.name}.

      After careful review, the club admins have decided not to approve your membership request at this time.

      We encourage you to explore other investment clubs on Bantuhive that might be a better fit for your investment goals.

      Best regards,
      The Bantuhive Team
    TEXT
  end

  def self.build_voting_reminder_text(user, club_investment, club, campaign)
    voting_url = Rails.application.routes.url_helpers.club_investment_url(club.slug, club_investment.id, host: 'bantuhive.com')

    <<~TEXT
      Hello #{user.full_name},

      Your vote is needed for an investment proposal in #{club.name}.

      Campaign: #{campaign.title}
      Company: #{campaign.company_name}
      Investment Amount: #{campaign.currency_symbol}#{club_investment.investment_amount}

      Cast your vote now: #{voting_url}

      Your participation helps shape the club's investment decisions!
      The Bantuhive Team
    TEXT
  end

  def self.build_investment_executed_text(member, club_investment, club, campaign)
    club_url = Rails.application.routes.url_helpers.club_url(club.slug, host: 'bantuhive.com')

    <<~TEXT
      Hello #{member.full_name},

      Great news! Your club #{club.name} has successfully executed an investment.

      Campaign: #{campaign.title}
      Company: #{campaign.company_name}
      Investment Amount: #{campaign.currency_symbol}#{club_investment.investment_amount}
      Execution Date: #{club_investment.executed_at.strftime('%B %d, %Y')}

      View the investment details: #{club_url}

      Congratulations on this collective achievement!
      The Bantuhive Team
    TEXT
  end

  # Additional content builders for other email types
  def self.build_role_changed_html(user, membership, club)
    # Implementation for role changed email
    # Similar structure to above methods
  end

  def self.build_status_changed_html(user, membership, club)
    # Implementation for status changed email
    # Similar structure to above methods
  end

  def self.build_contribution_confirmation_html(user, contribution, club)
    # Implementation for contribution confirmation
    # Similar structure to above methods
  end

  def self.build_contribution_failed_html(user, contribution, club)
    # Implementation for contribution failed
    # Similar structure to above methods
  end

  def self.build_contribution_refunded_html(user, contribution, club)
    # Implementation for contribution refunded
    # Similar structure to above methods
  end

  def self.build_investment_execution_failed_html(admin, club_investment, club, campaign, error)
    # Implementation for investment execution failed
    # Similar structure to above methods
  end

  # Text versions for additional email types
  def self.build_role_changed_text(user, membership, club)
    # Text implementation
  end

  def self.build_status_changed_text(user, membership, club)
    # Text implementation
  end

  def self.build_contribution_confirmation_text(user, contribution, club)
    # Text implementation
  end

  def self.build_contribution_failed_text(user, contribution, club)
    # Text implementation
  end

  def self.build_contribution_refunded_text(user, contribution, club)
    # Text implementation
  end

  def self.build_investment_execution_failed_text(admin, club_investment, club, campaign, error)
    # Text implementation
  end

  # Common Styles
  def self.email_styles
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
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 30px;
      }
      .greeting {
        font-size: 18px;
        margin-bottom: 20px;
      }
      .investment-details {
        background-color: #f8f9fa;
        border-radius: 6px;
        padding: 20px;
        margin: 20px 0;
        border-left: 4px solid #3498db;
      }
      .detail-row {
        display: flex;
        margin-bottom: 10px;
      }
      .detail-label {
        font-weight: 600;
        width: 180px;
        color: #555;
      }
      .detail-value {
        flex: 1;
      }
      .action-section {
        text-align: center;
        margin: 25px 0;
      }
      .cta-button {
        display: inline-block;
        background-color: #3498db;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: 600;
        margin: 10px 0;
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
      .company-address {
        font-size: 13px;
        color: #777;
        margin-top: 15px;
      }
    CSS
  end

  def self.email_footer
    <<~HTML
      <div class="footer">
        <p>You are receiving this email because you are a member of an investment club on Bantuhive.</p>
        
        <div class="social-links">
          <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
          <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
          <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
        </div>
        
        <div class="company-address">
          IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana
        </div>
        
        <p style="margin-top: 15px;">
          <a href="https://bantuhive.com">© #{Time.current.year} Bantuhive Ltd. All rights reserved.</a>
        </p>
      </div>
    HTML
  end

  def self.send_email(recipient_email, recipient_name, subject, html_content, text_content)
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
          name: 'Bantuhive Investments',
          email: 'help@bantuhive.com'
        },
        headers: {
          'X-Mailin-custom' => 'club_notification'
        }
      )

      # Send email
      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      
      Rails.logger.info "Successfully sent club email to #{recipient_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send club email: #{e.message}"
      false
    end
  end
end