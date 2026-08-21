# app/services/investment_oversubscription_email_service.rb
class InvestmentOversubscriptionEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Investments')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    # Main Method
    def send_oversubscription_email(investment:, recipient_email:, recipient_name:, metadata: {})
      # Validate investment
      return false unless validate_investment(investment)
      return false unless recipient_email.present?

      campaign = investment.campaign
      amount = investment.amount&.round(2)
      currency_symbol = campaign.currency_symbol || 'GHS'
      
      # Extract investment details
      shares = investment.shares&.round(4) || 0
      percentage = investment.percentage&.round(4) || 0
      investment_date = investment.created_at.strftime('%B %d, %Y')
      
      # Extract refund information
      refund_reference = investment.metadata&.dig('refund_reference') || 
                        metadata[:refund_reference] || 
                        "REF-#{investment.id}-#{Time.current.strftime('%Y%m')}"
      
      # Build URLs
      campaign_url = build_campaign_url(campaign, metadata)
      investments_url = build_investments_url(metadata)
      waitlist_url = build_waitlist_url(campaign, metadata)
      support_url = "#{frontend_url}/support"

      subject = build_subject(campaign)

      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        investments_url: investments_url,
        waitlist_url: waitlist_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        shares: shares,
        percentage: percentage,
        investment_date: investment_date,
        refund_reference: refund_reference,
        investment: investment,
        metadata: metadata
      )

      text_content = build_text_content(
        campaign: campaign,
        campaign_url: campaign_url,
        investments_url: investments_url,
        waitlist_url: waitlist_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        shares: shares,
        percentage: percentage,
        investment_date: investment_date,
        refund_reference: refund_reference,
        investment: investment,
        metadata: metadata
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content, investment)

      if result
        log_email_sent(investment, recipient_email)
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

    def build_investments_url(metadata)
      return metadata[:investments_url] if metadata[:investments_url].present?
      "#{frontend_url}/invest"
    end

    def build_waitlist_url(campaign, metadata)
      return metadata[:waitlist_url] if metadata[:waitlist_url].present?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}/waitlist"
    end

    # Subject Builder
    def build_subject(campaign)
      "Investment Update - #{campaign.company_name} (Oversubscribed)"
    end

    # HTML Content Builder
    def build_html_content(
      campaign:,
      campaign_url:,
      investments_url:,
      waitlist_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      shares:,
      percentage:,
      investment_date:,
      refund_reference:,
      investment:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      formatted_shares = number_with_delimiter(shares)
      formatted_percentage = percentage.to_s
      
      # Check if similar campaigns exist
      similar_campaigns = fetch_similar_campaigns(campaign)
      has_alternatives = similar_campaigns.any?

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Oversubscription Notice</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e67e22;">
                <h1>📊 Investment Update</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>
                
                <p>We regret to inform you that your investment in <strong>#{campaign.company_name}</strong> could not be completed due to oversubscription.</p>

                <div class="oversubscription-notice">
                  <p><strong>What happened?</strong></p>
                  <p>The campaign reached its maximum equity offering before your investment could be processed. This is a common occurrence for popular investment opportunities.</p>
                </div>

                <div class="investment-details">
                  <h3 style="margin-top: 0; color: #e67e22;">📋 Your Investment Request</h3>
                  <div class="detail-row highlight">
                    <span class="detail-label">💰 Investment Amount:</span>
                    <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #e67e22;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Shares Requested:</span>
                    <span class="detail-value">#{formatted_shares} shares</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📈 Ownership Percentage:</span>
                    <span class="detail-value">#{formatted_percentage}%</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🏢 Company:</span>
                    <span class="detail-value">#{campaign.company_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Investment Date:</span>
                    <span class="detail-value">#{investment_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign.title}</span>
                  </div>
                </div>

                <div class="refund-info">
                  <h3 style="margin-top: 0; color: #27ae60;">💳 Refund Information</h3>
                  <p>A full refund of <strong>#{currency_symbol} #{formatted_amount}</strong> will be processed to your original payment method within <strong>5-7 business days</strong>.</p>
                  <p>Your refund reference number is: <strong>#{refund_reference}</strong></p>
                  <p class="refund-timeline">📅 Refund expected: <strong>#{(Date.current + 7.business_days).strftime('%B %d, %Y')}</strong></p>
                </div>

                #{"<div class='alternatives-section'>
                  <h3>💡 Explore Other Investment Opportunities</h3>
                  <p>We have other exciting investment opportunities that might interest you:</p>
                  <div class='alternatives-grid'>
                    #{similar_campaigns.map do |alt_campaign|
                      "<div class='alternative-card'>
                        <h4>#{alt_campaign.company_name}</h4>
                        <p>#{alt_campaign.title}</p>
                        <p><strong>#{alt_campaign.currency_symbol}#{number_with_delimiter(alt_campaign.min_investment)}</strong> minimum</p>
                        <a href='#{frontend_url}/campaigns/#{alt_campaign.slug || alt_campaign.id}' class='small-button'>View Opportunity</a>
                      </div>"
                    end.join}
                  </div>
                </div>" if has_alternatives}

                <div class="waitlist-section">
                  <h3>📌 Join the Waitlist</h3>
                  <p>This campaign may have future investment rounds. Join the waitlist to be notified:</p>
                  <div class="action-section">
                    <a href="#{waitlist_url}" class="cta-button" style="background-color: #3498db;">📝 Join Waitlist</a>
                  </div>
                </div>

                <div class="action-section">
                  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    <a href="#{investments_url}" class="cta-button" style="background-color: #27ae60;">🔍 Browse Investments</a>
                    <a href="#{campaign_url}" class="cta-button" style="background-color: #2c3e50;">📱 View Campaign</a>
                    <a href="#{support_url}" class="cta-button" style="background-color: #3498db;">💬 Contact Support</a>
                  </div>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your refund or need assistance?</strong> Our investment team is here to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                  <p>🌐 <a href="#{support_url}">Visit Support Center</a></p>
                </div>

                <p>We appreciate your understanding and hope to serve you better in the future.<br>
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
      investments_url:,
      waitlist_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      shares:,
      percentage:,
      investment_date:,
      refund_reference:,
      investment:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      formatted_shares = number_with_delimiter(shares)
      formatted_percentage = percentage.to_s

      text = <<~TEXT
        Investment Oversubscription Notice - #{campaign.company_name}

        Dear #{recipient_name},

        We regret to inform you that your investment in #{campaign.company_name} 
        could not be completed due to oversubscription.

        What happened?
        The campaign reached its maximum equity offering before your investment 
        could be processed. This is a common occurrence for popular investment 
        opportunities.

        Your Investment Request:
        - Amount: #{currency_symbol} #{formatted_amount}
        - Shares: #{formatted_shares}
        - Ownership: #{formatted_percentage}%
        - Company: #{campaign.company_name}
        - Date: #{investment_date}
        - Campaign: #{campaign.title}

        REFUND INFORMATION:
        A full refund of #{currency_symbol} #{formatted_amount} will be processed to your 
        original payment method within 5-7 business days.

        Refund Reference: #{refund_reference}
        Refund Expected: #{(Date.current + 7.business_days).strftime('%B %d, %Y')}

        What's Next?
        - Browse other investment opportunities: #{investments_url}
        - Join the waitlist for future rounds: #{waitlist_url}
        - View campaign details: #{campaign_url}
        - Contact support: #{support_url}

        Questions about your refund or need assistance? Contact our investment team:
        Email: #{support_email}

        We appreciate your understanding and hope to serve you better in the future.
        #{sender_name}

        You are receiving this email because you attempted an investment through Bantuhive.

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
            'X-Mailin-custom' => 'investment_oversubscription',
            'X-Entity-Ref-ID' => "investment_oversubscription_#{investment.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'investment_oversubscription'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent oversubscription email to #{recipient_email} - Investment ID: #{investment.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending oversubscription to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send oversubscription email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def fetch_similar_campaigns(campaign)
      # Find other campaigns in similar categories or industries
      return [] unless campaign.respond_to?(:industry) || campaign.respond_to?(:category)
      
      scope = EquityCampaign.where.not(id: campaign.id)
                            .where(status: 'active')
                            .where('funding_end_date > ?', Time.current)
      
      if campaign.respond_to?(:industry) && campaign.industry.present?
        scope = scope.where(industry: campaign.industry)
      elsif campaign.respond_to?(:category) && campaign.category.present?
        scope = scope.where(category: campaign.category)
      end
      
      scope.limit(3).to_a
    rescue => e
      Rails.logger.warn "Could not fetch similar campaigns: #{e.message}"
      []
    end

    def log_email_sent(investment, recipient_email)
      log_data = {
        investment_id: investment.id,
        recipient_email: recipient_email,
        amount: investment.amount,
        campaign_id: investment.campaign_id,
        sent_at: Time.current.iso8601
      }
      
      Rails.logger.info "Investment oversubscription email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if investment.respond_to?(:update) && investment.respond_to?(:oversubscription_email_sent_at)
        investment.update(oversubscription_email_sent_at: Time.current)
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

    # Business Days Helper
    def business_days(days)
      date = Date.current
      days.times do
        date += 1
        date += 1 while date.saturday? || date.sunday?
      end
      date
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
          background-color: #e67e22;
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
        .oversubscription-notice {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .investment-details {
          background-color: #fef5f5;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #e67e22;
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
          background-color: #e8f5e8;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #27ae60;
        }
        .refund-timeline {
          margin-top: 10px;
          padding: 10px;
          background-color: white;
          border-radius: 4px;
        }
        .alternatives-section {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .alternatives-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 10px 0;
        }
        .alternative-card {
          flex: 1 1 calc(50% - 5px);
          background: white;
          border-radius: 6px;
          padding: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          min-width: 150px;
        }
        .alternative-card h4 {
          margin: 0 0 5px 0;
          color: #2c3e50;
        }
        .alternative-card p {
          margin: 5px 0;
          font-size: 13px;
          color: #666;
        }
        .small-button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 6px 12px;
          text-decoration: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 5px;
        }
        .small-button:hover {
          opacity: 0.9;
        }
        .waitlist-section {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
          text-align: center;
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
          .alternative-card {
            flex: 1 1 100%;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you attempted an investment through Bantuhive.</p>
          
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