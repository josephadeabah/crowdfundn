# app/services/club_email_service.rb
class ClubEmailService
  include ActionView::Helpers::NumberHelper

  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://bantuhive.com')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@bantuhive.com')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Investments Clubs')
    end

    # Public Methods
    def send_pending_member_notification(admin:, membership:)
      return unless admin && membership

      club = membership.investment_club
      subject = "New member request for #{club.name}"
      
      html_content = build_pending_member_html(admin, membership, club)
      text_content = build_pending_member_text(admin, membership, club)

      send_email(admin.email, admin.full_name, subject, html_content, text_content)
    end

    def send_membership_approved(user:, membership:)
      return unless user && membership

      club = membership.investment_club
      subject = "Your membership to #{club.name} has been approved!"
      
      html_content = build_membership_approved_html(user, membership, club)
      text_content = build_membership_approved_text(user, membership, club)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_membership_rejected(user:, membership:)
      return unless user && membership

      club = membership.investment_club
      subject = "Update on your membership request for #{club.name}"
      
      html_content = build_membership_rejected_html(user, membership, club)
      text_content = build_membership_rejected_text(user, membership, club)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_membership_role_changed(user:, membership:)
      return unless user && membership

      club = membership.investment_club
      subject = "Your role in #{club.name} has been updated"
      
      html_content = build_role_changed_html(user, membership, club)
      text_content = build_role_changed_text(user, membership, club)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_membership_status_changed(user:, membership:)
      return unless user && membership

      club = membership.investment_club
      subject = "Your membership status in #{club.name} has been updated"
      
      html_content = build_status_changed_html(user, membership, club)
      text_content = build_status_changed_text(user, membership, club)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_voting_reminder(user:, club_investment:)
      return unless user && club_investment

      club = club_investment.investment_club
      campaign = club_investment.campaign
      subject = "Vote pending: #{campaign.title} in #{club.name}"
      
      html_content = build_voting_reminder_html(user, club_investment, club, campaign)
      text_content = build_voting_reminder_text(user, club_investment, club, campaign)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_investment_executed(club_investment:)
      return unless club_investment

      club = club_investment.investment_club
      campaign = club_investment.campaign
      
      send_bulk_email_to_members(
        club: club,
        subject: "Investment executed: #{campaign.title}",
        html_builder: ->(member) { build_investment_executed_html(member, club_investment, club, campaign) },
        text_builder: ->(member) { build_investment_executed_text(member, club_investment, club, campaign) }
      )
    end

    def send_investment_confirmation(user:, club_investment:)
      return unless user && club_investment

      club = club_investment.investment_club
      campaign = club_investment.campaign
      subject = "Club Investment Confirmed: #{campaign.title}"
      
      html_content = build_investment_confirmation_html(user, club_investment, club, campaign)
      text_content = build_investment_confirmation_text(user, club_investment, club, campaign)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_investment_failure(admin:, club_investment:, error:, metadata: nil)
      return unless admin && club_investment

      club = club_investment.investment_club
      campaign = club_investment.campaign
      subject = "Investment Failed: #{campaign.title}"
      
      html_content = build_investment_failure_html(admin, club_investment, club, campaign, error, metadata)
      text_content = build_investment_failure_text(admin, club_investment, club, campaign, error, metadata)

      send_email(admin.email, admin.full_name, subject, html_content, text_content)
    end

    def send_investment_finalized_notification(club_investment:, campaign_identifier:, finalized: false, cancellation_window_ended: false)
      return unless club_investment

      club = club_investment.investment_club
      campaign = club_investment.campaign
      
      send_bulk_email_to_members(
        club: club,
        subject: "Investment Finalized: #{campaign.title}",
        html_builder: ->(member) { build_investment_finalized_html(member, club_investment, club, campaign, finalized, cancellation_window_ended) },
        text_builder: ->(member) { build_investment_finalized_text(member, club_investment, club, campaign, finalized, cancellation_window_ended) }
      )
    end

    def send_investment_cancellation_notification(admin:, club_investment:, reason:)
      return unless admin && club_investment

      club = club_investment.investment_club
      campaign = club_investment.campaign
      subject = "Investment Cancelled: #{campaign.title}"
      
      html_content = build_investment_cancellation_html(admin, club_investment, club, campaign, reason)
      text_content = build_investment_cancellation_text(admin, club_investment, club, campaign, reason)

      send_email(admin.email, admin.full_name, subject, html_content, text_content)
    end

    def send_contribution_confirmation(user:, contribution:)
      return unless user && contribution

      club = contribution.investment_club
      subject = "Contribution confirmed for #{club.name}"
      
      html_content = build_contribution_confirmation_html(user, contribution, club)
      text_content = build_contribution_confirmation_text(user, contribution, club)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_contribution_failed(user:, contribution:)
      return unless user && contribution

      club = contribution.investment_club
      subject = "Contribution failed for #{club.name}"
      
      html_content = build_contribution_failed_html(user, contribution, club)
      text_content = build_contribution_failed_text(user, contribution, club)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_contribution_refunded(user:, contribution:)
      return unless user && contribution

      club = contribution.investment_club
      subject = "Contribution refunded for #{club.name}"
      
      html_content = build_contribution_refunded_html(user, contribution, club)
      text_content = build_contribution_refunded_text(user, contribution, club)

      send_email(user.email, user.full_name, subject, html_content, text_content)
    end

    def send_investment_execution_failed(admin:, club_investment:, error:)
      return unless admin && club_investment

      club = club_investment.investment_club
      campaign = club_investment.campaign
      subject = "Investment execution failed: #{campaign.title}"
      
      html_content = build_investment_execution_failed_html(admin, club_investment, club, campaign, error)
      text_content = build_investment_execution_failed_text(admin, club_investment, club, campaign, error)

      send_email(admin.email, admin.full_name, subject, html_content, text_content)
    end

    private

    # Bulk Email Helper
    def send_bulk_email_to_members(club:, subject:, html_builder:, text_builder:)
      members = club.active_members
      return if members.empty?

      results = []
      members.each_slice(50) do |batch| # Process in batches to avoid rate limiting
        batch.each do |member|
          html_content = html_builder.call(member)
          text_content = text_builder.call(member)
          result = send_email(member.email, member.full_name, subject, html_content, text_content)
          results << result
        end
        sleep 0.5 # Small delay between batches
      end

      results.all? # Return true if all succeeded
    end

    # Email Sending Method
    def send_email(recipient_email, recipient_name, subject, html_content, text_content)
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
            'X-Mailin-custom' => 'club_notification',
            'X-Entity-Ref-ID' => "club_#{Time.current.to_i}"
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent club email to #{recipient_email} - Subject: #{subject}"
        true
      rescue => e
        Rails.logger.error "Failed to send club email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # HTML Content Builders
    def build_pending_member_html(admin, membership, club)
      applicant_name = membership.user.full_name

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
                  <a href="#{frontend_url}/clubs/#{club.slug}/members/requests" class="cta-button">Review Requests</a>
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

    def build_membership_approved_html(user, membership, club)
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
              <div class="header" style="background-color: #27ae60;">
                <h1>Membership Approved!</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user.full_name},</p>
                
                <p>Congratulations! Your membership request for <strong>#{club.name}</strong> has been approved.</p>
                
                <div class="action-section">
                  <p>You can now access all club features and participate in investment decisions.</p>
                  <a href="#{frontend_url}/clubs/#{club.slug}/dashboard" class="cta-button">Go to Club Dashboard</a>
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

    def build_membership_rejected_html(user, membership, club)
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
              <div class="header" style="background-color: #e74c3c;">
                <h1>Membership Update</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user.full_name},</p>
                
                <p>Thank you for your interest in joining <strong>#{club.name}</strong>.</p>
                
                <p>After careful review, the club admins have decided not to approve your membership request at this time.</p>
                
                <div class="action-section">
                  <p>We encourage you to explore other investment clubs on Bantuhive that might be a better fit for your investment goals.</p>
                  <a href="#{frontend_url}/clubs" class="cta-button">Explore Clubs</a>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_voting_reminder_html(user, club_investment, club, campaign)
      voting_url = "#{frontend_url}/clubs/#{club.slug}/investments/#{club_investment.id}/vote"

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
              <div class="header" style="background-color: #f39c12;">
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
                    <span class="detail-value">#{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Voting Deadline:</span>
                    <span class="detail-value">#{club_investment.voting_deadline&.strftime('%B %d, %Y at %H:%M') || 'N/A'}</span>
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

    def build_investment_executed_html(member, club_investment, club, campaign)
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
              <div class="header" style="background-color: #27ae60;">
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
                    <span class="detail-value">#{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Execution Date:</span>
                    <span class="detail-value">#{club_investment.executed_at&.strftime('%B %d, %Y') || 'N/A'}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/clubs/#{club.slug}/investments" class="cta-button">View Portfolio</a>
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

    def build_investment_confirmation_html(user, club_investment, club, campaign)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Confirmed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>Investment Confirmed!</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user.full_name},</p>
                
                <p>Your club <strong>#{club.name}</strong> has successfully invested in:</p>
                
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
                    <span class="detail-value">#{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Shares Acquired:</span>
                    <span class="detail-value">#{club_investment.shares&.round(4) || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Ownership Percentage:</span>
                    <span class="detail-value">#{club_investment.percentage&.round(4) || 'N/A'}%</span>
                  </div>
                </div>

                <div class="action-section">
                  <p>You can view the investment certificate in your club portfolio.</p>
                  <a href="#{frontend_url}/clubs/#{club.slug}/investments/#{club_investment.id}" class="cta-button">View Details</a>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_investment_failure_html(admin, club_investment, club, campaign, error, metadata)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Failed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>Investment Failed</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{admin.full_name},</p>
                
                <p>Unfortunately, the investment by <strong>#{club.name}</strong> in <strong>#{campaign.title}</strong> has failed.</p>
                
                <div class="investment-details">
                  <div class="detail-row">
                    <span class="detail-label">Campaign:</span>
                    <span class="detail-value">#{campaign.title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Investment Amount:</span>
                    <span class="detail-value">#{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Error:</span>
                    <span class="detail-value" style="color: #e74c3c;">#{error}</span>
                  </div>
                  #{if metadata
                    "<div class='detail-row'><span class='detail-label'>Additional Info:</span><span class='detail-value'>#{metadata}</span></div>"
                  end}
                </div>

                <div class="action-section">
                  <p>The club balance has been refunded. You can retry the investment if needed.</p>
                  <a href="#{frontend_url}/clubs/#{club.slug}/investments/new" class="cta-button">Retry Investment</a>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_investment_finalized_html(member, club_investment, club, campaign, finalized, cancellation_window_ended)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Finalized</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #2c3e50;">
                <h1>Investment Finalized</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{member.full_name},</p>
                
                <p>Great news! The investment by <strong>#{club.name}</strong> in <strong>#{campaign.title}</strong> has been finalized.</p>
                
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
                    <span class="detail-value">#{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Shares Acquired:</span>
                    <span class="detail-value">#{club_investment.shares&.round(4) || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Ownership Percentage:</span>
                    <span class="detail-value">#{club_investment.percentage&.round(4) || 'N/A'}%</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Finalization Date:</span>
                    <span class="detail-value">#{Time.current.strftime('%B %d, %Y')}</span>
                  </div>
                </div>

                #{if cancellation_window_ended
                    '<div class="action-section">
                      <p>The 48-hour cancellation window has ended and this investment is now fully processed.</p>
                    </div>'
                  end}

                <div class="action-section">
                  <a href="#{frontend_url}/clubs/#{club.slug}/investments/#{club_investment.id}" class="cta-button">View Investment Certificate</a>
                </div>

                <p>Congratulations on this successful investment!<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_investment_cancellation_html(admin, club_investment, club, campaign, reason)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Cancelled</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e67e22;">
                <h1>Investment Cancelled</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{admin.full_name},</p>
                
                <p>An investment by <strong>#{club.name}</strong> has been cancelled.</p>
                
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
                    <span class="detail-value">#{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Cancellation Reason:</span>
                    <span class="detail-value">#{reason}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Cancelled At:</span>
                    <span class="detail-value">#{Time.current.strftime('%B %d, %Y at %H:%M')}</span>
                  </div>
                </div>

                <div class="action-section">
                  <p>The investment amount has been refunded to the club's balance.</p>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_role_changed_html(user, membership, club)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Role Updated</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Role Updated</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user.full_name},</p>
                
                <p>Your role in <strong>#{club.name}</strong> has been updated.</p>
                
                <div class="investment-details">
                  <div class="detail-row">
                    <span class="detail-label">New Role:</span>
                    <span class="detail-value" style="font-weight: 600; color: #2c3e50;">#{membership.role.titleize}</span>
                  </div>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_status_changed_html(user, membership, club)
      status_color = membership.status == 'active' ? '#27ae60' : '#e74c3c'
      
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Membership Status Updated</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{status_color};">
                <h1>Membership Status Updated</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user.full_name},</p>
                
                <p>Your membership status in <strong>#{club.name}</strong> has been updated.</p>
                
                <div class="investment-details">
                  <div class="detail-row">
                    <span class="detail-label">New Status:</span>
                    <span class="detail-value" style="font-weight: 600; color: #{status_color};">#{membership.status.titleize}</span>
                  </div>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_contribution_confirmation_html(user, contribution, club)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Contribution Confirmed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>Contribution Confirmed</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user.full_name},</p>
                
                <p>Your contribution of <strong>#{club.currency_symbol}#{number_with_delimiter(contribution.amount)}</strong> to <strong>#{club.name}</strong> has been confirmed.</p>
                
                <div class="investment-details">
                  <div class="detail-row">
                    <span class="detail-label">Contribution Date:</span>
                    <span class="detail-value">#{contribution.created_at.strftime('%B %d, %Y')}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Reference:</span>
                    <span class="detail-value">#{contribution.reference || 'N/A'}</span>
                  </div>
                </div>

                <p>Your club share percentage has been updated accordingly.</p>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_contribution_failed_html(user, contribution, club)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Contribution Failed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>Contribution Failed</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user.full_name},</p>
                
                <p>Your contribution of <strong>#{club.currency_symbol}#{number_with_delimiter(contribution.amount)}</strong> to <strong>#{club.name}</strong> has failed.</p>
                
                <div class="action-section">
                  <p>Please check your payment method and try again.</p>
                  <a href="#{frontend_url}/clubs/#{club.slug}/contributions/new" class="cta-button">Try Again</a>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_contribution_refunded_html(user, contribution, club)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Contribution Refunded</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e67e22;">
                <h1>Contribution Refunded</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user.full_name},</p>
                
                <p>Your contribution of <strong>#{club.currency_symbol}#{number_with_delimiter(contribution.amount)}</strong> to <strong>#{club.name}</strong> has been refunded.</p>
                
                <div class="action-section">
                  <p>If you have any questions, please contact support.</p>
                  <a href="#{frontend_url}/support" class="cta-button">Contact Support</a>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_investment_execution_failed_html(admin, club_investment, club, campaign, error)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Execution Failed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>Investment Execution Failed</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{admin.full_name},</p>
                
                <p>The investment execution for <strong>#{campaign.title}</strong> by <strong>#{club.name}</strong> has failed.</p>
                
                <div class="investment-details">
                  <div class="detail-row">
                    <span class="detail-label">Error:</span>
                    <span class="detail-value" style="color: #e74c3c;">#{error}</span>
                  </div>
                </div>

                <div class="action-section">
                  <p>Please review the investment and try again.</p>
                  <a href="#{frontend_url}/clubs/#{club.slug}/investments/#{club_investment.id}" class="cta-button">Review Investment</a>
                </div>

                <p>Best regards,<br>
                <strong>The Bantuhive Team</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Content Builders
    def build_pending_member_text(admin, membership, club)
      applicant_name = membership.user.full_name

      <<~TEXT
        Hello #{admin.full_name},

        #{applicant_name} has requested to join your investment club #{club.name}.

        Please review this request in your club management dashboard:
        #{frontend_url}/clubs/#{club.slug}/members/requests

        Warm regards,
        The Bantuhive Team
      TEXT
    end

    def build_membership_approved_text(user, membership, club)
      <<~TEXT
        Hello #{user.full_name},

        Congratulations! Your membership request for #{club.name} has been approved.

        You can now access all club features and participate in investment decisions.
        #{frontend_url}/clubs/#{club.slug}/dashboard

        Welcome to the club!
        The Bantuhive Team
      TEXT
    end

    def build_membership_rejected_text(user, membership, club)
      <<~TEXT
        Hello #{user.full_name},

        Thank you for your interest in joining #{club.name}.

        After careful review, the club admins have decided not to approve your membership request at this time.

        We encourage you to explore other investment clubs on Bantuhive that might be a better fit for your investment goals.
        #{frontend_url}/clubs

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_voting_reminder_text(user, club_investment, club, campaign)
      voting_url = "#{frontend_url}/clubs/#{club.slug}/investments/#{club_investment.id}/vote"

      <<~TEXT
        Hello #{user.full_name},

        Your vote is needed for an investment proposal in #{club.name}.

        Campaign: #{campaign.title}
        Company: #{campaign.company_name}
        Investment Amount: #{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}
        Voting Deadline: #{club_investment.voting_deadline&.strftime('%B %d, %Y at %H:%M') || 'N/A'}

        Cast your vote now: #{voting_url}

        Your participation helps shape the club's investment decisions!
        The Bantuhive Team
      TEXT
    end

    def build_investment_executed_text(member, club_investment, club, campaign)
      <<~TEXT
        Hello #{member.full_name},

        Great news! Your club #{club.name} has successfully executed an investment.

        Campaign: #{campaign.title}
        Company: #{campaign.company_name}
        Investment Amount: #{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}
        Execution Date: #{club_investment.executed_at&.strftime('%B %d, %Y') || 'N/A'}

        View the investment details on your club portfolio:
        #{frontend_url}/clubs/#{club.slug}/investments

        Congratulations on this collective achievement!
        The Bantuhive Team
      TEXT
    end

    def build_investment_confirmation_text(user, club_investment, club, campaign)
      <<~TEXT
        Hello #{user.full_name},

        Your club #{club.name} has successfully invested in #{campaign.title}.

        Investment Details:
        - Campaign: #{campaign.title}
        - Company: #{campaign.company_name}
        - Investment Amount: #{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}
        - Shares Acquired: #{club_investment.shares&.round(4) || 'N/A'}
        - Ownership Percentage: #{club_investment.percentage&.round(4) || 'N/A'}%

        You can view the investment certificate in your club portfolio:
        #{frontend_url}/clubs/#{club.slug}/investments/#{club_investment.id}

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_investment_failure_text(admin, club_investment, club, campaign, error, metadata)
      text = <<~TEXT
        Hello #{admin.full_name},

        Unfortunately, the investment by #{club.name} in #{campaign.title} has failed.

        Investment Details:
        - Campaign: #{campaign.title}
        - Investment Amount: #{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}
        - Error: #{error}
      TEXT
      
      text += "  - Additional Info: #{metadata}\n" if metadata.present?
      
      text += <<~TEXT

        The club balance has been refunded. You can retry the investment if needed.
        #{frontend_url}/clubs/#{club.slug}/investments/new

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_investment_finalized_text(member, club_investment, club, campaign, finalized, cancellation_window_ended)
      text = <<~TEXT
        Hello #{member.full_name},

        Great news! The investment by #{club.name} in #{campaign.title} has been finalized.

        Investment Details:
        - Campaign: #{campaign.title}
        - Company: #{campaign.company_name}
        - Investment Amount: #{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}
        - Shares Acquired: #{club_investment.shares&.round(4) || 'N/A'}
        - Ownership Percentage: #{club_investment.percentage&.round(4) || 'N/A'}%
        - Finalization Date: #{Time.current.strftime('%B %d, %Y')}
      TEXT
      
      text += "\nThe 48-hour cancellation window has ended and this investment is now fully processed." if cancellation_window_ended
      
      text += <<~TEXT

        You can view the investment certificate in your club portfolio:
        #{frontend_url}/clubs/#{club.slug}/investments/#{club_investment.id}

        Congratulations on this successful investment!
        The Bantuhive Team
      TEXT
    end

    def build_investment_cancellation_text(admin, club_investment, club, campaign, reason)
      <<~TEXT
        Hello #{admin.full_name},

        An investment by #{club.name} has been cancelled.

        Investment Details:
        - Campaign: #{campaign.title}
        - Company: #{campaign.company_name}
        - Investment Amount: #{campaign.currency_symbol}#{number_with_delimiter(club_investment.investment_amount)}
        - Cancellation Reason: #{reason}
        - Cancelled At: #{Time.current.strftime('%B %d, %Y at %H:%M')}

        The investment amount has been refunded to the club's balance.

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_role_changed_text(user, membership, club)
      <<~TEXT
        Hello #{user.full_name},

        Your role in #{club.name} has been updated.

        New Role: #{membership.role.titleize}

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_status_changed_text(user, membership, club)
      <<~TEXT
        Hello #{user.full_name},

        Your membership status in #{club.name} has been updated.

        New Status: #{membership.status.titleize}

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_contribution_confirmation_text(user, contribution, club)
      <<~TEXT
        Hello #{user.full_name},

        Your contribution of #{club.currency_symbol}#{number_with_delimiter(contribution.amount)} to #{club.name} has been confirmed.

        Contribution Date: #{contribution.created_at.strftime('%B %d, %Y')}
        Reference: #{contribution.reference || 'N/A'}

        Your club share percentage has been updated accordingly.

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_contribution_failed_text(user, contribution, club)
      <<~TEXT
        Hello #{user.full_name},

        Your contribution of #{club.currency_symbol}#{number_with_delimiter(contribution.amount)} to #{club.name} has failed.

        Please check your payment method and try again:
        #{frontend_url}/clubs/#{club.slug}/contributions/new

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_contribution_refunded_text(user, contribution, club)
      <<~TEXT
        Hello #{user.full_name},

        Your contribution of #{club.currency_symbol}#{number_with_delimiter(contribution.amount)} to #{club.name} has been refunded.

        If you have any questions, please contact support:
        #{frontend_url}/support

        Best regards,
        The Bantuhive Team
      TEXT
    end

    def build_investment_execution_failed_text(admin, club_investment, club, campaign, error)
      <<~TEXT
        Hello #{admin.full_name},

        The investment execution for #{campaign.title} by #{club.name} has failed.

        Error: #{error}

        Please review the investment and try again:
        #{frontend_url}/clubs/#{club.slug}/investments/#{club_investment.id}

        Best regards,
        The Bantuhive Team
      TEXT
    end

    # Common Styles
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
        .cta-button:hover {
          background-color: #2980b9;
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
          }
          .content {
            padding: 20px;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you are a member of an investment club on Bantuhive.</p>
          
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