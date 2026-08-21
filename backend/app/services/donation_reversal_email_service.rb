# app/services/donation_reversal_email_service.rb
class DonationReversalEmailService
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
    def send_reversal_email(donation:, recipient_email:, recipient_name:, reversal_reason:, metadata: {})
      return false unless donation
      return false unless recipient_email.present?

      campaign = donation.campaign
      amount = donation.amount&.round(2)
      currency_symbol = campaign&.currency_symbol || '₵'
      
      # Build URLs
      campaign_url = build_campaign_url(campaign, metadata)
      dispute_url = build_dispute_url(donation, metadata)
      support_url = "#{frontend_url}/support"
      
      # Parse reversal details
      reversal_details = parse_reversal_details(reversal_reason, metadata, donation)

      subject = build_subject(reversal_details, campaign)

      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        dispute_url: dispute_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        reversal_details: reversal_details,
        donation: donation,
        metadata: metadata
      )

      text_content = build_text_content(
        campaign: campaign,
        campaign_url: campaign_url,
        dispute_url: dispute_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        reversal_details: reversal_details,
        donation: donation,
        metadata: metadata
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content, donation)

      if result
        log_email_sent(donation, recipient_email, reversal_details)
      end

      result
    end

    private

    # URL Builders
    def build_campaign_url(campaign, metadata)
      return metadata[:redirect_url] if metadata[:redirect_url].present?
      return frontend_url if campaign.nil?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    def build_dispute_url(donation, metadata)
      return metadata[:dispute_url] if metadata[:dispute_url].present?
      
      if donation.respond_to?(:id)
        "#{frontend_url}/donations/#{donation.id}/dispute"
      else
        "#{frontend_url}/support"
      end
    end

    # Subject Builder
    def build_subject(reversal_details, campaign)
      campaign_name = campaign&.title || 'the campaign'
      
      case reversal_details[:reversal_type]
      when :chargeback
        "Important: Chargeback initiated for your donation to #{campaign_name}"
      when :fraud_reversal
        "Urgent: Your donation to #{campaign_name} was flagged for fraud review"
      when :bank_reversal
        "Your bank has reversed your donation to #{campaign_name}"
      when :system_correction
        "Correction: Your donation to #{campaign_name} has been reversed"
      when :duplicate
        "Duplicate donation reversed for #{campaign_name}"
      else
        "Important update regarding your donation to #{campaign_name}"
      end
    end

    # Reversal Details Parser
    def parse_reversal_details(reversal_reason, metadata, donation)
      reason_text = reversal_reason.to_s
      
      # Determine reversal type
      reversal_type = if reason_text.match?(/chargeback|dispute|unauthorized|fraud|stolen/i)
        :chargeback
      elsif reason_text.match?(/fraud|suspicious|risk|high risk|fraudulent/i)
        :fraud_reversal
      elsif reason_text.match?(/bank reversal|bank return|bank declined|reversed by bank/i)
        :bank_reversal
      elsif reason_text.match?(/duplicate|double|repeated|same|identical/i)
        :duplicate
      elsif reason_text.match?(/correction|adjustment|system|technical|error|bug/i)
        :system_correction
      else
        :other
      end

      # Determine urgency level
      urgency = case reversal_type
      when :chargeback, :fraud_reversal
        :high
      when :bank_reversal
        :medium
      else
        :low
      end

      # Determine if donor can dispute
      can_dispute = case reversal_type
      when :chargeback, :fraud_reversal, :bank_reversal
        true
      else
        false
      end

      # Calculate estimated processing time
      estimated_days = case reversal_type
      when :chargeback
        "30-45 days (depending on bank investigation)"
      when :fraud_reversal
        "3-5 business days (under review)"
      when :bank_reversal
        "5-7 business days"
      when :duplicate
        "1-3 business days"
      else
        "3-5 business days"
      end

      {
        text: reason_text,
        reversal_type: reversal_type,
        urgency: urgency,
        can_dispute: can_dispute,
        estimated_days: estimated_days,
        reversal_id: metadata[:reversal_id] || metadata[:transaction_id],
        processor: metadata[:processor] || metadata[:gateway] || 'Payment Processor',
        processed_at: metadata[:processed_at] || Time.current,
        status: metadata[:status] || 'Processing',
        is_retry: metadata[:is_retry] || false,
        original_transaction: donation.transaction_reference || donation.id
      }
    end

    # HTML Content Builder
    def build_html_content(
      campaign:,
      campaign_url:,
      dispute_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      reversal_details:,
      donation:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      
      # Determine header color based on urgency
      header_color = case reversal_details[:urgency]
      when :high
        '#e74c3c'  # Red for urgent
      when :medium
        '#e67e22'  # Orange for medium
      else
        '#95a5a6'  # Gray for low urgency
      end

      # Determine icon and title
      reversal_icon = case reversal_details[:reversal_type]
      when :chargeback, :fraud_reversal
        '⚠️'
      when :duplicate
        '🔄'
      else
        '↩️'
      end

      reversal_title = case reversal_details[:reversal_type]
      when :chargeback
        'Donation Chargeback Initiated'
      when :fraud_reversal
        'Donation Reversed - Fraud Review'
      when :bank_reversal
        'Donation Reversed by Bank'
      when :duplicate
        'Duplicate Donation Reversed'
      when :system_correction
        'Donation Reversal - System Correction'
      else
        'Donation Reversed'
      end

      # Build action items based on reversal type
      action_items = []
      if reversal_details[:can_dispute]
        action_items << "If you believe this reversal was made in error, you can file a dispute."
      end
      
      if reversal_details[:reversal_type] == :chargeback
        action_items << "Your bank has initiated a chargeback. Please contact your bank directly for more information."
      end

      if reversal_details[:reversal_type] == :fraud_reversal
        action_items << "We've temporarily reversed this donation while we investigate. We'll notify you of the outcome."
      end

      action_items_html = action_items.map { |item| "<li>#{item}</li>" }.join

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>#{reversal_title}</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{header_color};">
                <h1>#{reversal_icon} #{reversal_title}</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>
                
                <p>We're writing to inform you that your donation has been reversed.</p>

                <div class="investment-details" style="border-left-color: #{header_color};">
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #{header_color}; font-weight: 600;">#{reversal_details[:status]}</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Campaign:</span><span class='detail-value'>#{campaign.title}</span></div>" if campaign}
                  #{"<div class='detail-row'><span class='detail-label'>Amount:</span><span class='detail-value'>#{currency_symbol} #{formatted_amount}</span></div>" if amount}
                  <div class="detail-row">
                    <span class="detail-label">Reversal Type:</span>
                    <span class="detail-value">#{reversal_details[:reversal_type].to_s.humanize}</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Reversal ID:</span><span class='detail-value'>#{reversal_details[:reversal_id]}</span></div>" if reversal_details[:reversal_id]}
                  <div class="detail-row">
                    <span class="detail-label">Original Reference:</span>
                    <span class="detail-value">#{reversal_details[:original_transaction]}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Processed By:</span>
                    <span class="detail-value">#{reversal_details[:processor]}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Processed Date:</span>
                    <span class="detail-value">#{reversal_details[:processed_at].strftime('%B %d, %Y at %H:%M')}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value" style="color: #c0392b;">#{reversal_details[:text]}</span>
                  </div>
                </div>

                <div class="reversal-info">
                  <h3>What This Means</h3>
                  <p>The donation amount has been reversed and credited back to your account. This typically happens when:</p>
                  <ul>
                    <li>Your bank initiates a chargeback</li>
                    <li>A payment is flagged for fraud review</li>
                    <li>A duplicate transaction is detected</li>
                    <li>A system correction is applied</li>
                  </ul>
                  
                  <p><strong>Estimated timeline:</strong> #{reversal_details[:estimated_days]}</p>
                </div>

                #{"<div class='action-items'>
                  <h3>Next Steps</h3>
                  <ul>
                    #{action_items_html}
                  </ul>
                </div>" if action_items.present?}

                <div class="action-section">
                  #{"<a href='#{dispute_url}' class='cta-button' style='background-color: #e67e22;'>File a Dispute</a>" if reversal_details[:can_dispute]}
                  #{"<a href='#{campaign_url}' class='cta-button' style='background-color: #3498db; margin-left: 10px;'>View Campaign</a>" if campaign}
                  <a href='#{support_url}' class='cta-button' style='background-color: #2c3e50; margin-left: 10px;'>Contact Support</a>
                </div>

                <div class="support-section">
                  <p><strong>Need assistance?</strong> Our support team is here to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                  <p>🌐 <a href="#{support_url}">Visit Support Center</a></p>
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

    # Text Content Builder
    def build_text_content(
      campaign:,
      campaign_url:,
      dispute_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      reversal_details:,
      donation:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)

      text = <<~TEXT
        Dear #{recipient_name},

        We're writing to inform you that your donation has been reversed.

        Reversal Details:
        - Status: #{reversal_details[:status]}
        #{campaign ? "- Campaign: #{campaign.title}" : ""}
        #{amount ? "- Amount: #{currency_symbol} #{formatted_amount}" : ""}
        - Reversal Type: #{reversal_details[:reversal_type].to_s.humanize}
        #{reversal_details[:reversal_id] ? "- Reversal ID: #{reversal_details[:reversal_id]}" : ""}
        - Original Reference: #{reversal_details[:original_transaction]}
        - Processed By: #{reversal_details[:processor]}
        - Processed Date: #{reversal_details[:processed_at].strftime('%B %d, %Y at %H:%M')}
        - Reason: #{reversal_details[:text]}

        What This Means:
        The donation amount has been reversed and credited back to your account. This typically happens when:
        - Your bank initiates a chargeback
        - A payment is flagged for fraud review
        - A duplicate transaction is detected
        - A system correction is applied

        Estimated timeline: #{reversal_details[:estimated_days]}
      TEXT

      if reversal_details[:can_dispute]
        text += "\n\nIf you believe this reversal was made in error, you can file a dispute:\n#{dispute_url}"
      end

      if reversal_details[:reversal_type] == :chargeback
        text += "\n\nYour bank has initiated a chargeback. Please contact your bank directly for more information."
      end

      if reversal_details[:reversal_type] == :fraud_reversal
        text += "\n\nWe've temporarily reversed this donation while we investigate. We'll notify you of the outcome."
      end

      text += <<~TEXT

        #{campaign ? "View Campaign: #{campaign_url}" : ""}
        Contact Support: #{support_url}

        Need assistance? Our support team is here to help.
        Email: #{support_email}
        Support Center: #{support_url}

        Best regards,
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
            'X-Mailin-custom' => 'donation_reversal',
            'X-Entity-Ref-ID' => "donation_reversal_#{donation.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'donation_reversal'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent donation reversal email to #{recipient_email} - Donation ID: #{donation.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending donation reversal to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send donation reversal email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(donation, recipient_email, reversal_details)
      log_data = {
        donation_id: donation.id,
        recipient_email: recipient_email,
        sent_at: Time.current.iso8601,
        reversal_type: reversal_details[:reversal_type],
        reversal_reason: reversal_details[:text],
        urgency: reversal_details[:urgency],
        campaign_id: donation.campaign_id
      }
      
      Rails.logger.info "Donation reversal email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if donation.respond_to?(:update) && donation.respond_to?(:reversal_email_sent_at)
        donation.update(
          reversal_email_sent_at: Time.current,
          reversal_type: reversal_details[:reversal_type],
          reversal_reason: reversal_details[:text]
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
          background-color: #95a5a6;
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
          border-left: 4px solid #95a5a6;
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
        .reversal-info {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .reversal-info h3 {
          margin-top: 0;
          color: #7f6000;
        }
        .reversal-info ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .reversal-info li {
          margin-bottom: 5px;
        }
        .action-items {
          background-color: #eaf2f8;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #2980b9;
        }
        .action-items h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .action-items ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .action-items li {
          margin-bottom: 5px;
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
          }
          .content {
            padding: 20px;
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