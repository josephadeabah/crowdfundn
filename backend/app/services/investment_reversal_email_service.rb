# app/services/investment_reversal_email_service.rb
class InvestmentReversalEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Investments Support')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    # Main Method
    def send_reversal_email(investment:, recipient_email:, recipient_name:, reversal_reason:, metadata: {})
      # Validate investment
      return false unless validate_investment(investment)
      return false unless recipient_email.present?

      campaign = investment.campaign
      amount = investment.amount&.round(2)
      currency_symbol = campaign.currency_symbol || 'GHS'
      
      # Extract investment details
      investment_date = investment.created_at.strftime('%B %d, %Y')
      reversal_date = Time.current.strftime('%B %d, %Y')
      
      # Build URLs
      campaign_url = build_campaign_url(campaign, metadata)
      dispute_url = build_dispute_url(investment, metadata)
      support_url = "#{frontend_url}/support"
      
      # Parse and categorize reversal reason
      reversal_details = parse_reversal_reason(reversal_reason, metadata)

      subject = build_subject(reversal_details, campaign)

      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        dispute_url: dispute_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        investment_date: investment_date,
        reversal_date: reversal_date,
        investment: investment,
        reversal_details: reversal_details,
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
        investment_date: investment_date,
        reversal_date: reversal_date,
        investment: investment,
        reversal_details: reversal_details,
        metadata: metadata
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content, investment)

      if result
        log_email_sent(investment, recipient_email, reversal_details)
      end

      result
    end

    private

    # Validation Methods
    def validate_investment(investment)
      return false unless investment
      return false unless investment.is_a?(EquityInvestment)
      return false unless investment.campaign
      return false unless investment.campaign.present?
      true
    end

    # URL Builders
    def build_campaign_url(campaign, metadata)
      return metadata[:redirect_url] if metadata[:redirect_url].present?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    def build_dispute_url(investment, metadata)
      return metadata[:dispute_url] if metadata[:dispute_url].present?
      "#{frontend_url}/investments/#{investment.id}/dispute"
    end

    # Subject Builder
    def build_subject(reversal_details, campaign)
      case reversal_details[:category]
      when :chargeback
        "Chargeback Initiated - Your Investment in #{campaign.company_name}"
      when :fraud_reversal
        "Fraud Reversal - Your Investment in #{campaign.company_name}"
      when :bank_reversal
        "Bank Reversal - Your Investment in #{campaign.company_name}"
      when :system_correction
        "System Correction - Your Investment in #{campaign.company_name}"
      when :cancellation
        "Investment Cancelled - #{campaign.company_name}"
      else
        "Investment Reversed - #{campaign.company_name}"
      end
    end

    # Reversal Reason Parser
    def parse_reversal_reason(reversal_reason, metadata)
      reason_text = reversal_reason.to_s
      category = :unknown
      can_dispute = true
      estimated_days = "5-7 business days"

      if reason_text.match?(/chargeback|dispute|unauthorized|fraud|stolen/i)
        category = :chargeback
        can_dispute = true
        estimated_days = "30-45 days (pending bank investigation)"
      elsif reason_text.match?(/fraud|suspicious|risk|high risk|fraudulent|blocked/i)
        category = :fraud_reversal
        can_dispute = true
        estimated_days = "3-5 business days (under review)"
      elsif reason_text.match?(/bank reversal|bank return|bank declined|reversed by bank|insufficient funds/i)
        category = :bank_reversal
        can_dispute = false
        estimated_days = "5-7 business days"
      elsif reason_text.match?(/correction|adjustment|system|technical|error|bug|duplicate/i)
        category = :system_correction
        can_dispute = false
        estimated_days = "3-5 business days"
      elsif reason_text.match?(/cancelled|cancel|withdrawn|withdrew/i)
        category = :cancellation
        can_dispute = true
        estimated_days = "3-5 business days"
      else
        can_dispute = true
        estimated_days = "5-7 business days"
      end

      # Get reversal ID if available
      reversal_id = metadata[:reversal_id] || metadata[:transaction_id]
      
      {
        text: reason_text,
        category: category,
        can_dispute: can_dispute,
        estimated_days: estimated_days,
        reversal_id: reversal_id,
        processor: metadata[:processor] || metadata[:gateway] || 'Payment Processor',
        processed_at: metadata[:processed_at] || Time.current,
        status: metadata[:status] || 'Processing'
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
      investment_date:,
      reversal_date:,
      investment:,
      reversal_details:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      
      # Determine header color based on reversal category
      header_color = case reversal_details[:category]
      when :chargeback, :fraud_reversal
        '#e74c3c'  # Red for fraud/chargeback
      when :cancellation
        '#e67e22'  # Orange for cancellation
      else
        '#95a5a6'  # Gray for other
      end

      # Determine icon
      icon = case reversal_details[:category]
      when :chargeback, :fraud_reversal
        '⚠️'
      when :cancellation
        '↩️'
      else
        '🔄'
      end

      title = case reversal_details[:category]
      when :chargeback
        'Investment Chargeback Initiated'
      when :fraud_reversal
        'Investment Reversed - Fraud Review'
      when :bank_reversal
        'Investment Reversed by Bank'
      when :cancellation
        'Investment Cancelled'
      when :system_correction
        'Investment Reversal - System Correction'
      else
        'Investment Reversal Notice'
      end

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>#{title}</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{header_color};">
                <h1>#{icon} #{title}</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>
                
                <p>We're writing to inform you about a reversal of your investment in <strong>#{campaign.company_name}</strong>.</p>

                <div class="reversal-notice" style="background-color: #{reversal_details[:category] == :chargeback || reversal_details[:category] == :fraud_reversal ? '#fdedec' : '#fff3cd'};">
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="font-weight: 600; color: #{header_color};">Transaction Reversed</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Reversal Date:</span>
                    <span class="detail-value">#{reversal_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Reversal Type:</span>
                    <span class="detail-value">#{reversal_details[:category].to_s.humanize}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value" style="color: #c0392b;">#{reversal_details[:text]}</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>Reversal ID:</span>
                    <span class='detail-value'>#{reversal_details[:reversal_id]}</span>
                  </div>" if reversal_details[:reversal_id]}
                </div>

                <div class="investment-details" style="border-left-color: #{header_color};">
                  <div class="detail-row highlight">
                    <span class="detail-label">💰 Investment Amount:</span>
                    <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #2c3e50;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🔄 Refund Amount:</span>
                    <span class="detail-value" style="font-weight: bold; color: #27ae60;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🏢 Company:</span>
                    <span class="detail-value">#{campaign.company_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign.title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Original Investment Date:</span>
                    <span class="detail-value">#{investment_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🔑 Certificate Number:</span>
                    <span class="detail-value">#{investment.certificate_number || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💳 Processor:</span>
                    <span class="detail-value">#{reversal_details[:processor]}</span>
                  </div>
                </div>

                <div class="refund-info">
                  <h3 style="margin-top: 0; color: #2c3e50;">💳 Refund Processing</h3>
                  <p>Your investment amount of <strong>#{currency_symbol} #{formatted_amount}</strong> has been refunded.</p>
                  
                  <div class="timeline">
                    <p><strong>Refund Timeline:</strong></p>
                    <ul>
                      <li>✅ Refund initiated: #{reversal_date}</li>
                      <li>⏳ Bank processing: #{reversal_details[:estimated_days]}</li>
                      <li>📤 Reflect in your account: Within 10 business days</li>
                    </ul>
                  </div>
                  
                  <p>If you don't see the refund in your account after 10 business days, please contact your bank first, then our support team.</p>
                </div>

                #{"<div class='dispute-section'>
                  <h3>⚖️ Dispute This Reversal</h3>
                  <p>If you believe this reversal was made in error, you have the right to dispute it.</p>
                  <p><strong>To file a dispute:</strong></p>
                  <ol>
                    <li>Gather any supporting documentation</li>
                    <li>Provide details about why you believe the reversal was incorrect</li>
                    <li>Submit your dispute for review</li>
                  </ol>
                  <p>Please note: Disputes are reviewed within 5-7 business days.</p>
                </div>" if reversal_details[:can_dispute]}

                <div class="action-section">
                  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    #{"<a href='#{dispute_url}' class='cta-button' style='background-color: #e67e22;'>⚖️ File a Dispute</a>" if reversal_details[:can_dispute]}
                    <a href='#{campaign_url}' class='cta-button' style='background-color: #3498db;'>📱 View Campaign</a>
                    <a href='#{support_url}' class='cta-button' style='background-color: #2c3e50;'>💬 Contact Support</a>
                  </div>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your reversal or refund?</strong> Our support team is here to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                  <p>🌐 <a href="#{support_url}">Visit Support Center</a></p>
                </div>

                <p>We apologize for any inconvenience this may have caused.<br>
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
      investment_date:,
      reversal_date:,
      investment:,
      reversal_details:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)

      text = <<~TEXT
        Dear #{recipient_name},

        We're writing to inform you about a reversal of your investment in #{campaign.company_name}.

        Status: Transaction Reversed
        Reversal Date: #{reversal_date}
        Reversal Type: #{reversal_details[:category].to_s.humanize}
        Reason: #{reversal_details[:text]}
        #{reversal_details[:reversal_id] ? "Reversal ID: #{reversal_details[:reversal_id]}" : ""}

        Investment Details:
        - Investment Amount: #{currency_symbol} #{formatted_amount}
        - Refund Amount: #{currency_symbol} #{formatted_amount}
        - Company: #{campaign.company_name}
        - Campaign: #{campaign.title}
        - Original Investment Date: #{investment_date}
        - Certificate Number: #{investment.certificate_number || 'N/A'}
        - Processor: #{reversal_details[:processor]}

        REFUND PROCESSING

        Your investment amount of #{currency_symbol} #{formatted_amount} has been refunded.

        Refund Timeline:
        ✅ Refund initiated: #{reversal_date}
        ⏳ Bank processing: #{reversal_details[:estimated_days]}
        📤 Reflect in your account: Within 10 business days

        If you don't see the refund in your account after 10 business days, please contact your bank first, then our support team.
      TEXT

      if reversal_details[:can_dispute]
        text += <<~TEXT

          DISPUTE THIS REVERSAL

          If you believe this reversal was made in error, you have the right to dispute it.

          To file a dispute:
          1. Gather any supporting documentation
          2. Provide details about why you believe the reversal was incorrect
          3. Submit your dispute for review

          Please note: Disputes are reviewed within 5-7 business days.

          File a dispute: #{dispute_url}
        TEXT
      end

      text += <<~TEXT

        Action Items:
        View Campaign: #{campaign_url}
        Contact Support: #{support_url}

        Questions about your reversal or refund? Our support team is here to help.
        Email: #{support_email}
        Support Center: #{support_url}

        We apologize for any inconvenience this may have caused.
        #{sender_name}

        You are receiving this email because your investment was reversed through Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email, recipient_name, subject, html_content, text_content, investment)
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
            'X-Mailin-custom' => 'investment_reversal',
            'X-Entity-Ref-ID' => "investment_reversal_#{investment.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'investment_reversal'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent investment reversal email to #{recipient_email} - Investment ID: #{investment.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending investment reversal to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send investment reversal email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(investment, recipient_email, reversal_details)
      log_data = {
        investment_id: investment.id,
        recipient_email: recipient_email,
        amount: investment.amount,
        reversal_category: reversal_details[:category],
        reversal_reason: reversal_details[:text],
        campaign_id: investment.campaign_id,
        sent_at: Time.current.iso8601
      }
      
      Rails.logger.info "Investment reversal email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if investment.respond_to?(:update) && investment.respond_to?(:reversal_email_sent_at)
        investment.update(
          reversal_email_sent_at: Time.current,
          reversal_reason: reversal_details[:text],
          reversal_category: reversal_details[:category]
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
        .reversal-notice {
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
        }
        .investment-details {
          background-color: #feefef;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #e74c3c;
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
          width: 180px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .refund-info {
          background-color: #e8f4fd;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .refund-info h3 {
          margin-top: 0;
        }
        .timeline {
          background-color: white;
          border-radius: 4px;
          padding: 15px;
          margin: 10px 0;
        }
        .timeline ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .timeline li {
          margin-bottom: 5px;
        }
        .dispute-section {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .dispute-section h3 {
          margin-top: 0;
          color: #7f6000;
        }
        .dispute-section ol {
          padding-left: 20px;
          margin: 10px 0;
        }
        .dispute-section li {
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
            font-size: 20px;
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
          <p>You are receiving this email because your investment was reversed through Bantuhive.</p>
          
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