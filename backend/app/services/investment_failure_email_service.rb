# app/services/investment_failure_email_service.rb
class InvestmentFailureEmailService
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
    def send_failure_email(investment:, recipient_email:, recipient_name:, failure_reason:, metadata: {})
      # Validate investment
      return false unless validate_investment(investment)
      return false unless recipient_email.present?

      campaign = investment.campaign
      amount = investment.amount&.round(2)
      currency_symbol = campaign.currency_symbol || 'GHS'
      
      # Build URLs
      campaign_url = build_campaign_url(campaign, metadata)
      retry_url = build_retry_url(investment, metadata)
      support_url = "#{frontend_url}/support"
      
      # Parse and categorize failure reason
      failure_details = parse_failure_reason(failure_reason, metadata)

      subject = build_subject(failure_details, campaign)

      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        retry_url: retry_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        investment: investment,
        failure_details: failure_details,
        metadata: metadata
      )

      text_content = build_text_content(
        campaign: campaign,
        campaign_url: campaign_url,
        retry_url: retry_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        investment: investment,
        failure_details: failure_details,
        metadata: metadata
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content, investment)

      if result
        log_email_sent(investment, recipient_email, failure_details)
      end

      result
    end

    private

    # Validation Methods
    def validate_investment(investment)
      return false unless investment
      return false unless investment.is_a?(EquityInvestment)
      return false unless investment.campaign
      false
    end

    # URL Builders
    def build_campaign_url(campaign, metadata)
      return metadata[:redirect_url] if metadata[:redirect_url].present?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    def build_retry_url(investment, metadata)
      return metadata[:retry_url] if metadata[:retry_url].present?
      
      if investment.respond_to?(:token) && investment.token.present?
        "#{frontend_url}/investments/retry/#{investment.token}"
      else
        "#{frontend_url}/investments/#{investment.id}/retry"
      end
    end

    # Subject Builder
    def build_subject(failure_details, campaign)
      case failure_details[:category]
      when :payment_declined
        "Payment Declined - Your Investment in #{campaign.company_name}"
      when :insufficient_funds
        "Insufficient Funds - Your Investment in #{campaign.company_name}"
      when :technical_error
        "Technical Issue - Your Investment in #{campaign.company_name}"
      when :expired
        "Investment Expired - #{campaign.company_name}"
      when :fraud_risk
        "Fraud Risk Alert - Your Investment in #{campaign.company_name}"
      else
        "Investment Issue - #{campaign.company_name}"
      end
    end

    # Failure Reason Parser
    def parse_failure_reason(failure_reason, metadata)
      reason_text = failure_reason.to_s
      category = :unknown
      suggestions = []
      is_retryable = true

      # Map common error patterns to categories and suggestions
      if reason_text.match?(/declined|card declined|payment declined|do not honor|not authorized/i)
        category = :payment_declined
        suggestions = [
          "Check that your card details are correct",
          "Contact your bank to authorize the transaction",
          "Try using a different payment method",
          "Verify you have entered the correct CVV code"
        ]
        is_retryable = true
      elsif reason_text.match?(/insufficient funds|not enough funds|balance|over limit/i)
        category = :insufficient_funds
        suggestions = [
          "Ensure you have sufficient funds in your account",
          "Try a lower investment amount",
          "Use a different payment method with available funds",
          "Contact your bank to increase your transaction limit"
        ]
        is_retryable = true
      elsif reason_text.match?(/expired|timeout|timed out|too slow|session expired/i)
        category = :expired
        suggestions = [
          "Try the investment again with a faster connection",
          "Complete the investment form more quickly",
          "Try using a different browser or device",
          "Restart the investment process"
        ]
        is_retryable = true
      elsif reason_text.match?(/technical|error|server|connection|gateway|unavailable|down/i)
        category = :technical_error
        suggestions = [
          "Our team has been notified and is working on the issue",
          "Please try again in a few minutes",
          "If the problem persists, contact our support team",
          "Try using a different network connection"
        ]
        is_retryable = true
      elsif reason_text.match?(/fraud|suspicious|risk|high risk|flagged|blocked/i)
        category = :fraud_risk
        suggestions = [
          "The transaction was flagged for security reasons",
          "Please verify your identity to continue",
          "Contact our support team for assistance",
          "Your bank may have blocked the transaction"
        ]
        is_retryable = false
      elsif reason_text.match?(/invalid|cvv|cvc|security code|expiry date|expired card|wrong card/i)
        category = :invalid_details
        suggestions = [
          "Verify your card number is correct",
          "Check the expiry date is valid (not expired)",
          "Ensure the CVV/CVC code is correct",
          "Try using a different card"
        ]
        is_retryable = true
      else
        suggestions = [
          "Please check your payment details and try again",
          "Contact our support team if you need assistance"
        ]
        is_retryable = true
      end

      # Add gateway-specific error code if available
      error_code = metadata[:error_code] || metadata[:gateway_code] || metadata[:status_code]
      
      {
        text: reason_text,
        category: category,
        suggestions: suggestions,
        is_retryable: is_retryable,
        error_code: error_code,
        gateway: metadata[:gateway] || metadata[:payment_gateway] || 'N/A',
        attempt_number: metadata[:attempt_number] || 1,
        should_contact_bank: category.in?([:payment_declined, :insufficient_funds])
      }
    end

    # HTML Content Builder
    def build_html_content(
      campaign:,
      campaign_url:,
      retry_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      investment:,
      failure_details:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      suggestions_html = failure_details[:suggestions].map { |s| "<li>#{s}</li>" }.join

      # Determine header color based on failure category
      header_color = case failure_details[:category]
      when :fraud_risk
        '#e74c3c'  # Red for fraud
      when :technical_error
        '#f39c12'  # Yellow/Orange for technical issues
      when :expired
        '#e67e22'  # Orange for expired
      when :insufficient_funds
        '#e67e22'  # Orange for funds
      else
        '#c0392b'  # Dark red for payment failures
      end

      # Determine if fraud related
      is_fraud = failure_details[:category] == :fraud_risk

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Payment Issue</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{header_color};">
                <h1>#{is_fraud ? '⚠️ Investment Suspended' : '💳 Payment Issue'}</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>
                
                <p>We encountered an issue processing your investment in <strong>#{campaign.company_name}</strong>.</p>

                <div class="failure-notice" style="background-color: #{is_fraud ? '#fdedec' : '#fff3cd'};">
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="font-weight: 600; color: #{header_color};">Failed</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value" style="color: #c0392b;">#{failure_details[:text]}</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>Error Code:</span>
                    <span class='detail-value'>#{failure_details[:error_code]}</span>
                  </div>" if failure_details[:error_code]}
                  #{"<div class='detail-row'>
                    <span class='detail-label'>Attempt:</span>
                    <span class='detail-value'>##{failure_details[:attempt_number]}</span>
                  </div>"}
                </div>

                <div class="investment-details" style="border-left-color: #{header_color};">
                  <div class="detail-row highlight">
                    <span class="detail-label">💰 Investment Amount:</span>
                    <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #2c3e50;">#{currency_symbol} #{formatted_amount}</span>
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
                    <span class="detail-label">📅 Attempt Date:</span>
                    <span class="detail-value">#{investment.created_at.strftime('%B %d, %Y at %H:%M')}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🔑 Reference:</span>
                    <span class="detail-value">#{investment.transaction_reference || investment.id || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💳 Gateway:</span>
                    <span class="detail-value">#{failure_details[:gateway]}</span>
                  </div>
                </div>

                <div class="suggestions-section">
                  <h3>What You Can Do:</h3>
                  <ul>
                    #{suggestions_html}
                  </ul>
                </div>

                #{"<div class='bank-contact'>
                  <h3>🏦 Contact Your Bank</h3>
                  <p>This transaction may have been blocked by your bank. Please contact them and authorize the payment.</p>
                  <p><strong>Your bank may need:</strong></p>
                  <ul>
                    <li>The transaction amount: #{currency_symbol} #{formatted_amount}</li>
                    <li>The merchant: Bantuhive Ltd</li>
                    <li>The reference: #{investment.transaction_reference || investment.id}</li>
                  </ul>
                </div>" if failure_details[:should_contact_bank]}

                <div class="action-section">
                  #{"<a href='#{retry_url}' class='cta-button' style='background-color: #27ae60;'>🔄 Retry Investment</a>" if failure_details[:is_retryable]}
                  <a href='#{campaign_url}' class='cta-button' style='background-color: #3498db;'>📱 View Campaign</a>
                  <a href='#{support_url}' class='cta-button' style='background-color: #2c3e50;'>💬 Contact Support</a>
                </div>

                <div class="support-section">
                  <p><strong>Need immediate assistance?</strong> Our investment team is ready to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                  <p>🌐 <a href="#{support_url}">Visit Support Center</a></p>
                </div>

                #{"<div class='security-notice'>
                  <p><strong>🔒 Security Notice:</strong> This transaction was flagged for review. Please verify your identity to proceed.</p>
                </div>" if is_fraud}

                <p>We're here to help you complete your investment!<br>
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
      retry_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      investment:,
      failure_details:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      suggestions_text = failure_details[:suggestions].map { |s| "  - #{s}" }.join("\n")
      is_fraud = failure_details[:category] == :fraud_risk

      text = <<~TEXT
        Dear #{recipient_name},

        We encountered an issue processing your investment in #{campaign.company_name}.

        Status: Failed
        Reason: #{failure_details[:text]}
        #{failure_details[:error_code] ? "Error Code: #{failure_details[:error_code]}" : ""}
        Attempt: ##{failure_details[:attempt_number]}

        Investment Details:
        - Amount: #{currency_symbol} #{formatted_amount}
        - Company: #{campaign.company_name}
        - Campaign: #{campaign.title}
        - Attempt Date: #{investment.created_at.strftime('%B %d, %Y at %H:%M')}
        - Reference: #{investment.transaction_reference || investment.id || 'N/A'}
        - Gateway: #{failure_details[:gateway]}

        What You Can Do:
        #{suggestions_text}
      TEXT

      if failure_details[:should_contact_bank]
        text += <<~TEXT

          Contact Your Bank:
          This transaction may have been blocked by your bank. Please contact them and authorize the payment.
          
          Your bank may need:
          - The transaction amount: #{currency_symbol} #{formatted_amount}
          - The merchant: Bantuhive Ltd
          - The reference: #{investment.transaction_reference || investment.id}
        TEXT
      end

      text += <<~TEXT

        Action Items:
        #{failure_details[:is_retryable] ? "Retry Investment: #{retry_url}" : "Please contact support to resolve this issue"}
        View Campaign: #{campaign_url}
        Contact Support: #{support_url}

        Need immediate assistance? Our investment team is ready to help.
        Email: #{support_email}
        Support Center: #{support_url}
      TEXT

      if is_fraud
        text += "\n\nSecurity Notice: This transaction was flagged for review. Please verify your identity to proceed."
      end

      text += <<~TEXT

        We're here to help you complete your investment!
        #{sender_name}

        You are receiving this email because you attempted to make an investment through Bantuhive.

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
            'X-Mailin-custom' => 'investment_failure',
            'X-Entity-Ref-ID' => "investment_failure_#{investment.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'investment_failure'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent investment failure email to #{recipient_email} - Investment ID: #{investment.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending investment failure to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send investment failure email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(investment, recipient_email, failure_details)
      log_data = {
        investment_id: investment.id,
        recipient_email: recipient_email,
        amount: investment.amount,
        failure_category: failure_details[:category],
        failure_reason: failure_details[:text],
        campaign_id: investment.campaign_id,
        sent_at: Time.current.iso8601
      }
      
      Rails.logger.info "Investment failure email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if investment.respond_to?(:update) && investment.respond_to?(:failure_email_sent_at)
        investment.update(
          failure_email_sent_at: Time.current,
          last_failure_reason: failure_details[:text],
          failure_category: failure_details[:category]
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
          background-color: #c0392b;
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
        .failure-notice {
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
        }
        .investment-details {
          background-color: #fef2f2;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #c0392b;
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
        .suggestions-section {
          background-color: #eaf2f8;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .suggestions-section h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .suggestions-section ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .suggestions-section li {
          margin-bottom: 5px;
        }
        .bank-contact {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .bank-contact h3 {
          margin-top: 0;
          color: #7f6000;
        }
        .bank-contact ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .bank-contact li {
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
        .security-notice {
          background-color: #fdedec;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #e74c3c;
          text-align: center;
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
          <p>You are receiving this email because you attempted to make an investment through Bantuhive.</p>
          
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