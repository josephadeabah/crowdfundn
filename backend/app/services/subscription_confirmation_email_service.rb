# app/services/subscription_confirmation_email_service.rb
class SubscriptionConfirmationEmailService
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

    # Main Methods
    def send_confirmation_email(subscription)
      return false unless validate_subscription(subscription)

      email = subscription.email
      subscription_code = subscription.subscription_code || generate_subscription_code(subscription)
      subscriber_name = subscription.subscriber_name || 'Valued Supporter'
      
      campaign = subscription.campaign
      fundraiser_name = campaign.fundraiser.full_name if campaign&.fundraiser
      campaign_name = campaign&.title || 'the campaign'
      currency_symbol = campaign&.currency_symbol || 'GHS'
      
      amount = subscription.amount.to_f
      next_payment_date = format_date(subscription.next_payment_date)
      interval = subscription.interval.to_s.humanize
      card_type = subscription.card_type || 'Card'
      last4 = subscription.last4 || '****'

      subject = "Your subscription to #{campaign_name} is now active [#{subscription_code}] 🎉"

      html_content = build_confirmation_html(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        fundraiser_name: fundraiser_name,
        currency_symbol: currency_symbol,
        amount: amount,
        interval: interval,
        next_payment_date: next_payment_date,
        card_type: card_type,
        last4: last4,
        subscription_code: subscription_code,
        subscription_id: subscription.id
      )

      text_content = build_confirmation_text(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        fundraiser_name: fundraiser_name,
        currency_symbol: currency_symbol,
        amount: amount,
        interval: interval,
        next_payment_date: next_payment_date,
        card_type: card_type,
        last4: last4,
        subscription_code: subscription_code,
        subscription_id: subscription.id
      )

      send_email(
        recipient_email: email,
        recipient_name: subscriber_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'subscription_confirmation',
        subscription: subscription
      )
    end

    def send_payment_success_email(subscription, transaction_data)
      return false unless validate_subscription(subscription)
      return false unless transaction_data.is_a?(Hash)

      email = subscription.email
      subscriber_name = subscription.subscriber_name || 'Valued Supporter'
      campaign_name = subscription.campaign&.title || 'the campaign'
      
      amount = transaction_data[:amount].to_f
      currency = transaction_data[:currency] || subscription.campaign&.currency_symbol || 'GHS'
      reference = transaction_data[:reference] || transaction_data[:transaction_id] || 'N/A'
      payment_date = format_date(transaction_data[:payment_date] || Time.current)
      next_payment_date = format_date(subscription.next_payment_date)

      subject = "Payment Successful - #{campaign_name} Subscription"

      html_content = build_payment_success_html(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        amount: amount,
        currency: currency,
        reference: reference,
        payment_date: payment_date,
        next_payment_date: next_payment_date
      )

      text_content = build_payment_success_text(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        amount: amount,
        currency: currency,
        reference: reference,
        payment_date: payment_date,
        next_payment_date: next_payment_date
      )

      send_email(
        recipient_email: email,
        recipient_name: subscriber_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'subscription_payment_success',
        subscription: subscription
      )
    end

    def send_payment_failure_email(subscription, error_details)
      return false unless validate_subscription(subscription)

      email = subscription.email
      subscriber_name = subscription.subscriber_name || 'Valued Supporter'
      campaign_name = subscription.campaign&.title || 'the campaign'
      
      error_message = error_details[:message] || 'Payment processing failed'
      retry_date = format_date(error_details[:retry_date] || 3.days.from_now)
      subscription_id = subscription.id

      subject = "Payment Issue - #{campaign_name} Subscription"

      html_content = build_payment_failure_html(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        error_message: error_message,
        retry_date: retry_date,
        subscription_id: subscription_id
      )

      text_content = build_payment_failure_text(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        error_message: error_message,
        retry_date: retry_date,
        subscription_id: subscription_id
      )

      send_email(
        recipient_email: email,
        recipient_name: subscriber_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'subscription_payment_failure',
        subscription: subscription
      )
    end

    def send_renewal_reminder_email(subscription, days_until_renewal)
      return false unless validate_subscription(subscription)

      email = subscription.email
      subscriber_name = subscription.subscriber_name || 'Valued Supporter'
      campaign_name = subscription.campaign&.title || 'the campaign'
      
      next_payment_date = format_date(subscription.next_payment_date)
      amount = subscription.amount.to_f
      currency = subscription.campaign&.currency_symbol || 'GHS'

      subject = "Renewal Reminder - #{campaign_name} Subscription"

      html_content = build_renewal_reminder_html(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        days_until_renewal: days_until_renewal,
        next_payment_date: next_payment_date,
        amount: amount,
        currency: currency,
        subscription_id: subscription.id
      )

      text_content = build_renewal_reminder_text(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        days_until_renewal: days_until_renewal,
        next_payment_date: next_payment_date,
        amount: amount,
        currency: currency,
        subscription_id: subscription.id
      )

      send_email(
        recipient_email: email,
        recipient_name: subscriber_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'subscription_renewal_reminder',
        subscription: subscription
      )
    end

    def send_cancellation_email(subscription)
      return false unless validate_subscription(subscription)

      email = subscription.email
      subscriber_name = subscription.subscriber_name || 'Valued Supporter'
      campaign_name = subscription.campaign&.title || 'the campaign'
      
      cancellation_date = format_date(subscription.cancelled_at || Time.current)
      subscription_code = subscription.subscription_code || generate_subscription_code(subscription)

      subject = "Your #{campaign_name} Subscription Has Been Cancelled"

      html_content = build_cancellation_html(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        cancellation_date: cancellation_date,
        subscription_code: subscription_code
      )

      text_content = build_cancellation_text(
        subscriber_name: subscriber_name,
        campaign_name: campaign_name,
        cancellation_date: cancellation_date,
        subscription_code: subscription_code
      )

      send_email(
        recipient_email: email,
        recipient_name: subscriber_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'subscription_cancellation',
        subscription: subscription
      )
    end

    private

    # Validation Methods
    def validate_subscription(subscription)
      return false unless subscription
      return false unless subscription.respond_to?(:email)
      return false unless subscription.email.present?
      true
    end

    # Helper Methods
    def format_date(date)
      return 'N/A' unless date
      date.strftime('%B %d, %Y')
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

    def generate_subscription_code(subscription)
      "SUB-#{subscription.id}-#{Time.current.strftime('%Y%m')}-#{SecureRandom.hex(4).upcase}"
    end

    # HTML Builders
    def build_confirmation_html(
      subscriber_name:,
      campaign_name:,
      fundraiser_name:,
      currency_symbol:,
      amount:,
      interval:,
      next_payment_date:,
      card_type:,
      last4:,
      subscription_code:,
      subscription_id:
    )
      formatted_amount = number_with_delimiter(amount)
      fundraiser_display = fundraiser_name || 'the campaign organizer'

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Subscription Confirmation</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>🎉 Subscription Confirmed</h1>
              </div>

              <div class="content">
                <h1>Your subscription to #{campaign_name} is now active!</h1>

                <p class="greeting">Dear #{subscriber_name},</p>

                <p>You have subscribed to <strong>#{campaign_name}</strong> by <strong>#{fundraiser_display}</strong>.</p>

                <div class="subscription-details" style="border-left-color: #27ae60;">
                  <h3>📋 Subscription Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Subscription Code:</span>
                    <span class="detail-value">#{subscription_code}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💰 Amount:</span>
                    <span class="detail-value" style="font-weight: bold; color: #27ae60;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Frequency:</span>
                    <span class="detail-value">Every #{interval}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Next Charge:</span>
                    <span class="detail-value">#{next_payment_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💳 Card:</span>
                    <span class="detail-value">#{card_type} ending in #{last4}</span>
                  </div>
                </div>

                <div class="campaign-info">
                  <h3>📌 What's Next?</h3>
                  <p>Your subscription will automatically charge #{currency_symbol} #{formatted_amount} every #{interval}. You can manage or cancel your subscription at any time.</p>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/subscriptions/#{subscription_id}" class="cta-button" style="background-color: #27ae60;">Manage Subscription</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your subscription?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for supporting <strong>#{fundraiser_display}</strong> in achieving their goals!</p>

                <p>Warm Regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_payment_success_html(
      subscriber_name:,
      campaign_name:,
      amount:,
      currency:,
      reference:,
      payment_date:,
      next_payment_date:
    )
      formatted_amount = number_with_delimiter(amount)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Payment Successful</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>✅ Payment Successful</h1>
              </div>

              <div class="content">
                <h1>Payment Processed Successfully</h1>

                <p class="greeting">Dear #{subscriber_name},</p>

                <p>Your subscription payment for <strong>#{campaign_name}</strong> has been processed successfully.</p>

                <div class="subscription-details" style="border-left-color: #27ae60;">
                  <h3>📋 Payment Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">💰 Amount:</span>
                    <span class="detail-value" style="font-weight: bold; color: #27ae60;">#{currency} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Payment Date:</span>
                    <span class="detail-value">#{payment_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Next Payment:</span>
                    <span class="detail-value">#{next_payment_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🔑 Reference:</span>
                    <span class="detail-value">#{reference}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/subscriptions" class="cta-button" style="background-color: #27ae60;">View Subscriptions</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about this payment?</strong> Contact us:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for your continued support!<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_payment_failure_html(
      subscriber_name:,
      campaign_name:,
      error_message:,
      retry_date:,
      subscription_id:
    )
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Payment Issue</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>⚠️ Payment Issue</h1>
              </div>

              <div class="content">
                <h1 style="color: #e74c3c;">Payment Issue Detected</h1>

                <p class="greeting">Dear #{subscriber_name},</p>

                <p>We encountered an issue processing your subscription payment for <strong>#{campaign_name}</strong>.</p>

                <div class="subscription-details" style="border-left-color: #e74c3c;">
                  <h3>📋 Issue Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">📝 Error:</span>
                    <span class="detail-value" style="color: #c0392b;">#{error_message}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Next Retry:</span>
                    <span class="detail-value">#{retry_date}</span>
                  </div>
                </div>

                <div class="action-required">
                  <h3>📌 What You Need To Do</h3>
                  <ol>
                    <li>Verify your payment method is up to date</li>
                    <li>Ensure sufficient funds are available</li>
                    <li>Update your payment information if needed</li>
                  </ol>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/subscriptions/#{subscription_id}/payment" class="cta-button" style="background-color: #e67e22;">Update Payment Method</a>
                </div>

                <div class="support-section">
                  <p><strong>Need help resolving this?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>We'll automatically retry the payment in a few days.<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_renewal_reminder_html(
      subscriber_name:,
      campaign_name:,
      days_until_renewal:,
      next_payment_date:,
      amount:,
      currency:,
      subscription_id:
    )
      formatted_amount = number_with_delimiter(amount)
      urgency = days_until_renewal <= 3 ? '⚠️' : '📌'

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Renewal Reminder</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{days_until_renewal <= 3 ? '#e67e22' : '#3498db'};">
                <h1>#{urgency} Renewal Reminder</h1>
              </div>

              <div class="content">
                <h1>Hello #{subscriber_name}!</h1>

                <p>Your subscription to <strong>#{campaign_name}</strong> will renew in <strong>#{days_until_renewal}</strong> days.</p>

                <div class="subscription-details" style="border-left-color: #3498db;">
                  <h3>📋 Renewal Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">💰 Amount:</span>
                    <span class="detail-value">#{currency} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Renewal Date:</span>
                    <span class="detail-value">#{next_payment_date}</span>
                  </div>
                </div>

                #{"<div class='urgent-notice'>
                  <p><strong>⚠️ Your subscription is renewing soon!</strong> Please ensure your payment method is up to date.</p>
                </div>" if days_until_renewal <= 3}

                <div class="action-section">
                  <a href="#{frontend_url}/subscriptions/#{subscription_id}" class="cta-button" style="background-color: #3498db;">Manage Subscription</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your renewal?</strong> Contact us:</p>
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

    def build_cancellation_html(
      subscriber_name:,
      campaign_name:,
      cancellation_date:,
      subscription_code:
    )
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Subscription Cancelled</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #f8d7da;">
                <h1 style="color: #721c24;">📋 Subscription Cancelled</h1>
              </div>

              <div class="content">
                <h1 style="color: #dc3545;">Your subscription has been cancelled</h1>

                <p class="greeting">Dear #{subscriber_name},</p>

                <p>Your subscription to <strong>#{campaign_name}</strong> has been cancelled.</p>

                <div class="subscription-details" style="border-left-color: #dc3545;">
                  <div class="detail-row">
                    <span class="detail-label">📝 Subscription:</span>
                    <span class="detail-value">#{subscription_code}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Cancellation Date:</span>
                    <span class="detail-value">#{cancellation_date}</span>
                  </div>
                </div>

                <p>You will not be charged for future renewals.</p>

                <div class="action-section">
                  <a href="#{frontend_url}/subscriptions" class="cta-button" style="background-color: #27ae60;">View Subscriptions</a>
                  <a href="#{frontend_url}/feedback" class="cta-button" style="background-color: #3498db;">Share Feedback</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your cancellation?</strong> Contact us:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for your support,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Builders
    def build_confirmation_text(
      subscriber_name:,
      campaign_name:,
      fundraiser_name:,
      currency_symbol:,
      amount:,
      interval:,
      next_payment_date:,
      card_type:,
      last4:,
      subscription_code:,
      subscription_id:
    )
      formatted_amount = number_with_delimiter(amount)

      <<~TEXT
        Subscription Confirmation

        Dear #{subscriber_name},

        You have subscribed to #{campaign_name} by #{fundraiser_name || 'the campaign organizer'}.

        Subscription Details:
        - Subscription Code: #{subscription_code}
        - Amount: #{currency_symbol} #{formatted_amount}
        - Frequency: Every #{interval}
        - Next Charge: #{next_payment_date}
        - Card: #{card_type} ending in #{last4}

        What's Next?
        Your subscription will automatically charge #{currency_symbol} #{formatted_amount} every #{interval}. You can manage or cancel your subscription at any time.

        Manage Subscription: #{frontend_url}/subscriptions/#{subscription_id}

        Questions? Contact our support team: #{support_email}

        Thank you for supporting #{fundraiser_name || 'the campaign organizer'}!

        Warm Regards,
        #{sender_name}
      TEXT
    end

    def build_payment_success_text(
      subscriber_name:,
      campaign_name:,
      amount:,
      currency:,
      reference:,
      payment_date:,
      next_payment_date:
    )
      formatted_amount = number_with_delimiter(amount)

      <<~TEXT
        Payment Successful

        Dear #{subscriber_name},

        Your subscription payment for #{campaign_name} has been processed successfully.

        Payment Details:
        - Amount: #{currency} #{formatted_amount}
        - Payment Date: #{payment_date}
        - Next Payment: #{next_payment_date}
        - Reference: #{reference}

        View Subscriptions: #{frontend_url}/subscriptions

        Questions about this payment? Contact us: #{support_email}

        Thank you for your continued support!
        #{sender_name}
      TEXT
    end

    def build_payment_failure_text(
      subscriber_name:,
      campaign_name:,
      error_message:,
      retry_date:,
      subscription_id:
    )
      <<~TEXT
        Payment Issue

        Dear #{subscriber_name},

        We encountered an issue processing your subscription payment for #{campaign_name}.

        Issue Details:
        - Error: #{error_message}
        - Next Retry: #{retry_date}

        What You Need To Do:
        1. Verify your payment method is up to date
        2. Ensure sufficient funds are available
        3. Update your payment information if needed

        Update Payment Method: #{frontend_url}/subscriptions/#{subscription_id}/payment

        Need help? Contact our support team: #{support_email}

        We'll automatically retry the payment in a few days.
        #{sender_name}
      TEXT
    end

    def build_renewal_reminder_text(
      subscriber_name:,
      campaign_name:,
      days_until_renewal:,
      next_payment_date:,
      amount:,
      currency:,
      subscription_id:
    )
      formatted_amount = number_with_delimiter(amount)

      text = <<~TEXT
        Renewal Reminder

        Dear #{subscriber_name},

        Your subscription to #{campaign_name} will renew in #{days_until_renewal} days.

        Renewal Details:
        - Amount: #{currency} #{formatted_amount}
        - Renewal Date: #{next_payment_date}
      TEXT

      if days_until_renewal <= 3
        text += "\n⚠️ Your subscription is renewing soon! Please ensure your payment method is up to date."
      end

      text += <<~TEXT

        Manage Subscription: #{frontend_url}/subscriptions/#{subscription_id}

        Questions about your renewal? Contact us: #{support_email}

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_cancellation_text(
      subscriber_name:,
      campaign_name:,
      cancellation_date:,
      subscription_code:
    )
      <<~TEXT
        Subscription Cancelled

        Dear #{subscriber_name},

        Your subscription to #{campaign_name} has been cancelled.

        Subscription: #{subscription_code}
        Cancellation Date: #{cancellation_date}

        You will not be charged for future renewals.

        View Subscriptions: #{frontend_url}/subscriptions
        Share Feedback: #{frontend_url}/feedback

        Questions? Contact us: #{support_email}

        Thank you for your support,
        #{sender_name}
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email:, recipient_name:, subject:, html_content:, text_content:, email_type:, subscription:)
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
            'X-Entity-Ref-ID' => "#{email_type}_#{subscription&.id || Time.current.to_i}",
            'X-Entity-Ref-Type' => email_type
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        result = api_instance.send_transac_email(send_smtp_email)

        log_email_sent(recipient_email, email_type, subscription)
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

    def log_email_sent(recipient_email, email_type, subscription)
      log_data = {
        recipient_email: recipient_email,
        email_type: email_type,
        subscription_id: subscription&.id,
        sent_at: Time.current.iso8601
      }

      Rails.logger.info "Subscription email sent: #{log_data.to_json}"
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
        .subscription-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .subscription-details h3 {
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
        .detail-label {
          font-weight: 600;
          width: 150px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .campaign-info {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .campaign-info h3 {
          margin-top: 0;
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
        .urgent-notice {
          background-color: #fdedec;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #e74c3c;
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
          <p>You are receiving this email because you have a subscription on Bantuhive.</p>

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