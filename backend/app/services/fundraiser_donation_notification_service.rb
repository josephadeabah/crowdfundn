# app/services/fundraiser_donation_notification_service.rb
class FundraiserDonationNotificationService
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

    def template_id
      ENV.fetch('BREVO_FUNDRAISER_DONATION_TEMPLATE_ID', 2).to_i
    end

    # Main Method
    def send_notification_email(donation)
      # Validate required data
      return false unless validate_donation(donation)

      campaign = donation.campaign
      fundraiser = campaign.fundraiser
      
      # Extract donor information
      donor_name = extract_donor_name(donation)
      donor_email = donation.email.presence
      is_anonymous = donor_name == 'Anonymous Donor'
      
      # Extract financial details
      gross_amount = donation.gross_amount.to_f
      fee_amount = donation.fee_amount.to_f if donation.respond_to?(:fee_amount)
      net_amount = donation.net_amount.to_f if donation.respond_to?(:net_amount)
      
      currency_symbol = campaign.currency_symbol || 'GHS'
      
      # Build URLs
      campaign_url = build_campaign_url(campaign)
      dashboard_url = build_dashboard_url(fundraiser)
      
      # Build subject with appropriate emoji
      subject = build_subject(campaign.title, gross_amount)

      html_content = build_html_content(
        fundraiser_name: fundraiser.full_name,
        donor_name: donor_name,
        is_anonymous: is_anonymous,
        campaign_name: campaign.title,
        campaign_url: campaign_url,
        dashboard_url: dashboard_url,
        currency_symbol: currency_symbol,
        gross_amount: gross_amount,
        fee_amount: fee_amount,
        net_amount: net_amount,
        transaction_date: donation.created_at.strftime('%B %d, %Y'),
        transaction_reference: donation.transaction_reference || donation.id,
        donor_email: donor_email,
        support_email: support_email,
        is_first_donation: donation.campaign.donations.count <= 1
      )

      text_content = build_text_content(
        fundraiser_name: fundraiser.full_name,
        donor_name: donor_name,
        is_anonymous: is_anonymous,
        campaign_name: campaign.title,
        campaign_url: campaign_url,
        dashboard_url: dashboard_url,
        currency_symbol: currency_symbol,
        gross_amount: gross_amount,
        fee_amount: fee_amount,
        net_amount: net_amount,
        transaction_date: donation.created_at.strftime('%B %d, %Y'),
        transaction_reference: donation.transaction_reference || donation.id,
        donor_email: donor_email,
        support_email: support_email
      )

      result = send_email(
        fundraiser.email,
        fundraiser.full_name,
        subject,
        html_content,
        text_content,
        donor_email,
        donor_name
      )

      if result
        log_email_sent(donation, fundraiser.email)
      end

      result
    end

    private

    # Validation Methods
    def validate_donation(donation)
      return false unless donation
      return false unless donation.campaign
      return false unless donation.campaign.fundraiser
      return false unless donation.campaign.fundraiser.email.present?
      true
    end

    # Helper Methods
    def extract_donor_name(donation)
      if donation.anonymous
        'Anonymous Donor'
      elsif donation.full_name.present?
        donation.full_name
      elsif donation.user&.full_name.present?
        donation.user.full_name
      else
        'Valued Supporter'
      end
    end

    # URL Builders
    def build_campaign_url(campaign)
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    def build_dashboard_url(fundraiser)
      "#{frontend_url}/fundraisers/dashboard"
    end

    # Subject Builder
    def build_subject(campaign_name, amount)
      amount_formatted = number_with_delimiter(amount)
      "🎉 New donation of #{amount_formatted} for #{campaign_name}!"
    end

    # HTML Content Builder
    def build_html_content(
      fundraiser_name:,
      donor_name:,
      is_anonymous:,
      campaign_name:,
      campaign_url:,
      dashboard_url:,
      currency_symbol:,
      gross_amount:,
      fee_amount:,
      net_amount:,
      transaction_date:,
      transaction_reference:,
      donor_email:,
      support_email:,
      is_first_donation:
    )
      formatted_gross = number_with_delimiter(gross_amount)
      formatted_fee = fee_amount ? number_with_delimiter(fee_amount) : nil
      formatted_net = net_amount ? number_with_delimiter(net_amount) : nil
      
      donor_display = is_anonymous ? 'an anonymous supporter' : donor_name
      greeting = is_anonymous ? 'A supporter has' : "#{donor_name} has"

      # Determine message based on donation significance
      celebration_message = if gross_amount >= 1000
        "🌈 This is a significant contribution that will make a real impact!"
      elsif is_first_donation
        "🌟 Your first donation! A great start to your campaign!"
      else
        "💪 Every contribution brings you closer to your goal!"
      end

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>New Donation Received</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>🎉 New Donation Received!</h1>
              </div>

              <div class="content">
                <p class="greeting">Hi #{fundraiser_name},</p>
                
                <p><strong>#{greeting} donated <span style="font-size: 24px; color: #27ae60; font-weight: bold;">#{currency_symbol} #{formatted_gross}</span></strong> to your campaign "<strong>#{campaign_name}</strong>".</p>
                
                <p>#{celebration_message}</p>

                <div class="donation-details">
                  <div class="detail-row">
                    <span class="detail-label">💰 Gross Amount:</span>
                    <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #27ae60;">#{currency_symbol} #{formatted_gross}</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>📊 Platform Fee:</span>
                    <span class='detail-value'>- #{currency_symbol} #{formatted_fee}</span>
                  </div>" if formatted_fee}
                  #{"<div class='detail-row'>
                    <span class='detail-label'>📈 Net Amount:</span>
                    <span class='detail-value' style='font-weight: bold; color: #2980b9;'>#{currency_symbol} #{formatted_net}</span>
                  </div>" if formatted_net}
                  <div class="detail-row">
                    <span class="detail-label">👤 Donor:</span>
                    <span class="detail-value">#{is_anonymous ? 'Anonymous Supporter 🤫' : donor_name}</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>📧 Email:</span>
                    <span class='detail-value'><a href='mailto:#{donor_email}'>#{donor_email}</a></span>
                  </div>" if donor_email && !is_anonymous}
                  <div class="detail-row">
                    <span class="detail-label">📅 Date:</span>
                    <span class="detail-value">#{transaction_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🔑 Reference:</span>
                    <span class="detail-value">#{transaction_reference}</span>
                  </div>
                </div>

                <div class="action-section">
                  <p>What would you like to do next?</p>
                  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    <a href="#{campaign_url}" class="cta-button" style="background-color: #27ae60;">📱 View Campaign</a>
                    #{"<a href='mailto:#{donor_email}?subject=Thank you for your donation to #{campaign_name}' class='cta-button' style='background-color: #3498db;'>💬 Thank Donor</a>" if donor_email && !is_anonymous}
                    <a href="#{dashboard_url}" class="cta-button" style="background-color: #2c3e50;">📊 Dashboard</a>
                  </div>
                </div>

                <div class="campaign-progress">
                  <h3>📊 Campaign Progress</h3>
                  <p>Keep up the great work! Every donation helps make a difference.</p>
                </div>

                <div class="support-section">
                  <p><strong>Need assistance?</strong> Our support team is here to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thanks for being part of the Bantuhive community!<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Content Builder
    def build_text_content(
      fundraiser_name:,
      donor_name:,
      is_anonymous:,
      campaign_name:,
      campaign_url:,
      dashboard_url:,
      currency_symbol:,
      gross_amount:,
      fee_amount:,
      net_amount:,
      transaction_date:,
      transaction_reference:,
      donor_email:,
      support_email:
    )
      formatted_gross = number_with_delimiter(gross_amount)
      formatted_fee = fee_amount ? number_with_delimiter(fee_amount) : nil
      formatted_net = net_amount ? number_with_delimiter(net_amount) : nil
      
      donor_display = is_anonymous ? 'Anonymous Supporter' : donor_name

      text = <<~TEXT
        Hi #{fundraiser_name},

        #{donor_display} has donated #{currency_symbol} #{formatted_gross} to your campaign "#{campaign_name}".

        Donation Details:
        - Gross Amount: #{currency_symbol} #{formatted_gross}
        #{formatted_fee ? "- Platform Fee: #{currency_symbol} #{formatted_fee}" : ""}
        #{formatted_net ? "- Net Amount: #{currency_symbol} #{formatted_net}" : ""}
        - Donor: #{donor_display}
        #{!is_anonymous && donor_email ? "- Email: #{donor_email}" : ""}
        - Date: #{transaction_date}
        - Reference: #{transaction_reference}

        What would you like to do next?
        - View Campaign: #{campaign_url}
        #{!is_anonymous && donor_email ? "- Thank Donor: mailto:#{donor_email}" : ""}
        - Dashboard: #{dashboard_url}

        Need assistance? Contact our support team at #{support_email}.

        Thanks for being part of the Bantuhive community!
        #{sender_name}

        You are receiving this email because you are a fundraiser on Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email, recipient_name, subject, html_content, text_content, reply_to_email, reply_to_name)
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
          replyTo: reply_to_email.present? ? {
            email: reply_to_email,
            name: reply_to_name || 'Supporter'
          } : nil,
          headers: {
            'X-Mailin-custom' => 'fundraiser_donation_notification',
            'X-Entity-Ref-ID' => "donation_notification_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'fundraiser_donation_notification',
            'X-Priority' => '1 (Highest)'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent fundraiser donation notification to #{recipient_email}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending fundraiser notification to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send fundraiser notification to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(donation, fundraiser_email)
      log_data = {
        donation_id: donation.id,
        fundraiser_email: fundraiser_email,
        amount: donation.gross_amount,
        campaign_id: donation.campaign_id,
        sent_at: Time.current.iso8601
      }
      
      Rails.logger.info "Fundraiser donation notification sent: #{log_data.to_json}"
      
      # Update donation record if tracking fields exist
      if donation.respond_to?(:update) && donation.respond_to?(:fundraiser_notification_sent_at)
        donation.update(fundraiser_notification_sent_at: Time.current)
      end
    end

    def number_with_delimiter(number)
      return '0' if number.nil? || number == 0
      
      parts = number.to_s.split('.')
      parts[0] = parts[0].reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
      parts.join('.')
    rescue => e
      number.to_s
    end

    # Common Styles
    def email_styles
      <<~CSS
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f0faf0;
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
          background-color: #27ae60;
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
        .donation-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #27ae60;
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
        .detail-label {
          font-weight: 600;
          width: 180px;
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
        .action-section {
          text-align: center;
          margin: 25px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #27ae60;
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
        .campaign-progress {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #2980b9;
        }
        .campaign-progress h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .support-section {
          background-color: #fef9e7;
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
          background-color: #f0faf0;
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
          .action-section {
            display: flex;
            flex-direction: column;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you are a fundraiser on Bantuhive.</p>
          
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