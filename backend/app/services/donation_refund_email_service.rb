# app/services/donation_refund_email_service.rb
class DonationRefundEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Support')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    # Main Method
    def send_refund_email(donation:, recipient_email:, recipient_name:, reason:, refund_metadata: {})
      return false unless donation
      return false unless recipient_email.present?

      campaign = donation.campaign
      amount = donation.amount&.round(2)
      currency_symbol = campaign&.currency_symbol || '₵'
      
      # Build URLs
      campaign_url = build_campaign_url(campaign)
      support_url = "#{frontend_url}/support"
      
      # Parse refund metadata
      refund_details = parse_refund_details(refund_metadata, donation)

      subject = build_subject(refund_details, campaign)

      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        reason: reason,
        donation: donation,
        refund_details: refund_details
      )

      text_content = build_text_content(
        campaign: campaign,
        campaign_url: campaign_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        reason: reason,
        donation: donation,
        refund_details: refund_details
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content, donation)

      if result
        log_email_sent(donation, recipient_email, refund_details)
      end

      result
    end

    private

    # URL Builders
    def build_campaign_url(campaign)
      return frontend_url if campaign.nil?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    # Subject Builder
    def build_subject(refund_details, campaign)
      campaign_name = campaign&.title || 'the campaign'
      refund_type = refund_details[:refund_type].to_s.humanize.downcase
      
      case refund_details[:refund_type]
      when :full
        "Your full donation refund for #{campaign_name} has been processed"
      when :partial
        "Your partial donation refund for #{campaign_name} has been processed"
      when :failed
        "Update on your donation refund request for #{campaign_name}"
      else
        "Your donation refund for #{campaign_name} has been processed"
      end
    end

    # Refund Details Parser
    def parse_refund_details(refund_metadata, donation)
      {
        refund_type: refund_metadata[:refund_type] || :full,
        refund_method: refund_metadata[:refund_method] || 'Original Payment Method',
        refund_id: refund_metadata[:refund_id] || refund_metadata[:transaction_id],
        refunded_amount: refund_metadata[:refunded_amount] || donation.amount,
        original_transaction: donation.transaction_reference || donation.id,
        processed_at: refund_metadata[:processed_at] || Time.current,
        estimated_days: refund_metadata[:estimated_days] || calculate_estimated_days(refund_metadata[:refund_method]),
        status: refund_metadata[:status] || 'Completed',
        processor: refund_metadata[:processor] || 'Payment Gateway'
      }
    end

    def calculate_estimated_days(refund_method)
      case refund_method&.downcase
      when /card|credit|debit|visa|mastercard/
        '3-5 business days'
      when /bank|ach|transfer|direct debit/
        '5-7 business days'
      when /mobile money|momo|mtn|vodafone|airtel/
        '1-3 business days'
      when /paypal|stripe|flutterwave|paystack/
        '2-5 business days'
      else
        '3-5 business days'
      end
    end

    # HTML Content Builder
    def build_html_content(
      campaign:,
      campaign_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      reason:,
      donation:,
      refund_details:
    )
      formatted_amount = number_with_delimiter(amount)
      formatted_refunded_amount = number_with_delimiter(refund_details[:refunded_amount])
      
      # Determine header color based on refund type
      header_color = case refund_details[:refund_type]
      when :failed
        '#e74c3c'  # Red for failed
      when :partial
        '#f39c12'  # Yellow/Orange for partial
      else
        '#27ae60'  # Green for full refunds
      end

      # Determine if this is a full or partial refund
      is_full_refund = refund_details[:refund_type] == :full
      refund_emoji = is_full_refund ? '↩️' : '↪️'
      refund_title = is_full_refund ? 'Donation Refund Processed' : 'Partial Donation Refund Processed'

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>#{refund_title}</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{header_color};">
                <h1>#{refund_emoji} #{refund_title}</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>
                
                <p>Your donation refund has been successfully processed.</p>

                <div class="investment-details" style="border-left-color: #{header_color};">
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #{header_color}; font-weight: 600;">#{refund_details[:status]}</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Campaign:</span><span class='detail-value'>#{campaign.title}</span></div>" if campaign}
                  #{"<div class='detail-row'><span class='detail-label'>Refund Amount:</span><span class='detail-value'>#{currency_symbol} #{formatted_refunded_amount}</span></div>" if refund_details[:refunded_amount]}
                  #{"<div class='detail-row'><span class='detail-label'>Original Amount:</span><span class='detail-value'>#{currency_symbol} #{formatted_amount}</span></div>" if amount && !is_full_refund}
                  <div class="detail-row">
                    <span class="detail-label">Refund Type:</span>
                    <span class="detail-value">#{refund_details[:refund_type].to_s.humanize}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Refund Method:</span>
                    <span class="detail-value">#{refund_details[:refund_method]}</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Refund ID:</span><span class='detail-value'>#{refund_details[:refund_id]}</span></div>" if refund_details[:refund_id]}
                  <div class="detail-row">
                    <span class="detail-label">Original Reference:</span>
                    <span class="detail-value">#{refund_details[:original_transaction]}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Processed By:</span>
                    <span class="detail-value">#{refund_details[:processor]}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Processed Date:</span>
                    <span class="detail-value">#{refund_details[:processed_at].strftime('%B %d, %Y at %H:%M')}</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Reason:</span><span class='detail-value' style='color: #c0392b;'>#{reason}</span></div>" if reason.present?}
                </div>

                <div class="refund-timeline">
                  <h3>Refund Timeline</h3>
                  <p>The refund should reflect in your account within <strong>#{refund_details[:estimated_days]}</strong>, depending on your payment provider's processing time.</p>
                  <div class="timeline-steps">
                    <div class="timeline-step completed">
                      <span class="step-icon">✅</span>
                      <span class="step-text">Refund initiated</span>
                    </div>
                    <div class="timeline-step">
                      <span class="step-icon">⏳</span>
                      <span class="step-text">Processing by #{refund_details[:processor]}</span>
                    </div>
                    <div class="timeline-step">
                      <span class="step-icon">📤</span>
                      <span class="step-text">Credited to your #{refund_details[:refund_method]}</span>
                    </div>
                  </div>
                </div>

                #{"<div class='action-section'>
                  <p>Would you like to support another cause?</p>
                  <a href='#{frontend_url}/campaigns' class='cta-button' style='background-color: #27ae60;'>Explore Campaigns</a>
                </div>" if is_full_refund}

                #{"<div class='action-section'>
                  <p>You can view your donation history at any time.</p>
                  <a href='#{frontend_url}/donations' class='cta-button' style='background-color: #3498db;'>View Donation History</a>
                </div>"}

                <div class="support-section">
                  <p><strong>Need assistance?</strong> Our support team is here to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                  <p>🌐 <a href="#{support_url}">Visit Support Center</a></p>
                </div>

                <p>Thank you for your understanding,<br>
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
      campaign:,
      campaign_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      reason:,
      donation:,
      refund_details:
    )
      formatted_amount = number_with_delimiter(amount)
      formatted_refunded_amount = number_with_delimiter(refund_details[:refunded_amount])
      is_full_refund = refund_details[:refund_type] == :full

      text = <<~TEXT
        Dear #{recipient_name},

        Your donation refund has been successfully processed.

        Refund Details:
        - Status: #{refund_details[:status]}
        #{campaign ? "- Campaign: #{campaign.title}" : ""}
        - Refund Amount: #{currency_symbol} #{formatted_refunded_amount}
        #{!is_full_refund && amount ? "- Original Amount: #{currency_symbol} #{formatted_amount}" : ""}
        - Refund Type: #{refund_details[:refund_type].to_s.humanize}
        - Refund Method: #{refund_details[:refund_method]}
        #{refund_details[:refund_id] ? "- Refund ID: #{refund_details[:refund_id]}" : ""}
        - Original Reference: #{refund_details[:original_transaction]}
        - Processed By: #{refund_details[:processor]}
        - Processed Date: #{refund_details[:processed_at].strftime('%B %d, %Y at %H:%M')}
        #{reason.present? ? "- Reason: #{reason}" : ""}

        Refund Timeline:
        The refund should reflect in your account within #{refund_details[:estimated_days]}, depending on your payment provider's processing time.

        1. ✅ Refund initiated
        2. ⏳ Processing by #{refund_details[:processor]}
        3. 📤 Credited to your #{refund_details[:refund_method]}
      TEXT

      if is_full_refund
        text += "\nWould you like to support another cause?\nExplore campaigns: #{frontend_url}/campaigns"
      end

      text += "\n\nYou can view your donation history at any time:\n#{frontend_url}/donations"

      text += <<~TEXT

        Need assistance? Our support team is here to help.
        Email: #{support_email}
        Support Center: #{support_url}

        Thank you for your understanding,
        #{sender_name}

        You are receiving this email because you made a donation through Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email, recipient_name, subject, html_content, text_content, donation)
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
            'X-Mailin-custom' => 'donation_refund',
            'X-Entity-Ref-ID' => "donation_refund_#{donation.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'donation_refund'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent donation refund email to #{recipient_email} - Donation ID: #{donation.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending donation refund to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send donation refund email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(donation, recipient_email, refund_details)
      log_data = {
        donation_id: donation.id,
        recipient_email: recipient_email,
        sent_at: Time.current.iso8601,
        refund_type: refund_details[:refund_type],
        refund_amount: refund_details[:refunded_amount],
        refund_method: refund_details[:refund_method],
        campaign_id: donation.campaign_id
      }
      
      Rails.logger.info "Donation refund email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if donation.respond_to?(:update) && donation.respond_to?(:refund_email_sent_at)
        donation.update(
          refund_email_sent_at: Time.current,
          refund_processed_at: refund_details[:processed_at],
          refund_type: refund_details[:refund_type]
        )
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
          background-color: #27ae60;
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
          border-left: 4px solid #27ae60;
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
        .refund-timeline {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .refund-timeline h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .timeline-steps {
          margin: 15px 0;
        }
        .timeline-step {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #d4e6f1;
        }
        .timeline-step:last-child {
          border-bottom: none;
        }
        .timeline-step.completed {
          opacity: 0.7;
        }
        .step-icon {
          font-size: 20px;
          margin-right: 10px;
          min-width: 30px;
        }
        .step-text {
          font-size: 14px;
          color: #2c3e50;
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
          margin: 10px 0;
        }
        .cta-button:hover {
          opacity: 0.9;
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
          .cta-button {
            display: block;
            margin: 10px 0;
          }
          .timeline-step {
            flex-wrap: wrap;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you made a donation through Bantuhive.</p>
          
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