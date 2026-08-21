# app/services/transfer_notification_email_service.rb
class TransferNotificationEmailService
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

    # Main Method
    def send_notification_email(transfer)
      return false unless validate_transfer(transfer)

      user_name = transfer.user_name || 'Valued User'
      email = transfer.email
      campaign_name = transfer.campaign&.title || 'Your campaign'
      transaction_reference = transfer.reference || "TRF-#{transfer.id}-#{Time.current.strftime('%Y%m%d')}"
      transaction_amount = transfer.amount.to_f
      transaction_date = format_date(transfer.completed_at)
      created_date = format_date(transfer.created_at)
      currency_symbol = transfer.currency || 'GHS'
      status = transfer.status.to_s

      # Build subject and body based on status
      result = case status
      when 'success'
        send_success_email(
          user_name: user_name,
          email: email,
          campaign_name: campaign_name,
          transaction_reference: transaction_reference,
          transaction_amount: transaction_amount,
          transaction_date: transaction_date,
          currency_symbol: currency_symbol,
          transfer: transfer
        )
      when 'reversed'
        send_reversed_email(
          user_name: user_name,
          email: email,
          campaign_name: campaign_name,
          transaction_reference: transaction_reference,
          transaction_amount: transaction_amount,
          transaction_date: transaction_date,
          currency_symbol: currency_symbol,
          transfer: transfer
        )
      when 'failed'
        send_failed_email(
          user_name: user_name,
          email: email,
          campaign_name: campaign_name,
          transaction_reference: transaction_reference,
          transaction_amount: transaction_amount,
          transaction_date: transaction_date,
          currency_symbol: currency_symbol,
          transfer: transfer
        )
      when 'pending'
        send_pending_email(
          user_name: user_name,
          email: email,
          campaign_name: campaign_name,
          transaction_reference: transaction_reference,
          transaction_amount: transaction_amount,
          created_date: created_date,
          currency_symbol: currency_symbol,
          transfer: transfer
        )
      else
        Rails.logger.warn "Unknown transfer status: #{status} for transfer #{transfer.id}"
        false
      end

      result
    end

    private

    # Validation Methods
    def validate_transfer(transfer)
      return false unless transfer
      return false unless transfer.respond_to?(:email)
      return false unless transfer.email.present?
      return false unless transfer.respond_to?(:amount)
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

    def number_with_delimiter(number)
      return '0' if number.nil?
      
      parts = number.to_s.split('.')
      parts[0] = parts[0].reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
      parts.join('.')
    rescue => e
      number.to_s
    end

    def get_status_color(status)
      case status.to_s
      when 'success'
        '#27ae60'  # Green
      when 'pending'
        '#f39c12'  # Orange
      when 'reversed', 'failed'
        '#e74c3c'  # Red
      else
        '#3498db'  # Blue
      end
    end

    def get_status_icon(status)
      case status.to_s
      when 'success'
        '✅'
      when 'pending'
        '⏳'
      when 'reversed'
        '🔄'
      when 'failed'
        '❌'
      else
        '📋'
      end
    end

    def get_status_label(status)
      case status.to_s
      when 'success'
        'Completed Successfully'
      when 'pending'
        'Processing'
      when 'reversed'
        'Reversed'
      when 'failed'
        'Failed'
      else
        status.to_s.humanize
      end
    end

    # Email Sending Methods
    def send_success_email(user_name:, email:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      formatted_amount = number_with_delimiter(transaction_amount)
      subject = "✅ Your transfer of #{currency_symbol} #{formatted_amount} was successful!"

      html_content = build_success_html(
        user_name: user_name,
        campaign_name: campaign_name,
        transaction_reference: transaction_reference,
        transaction_amount: formatted_amount,
        transaction_date: transaction_date,
        currency_symbol: currency_symbol,
        transfer: transfer
      )

      text_content = build_success_text(
        user_name: user_name,
        campaign_name: campaign_name,
        transaction_reference: transaction_reference,
        transaction_amount: formatted_amount,
        transaction_date: transaction_date,
        currency_symbol: currency_symbol,
        transfer: transfer
      )

      send_email(
        recipient_email: email,
        recipient_name: user_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'transfer_success',
        transfer: transfer
      )
    end

    def send_reversed_email(user_name:, email:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      formatted_amount = number_with_delimiter(transaction_amount)
      subject = "🔄 Your transfer of #{currency_symbol} #{formatted_amount} has been reversed"

      html_content = build_reversed_html(
        user_name: user_name,
        campaign_name: campaign_name,
        transaction_reference: transaction_reference,
        transaction_amount: formatted_amount,
        transaction_date: transaction_date,
        currency_symbol: currency_symbol,
        transfer: transfer
      )

      text_content = build_reversed_text(
        user_name: user_name,
        campaign_name: campaign_name,
        transaction_reference: transaction_reference,
        transaction_amount: formatted_amount,
        transaction_date: transaction_date,
        currency_symbol: currency_symbol,
        transfer: transfer
      )

      send_email(
        recipient_email: email,
        recipient_name: user_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'transfer_reversed',
        transfer: transfer
      )
    end

    def send_failed_email(user_name:, email:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      formatted_amount = number_with_delimiter(transaction_amount)
      subject = "❌ Your transfer of #{currency_symbol} #{formatted_amount} has failed"

      html_content = build_failed_html(
        user_name: user_name,
        campaign_name: campaign_name,
        transaction_reference: transaction_reference,
        transaction_amount: formatted_amount,
        transaction_date: transaction_date,
        currency_symbol: currency_symbol,
        transfer: transfer
      )

      text_content = build_failed_text(
        user_name: user_name,
        campaign_name: campaign_name,
        transaction_reference: transaction_reference,
        transaction_amount: formatted_amount,
        transaction_date: transaction_date,
        currency_symbol: currency_symbol,
        transfer: transfer
      )

      send_email(
        recipient_email: email,
        recipient_name: user_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'transfer_failed',
        transfer: transfer
      )
    end

    def send_pending_email(user_name:, email:, campaign_name:, transaction_reference:, transaction_amount:, created_date:, currency_symbol:, transfer:)
      formatted_amount = number_with_delimiter(transaction_amount)
      subject = "⏳ Your transfer of #{currency_symbol} #{formatted_amount} is being processed"

      html_content = build_pending_html(
        user_name: user_name,
        campaign_name: campaign_name,
        transaction_reference: transaction_reference,
        transaction_amount: formatted_amount,
        created_date: created_date,
        currency_symbol: currency_symbol,
        transfer: transfer
      )

      text_content = build_pending_text(
        user_name: user_name,
        campaign_name: campaign_name,
        transaction_reference: transaction_reference,
        transaction_amount: formatted_amount,
        created_date: created_date,
        currency_symbol: currency_symbol,
        transfer: transfer
      )

      send_email(
        recipient_email: email,
        recipient_name: user_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'transfer_pending',
        transfer: transfer
      )
    end

    # HTML Builders
    def build_success_html(user_name:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      transfer_id = transfer.id
      formatted_amount = transaction_amount

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Transfer Successful</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>✅ Transfer Successful</h1>
              </div>

              <div class="content">
                <h1>Your transfer of #{currency_symbol} #{formatted_amount} was successful!</h1>

                <p class="greeting">Hello #{user_name},</p>

                <p>We are pleased to inform you that your transfer of <strong>#{currency_symbol} #{formatted_amount}</strong> has been successfully processed. It may take a while to reflect in your settlement bank account.</p>

                <div class="transfer-details" style="border-left-color: #27ae60;">
                  <h3>📋 Transfer Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Reference:</span>
                    <span class="detail-value">#{transaction_reference}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💰 Amount:</span>
                    <span class="detail-value" style="font-weight: bold; color: #27ae60;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Date:</span>
                    <span class="detail-value">#{transaction_date}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">✅ Status:</span>
                    <span class="detail-value" style="color: #27ae60; font-weight: 600;">Completed Successfully</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_name}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/transfers/#{transfer_id}" class="cta-button" style="background-color: #27ae60;">View Transfer Details</a>
                  <a href="#{frontend_url}/transfers" class="cta-button" style="background-color: #3498db;">View All Transfers</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your transfer?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for using Bantuhive!<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_reversed_html(user_name:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      transfer_id = transfer.id
      formatted_amount = transaction_amount

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Transfer Reversed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>🔄 Transfer Reversed</h1>
              </div>

              <div class="content">
                <h1 style="color: #e74c3c;">Your transfer has been reversed</h1>

                <p class="greeting">Hello #{user_name},</p>

                <p>We regret to inform you that your transfer of <strong>#{currency_symbol} #{formatted_amount}</strong> has been reversed.</p>

                <div class="transfer-details" style="border-left-color: #e74c3c;">
                  <h3>📋 Transfer Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Reference:</span>
                    <span class="detail-value">#{transaction_reference}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💰 Amount:</span>
                    <span class="detail-value" style="font-weight: bold; color: #e74c3c;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Original Date:</span>
                    <span class="detail-value">#{transaction_date}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">🔄 Status:</span>
                    <span class="detail-value" style="color: #e74c3c; font-weight: 600;">Reversed</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_name}</span>
                  </div>
                </div>

                <div class="action-required">
                  <h3>📌 What This Means</h3>
                  <p>The funds from this transfer have been returned to your Bantuhive account balance.</p>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/transfers/#{transfer_id}" class="cta-button" style="background-color: #3498db;">View Transfer Details</a>
                  <a href="#{frontend_url}/transfers" class="cta-button" style="background-color: #2c3e50;">View All Transfers</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about this reversal?</strong> Contact our support team:</p>
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

    def build_failed_html(user_name:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      transfer_id = transfer.id
      formatted_amount = transaction_amount

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Transfer Failed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>❌ Transfer Failed</h1>
              </div>

              <div class="content">
                <h1 style="color: #e74c3c;">Your transfer has failed</h1>

                <p class="greeting">Hello #{user_name},</p>

                <p>We regret to inform you that your transfer of <strong>#{currency_symbol} #{formatted_amount}</strong> has failed.</p>

                <div class="transfer-details" style="border-left-color: #e74c3c;">
                  <h3>📋 Transfer Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Reference:</span>
                    <span class="detail-value">#{transaction_reference}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💰 Amount:</span>
                    <span class="detail-value" style="font-weight: bold; color: #e74c3c;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Attempt Date:</span>
                    <span class="detail-value">#{transaction_date}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">❌ Status:</span>
                    <span class="detail-value" style="color: #e74c3c; font-weight: 600;">Failed</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_name}</span>
                  </div>
                </div>

                <div class="action-required">
                  <h3>📌 What To Do Next</h3>
                  <ol>
                    <li>Verify your bank account details are correct</li>
                    <li>Ensure your account is active and in good standing</li>
                    <li>Contact your bank to resolve any issues</li>
                    <li>Try the transfer again with updated information</li>
                  </ol>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/transfers/new" class="cta-button" style="background-color: #e67e22;">Try Again</a>
                  <a href="#{frontend_url}/transfers/#{transfer_id}" class="cta-button" style="background-color: #3498db;">View Details</a>
                </div>

                <div class="support-section">
                  <p><strong>Need assistance?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>We're here to help,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_pending_html(user_name:, campaign_name:, transaction_reference:, transaction_amount:, created_date:, currency_symbol:, transfer:)
      transfer_id = transfer.id
      formatted_amount = transaction_amount

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Transfer Processing</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #f39c12;">
                <h1>⏳ Transfer Processing</h1>
              </div>

              <div class="content">
                <h1 style="color: #f39c12;">Your transfer is being processed</h1>

                <p class="greeting">Hello #{user_name},</p>

                <p>Your transfer of <strong>#{currency_symbol} #{formatted_amount}</strong> has been initiated and is currently being processed.</p>

                <div class="transfer-details" style="border-left-color: #f39c12;">
                  <h3>📋 Transfer Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Reference:</span>
                    <span class="detail-value">#{transaction_reference}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💰 Amount:</span>
                    <span class="detail-value" style="font-weight: bold; color: #f39c12;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Initiated:</span>
                    <span class="detail-value">#{created_date}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">⏳ Status:</span>
                    <span class="detail-value" style="color: #f39c12; font-weight: 600;">Processing</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign_name}</span>
                  </div>
                </div>

                <div class="timeline">
                  <h3>📌 Transfer Timeline</h3>
                  <div class="step completed">
                    <span class="step-number">1</span>
                    <span class="step-text">✅ Transfer initiated</span>
                  </div>
                  <div class="step active">
                    <span class="step-number">2</span>
                    <span class="step-text">⏳ Processing by payment provider</span>
                  </div>
                  <div class="step">
                    <span class="step-number">3</span>
                    <span class="step-text">📤 Funds being transferred to your bank</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/transfers/#{transfer_id}" class="cta-button" style="background-color: #f39c12;">Track Transfer</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your transfer?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for your patience,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Builders
    def build_success_text(user_name:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      <<~TEXT
        Transfer Successful

        Hello #{user_name},

        We are pleased to inform you that your transfer of #{currency_symbol} #{transaction_amount} has been successfully processed.

        Transfer Details:
        - Reference: #{transaction_reference}
        - Amount: #{currency_symbol} #{transaction_amount}
        - Date: #{transaction_date}
        - Status: Completed Successfully
        - Campaign: #{campaign_name}

        View Transfer Details: #{frontend_url}/transfers/#{transfer.id}
        View All Transfers: #{frontend_url}/transfers

        Questions? Contact our support team: #{support_email}

        Thank you for using Bantuhive!
        #{sender_name}
      TEXT
    end

    def build_reversed_text(user_name:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      <<~TEXT
        Transfer Reversed

        Hello #{user_name},

        We regret to inform you that your transfer of #{currency_symbol} #{transaction_amount} has been reversed.

        Transfer Details:
        - Reference: #{transaction_reference}
        - Amount: #{currency_symbol} #{transaction_amount}
        - Original Date: #{transaction_date}
        - Status: Reversed
        - Campaign: #{campaign_name}

        What This Means:
        The funds from this transfer have been returned to your Bantuhive account balance.

        View Transfer Details: #{frontend_url}/transfers/#{transfer.id}
        View All Transfers: #{frontend_url}/transfers

        Questions? Contact our support team: #{support_email}

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_failed_text(user_name:, campaign_name:, transaction_reference:, transaction_amount:, transaction_date:, currency_symbol:, transfer:)
      <<~TEXT
        Transfer Failed

        Hello #{user_name},

        We regret to inform you that your transfer of #{currency_symbol} #{transaction_amount} has failed.

        Transfer Details:
        - Reference: #{transaction_reference}
        - Amount: #{currency_symbol} #{transaction_amount}
        - Attempt Date: #{transaction_date}
        - Status: Failed
        - Campaign: #{campaign_name}

        What To Do Next:
        1. Verify your bank account details are correct
        2. Ensure your account is active and in good standing
        3. Contact your bank to resolve any issues
        4. Try the transfer again with updated information

        Try Again: #{frontend_url}/transfers/new
        View Details: #{frontend_url}/transfers/#{transfer.id}

        Need assistance? Contact our support team: #{support_email}

        We're here to help,
        #{sender_name}
      TEXT
    end

    def build_pending_text(user_name:, campaign_name:, transaction_reference:, transaction_amount:, created_date:, currency_symbol:, transfer:)
      <<~TEXT
        Transfer Processing

        Hello #{user_name},

        Your transfer of #{currency_symbol} #{transaction_amount} has been initiated and is currently being processed.

        Transfer Details:
        - Reference: #{transaction_reference}
        - Amount: #{currency_symbol} #{transaction_amount}
        - Initiated: #{created_date}
        - Status: Processing
        - Campaign: #{campaign_name}

        Transfer Timeline:
        1. ✅ Transfer initiated
        2. ⏳ Processing by payment provider
        3. 📤 Funds being transferred to your bank

        Track Transfer: #{frontend_url}/transfers/#{transfer.id}

        Questions? Contact our support team: #{support_email}

        Thank you for your patience,
        #{sender_name}
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email:, recipient_name:, subject:, html_content:, text_content:, email_type:, transfer:)
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
            'X-Entity-Ref-ID' => "#{email_type}_#{transfer&.id || Time.current.to_i}",
            'X-Entity-Ref-Type' => email_type
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        result = api_instance.send_transac_email(send_smtp_email)

        log_email_sent(recipient_email, email_type, transfer)
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

    def log_email_sent(recipient_email, email_type, transfer)
      log_data = {
        recipient_email: recipient_email,
        email_type: email_type,
        transfer_id: transfer&.id,
        amount: transfer&.amount,
        sent_at: Time.current.iso8601
      }

      Rails.logger.info "Transfer notification email sent: #{log_data.to_json}"
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
        .content {
          padding: 30px;
        }
        .content h1 {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .transfer-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .transfer-details h3 {
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
          width: 150px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .timeline {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .timeline h3 {
          margin-top: 0;
        }
        .step {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #d4e6f1;
        }
        .step:last-child {
          border-bottom: none;
        }
        .step.active {
          opacity: 1;
        }
        .step.completed {
          opacity: 0.7;
        }
        .step-number {
          font-size: 20px;
          font-weight: bold;
          color: #3498db;
          margin-right: 10px;
          min-width: 30px;
        }
        .action-required {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .action-required ol {
          padding-left: 20px;
          margin: 10px 0;
        }
        .action-required li {
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
          <p>You are receiving this email because you initiated a transfer on Bantuhive.</p>

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