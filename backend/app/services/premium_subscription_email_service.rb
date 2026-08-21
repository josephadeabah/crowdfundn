# app/services/premium_subscription_email_service.rb
class PremiumSubscriptionEmailService
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
    def send_confirmation_email(user, subscription)
      return false unless validate_subscription(user, subscription)

      plan = subscription.premium_plan
      start_date = format_date(subscription.start_date)
      expires_at = format_date(subscription.expires_at)

      subject = "Welcome to #{plan.name} Premium! 🎉"

      html_content = build_confirmation_html(
        user_name: user.full_name,
        plan_name: plan.name,
        plan_price: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        start_date: start_date,
        expires_at: expires_at,
        features: plan.features || {}
      )

      text_content = build_confirmation_text(
        user_name: user.full_name,
        plan_name: plan.name,
        plan_price: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        start_date: start_date,
        expires_at: expires_at,
        features: plan.features || {}
      )

      send_email(
        user: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'premium_confirmation',
        subscription: subscription
      )
    end

    def send_cancellation_email(user, subscription)
      return false unless validate_subscription(user, subscription)

      plan = subscription.premium_plan
      expires_at = format_date(subscription.expires_at)

      subject = "Your #{plan.name} Subscription Has Been Cancelled"

      html_content = build_cancellation_html(
        user_name: user.full_name,
        plan_name: plan.name,
        expires_at: expires_at
      )

      text_content = build_cancellation_text(
        user_name: user.full_name,
        plan_name: plan.name,
        expires_at: expires_at
      )

      send_email(
        user: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'premium_cancellation',
        subscription: subscription
      )
    end

    def send_payment_success_email(user, subscription, transaction_data)
      return false unless validate_subscription(user, subscription)
      return false unless transaction_data.is_a?(Hash)

      plan = subscription.premium_plan
      amount = transaction_data[:amount].to_f / 100 rescue transaction_data[:amount].to_f
      currency = transaction_data[:currency] || plan.currency
      reference = transaction_data[:reference] || transaction_data[:transaction_id] || 'N/A'

      subject = "Payment Successful - #{plan.name} Plan"

      html_content = build_payment_success_html(
        user_name: user.full_name,
        plan_name: plan.name,
        amount: amount,
        currency: currency,
        reference: reference
      )

      text_content = build_payment_success_text(
        user_name: user.full_name,
        plan_name: plan.name,
        amount: amount,
        currency: currency,
        reference: reference
      )

      send_email(
        user: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'premium_payment_success',
        subscription: subscription
      )
    end

    def send_payment_failure_email(user, subscription, error_details)
      return false unless validate_subscription(user, subscription)

      plan = subscription.premium_plan
      error_message = error_details[:message] || 'Payment processing failed'
      retry_date = format_date(3.days.from_now)

      subject = "Payment Issue - #{plan.name} Subscription"

      html_content = build_payment_failure_html(
        user_name: user.full_name,
        plan_name: plan.name,
        error_message: error_message,
        retry_date: retry_date
      )

      text_content = build_payment_failure_text(
        user_name: user.full_name,
        plan_name: plan.name,
        error_message: error_message,
        retry_date: retry_date
      )

      send_email(
        user: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'premium_payment_failure',
        subscription: subscription
      )
    end

    def send_renewal_reminder_email(user, subscription, days_until_renewal)
      return false unless validate_subscription(user, subscription)

      plan = subscription.premium_plan
      renewal_date = format_date(subscription.expires_at)

      subject = "Renewal Reminder - #{plan.name} Premium"

      html_content = build_renewal_reminder_html(
        user_name: user.full_name,
        plan_name: plan.name,
        days_until_renewal: days_until_renewal,
        renewal_date: renewal_date,
        price: plan.price,
        currency: plan.currency
      )

      text_content = build_renewal_reminder_text(
        user_name: user.full_name,
        plan_name: plan.name,
        days_until_renewal: days_until_renewal,
        renewal_date: renewal_date,
        price: plan.price,
        currency: plan.currency
      )

      send_email(
        user: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'premium_renewal_reminder',
        subscription: subscription
      )
    end

    def send_plan_upgrade_email(user, subscription, old_plan_name)
      return false unless validate_subscription(user, subscription)

      plan = subscription.premium_plan

      subject = "Plan Upgrade Successful - #{plan.name}"

      html_content = build_plan_upgrade_html(
        user_name: user.full_name,
        new_plan_name: plan.name,
        old_plan_name: old_plan_name,
        features: plan.features || {}
      )

      text_content = build_plan_upgrade_text(
        user_name: user.full_name,
        new_plan_name: plan.name,
        old_plan_name: old_plan_name,
        features: plan.features || {}
      )

      send_email(
        user: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'premium_plan_upgrade',
        subscription: subscription
      )
    end

    def send_plan_downgrade_email(user, subscription, old_plan_name)
      return false unless validate_subscription(user, subscription)

      plan = subscription.premium_plan
      effective_date = format_date(subscription.expires_at)

      subject = "Plan Downgrade - #{plan.name}"

      html_content = build_plan_downgrade_html(
        user_name: user.full_name,
        new_plan_name: plan.name,
        old_plan_name: old_plan_name,
        effective_date: effective_date
      )

      text_content = build_plan_downgrade_text(
        user_name: user.full_name,
        new_plan_name: plan.name,
        old_plan_name: old_plan_name,
        effective_date: effective_date
      )

      send_email(
        user: user,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'premium_plan_downgrade',
        subscription: subscription
      )
    end

    private

    # Validation Methods
    def validate_subscription(user, subscription)
      return false unless user.is_a?(User) && user.email.present?
      return false unless subscription
      return false unless subscription.respond_to?(:premium_plan)
      return false unless subscription.premium_plan
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

    def generate_feature_list(features)
      return '' unless features.is_a?(Hash) && features.any?

      html = ''
      features.each do |key, value|
        if value == true
          html += <<~HTML
            <div class="feature-item">
              <span class="feature-icon">✅</span>
              <span>#{key.to_s.humanize}</span>
            </div>
          HTML
        elsif value.is_a?(String) || value.is_a?(Numeric)
          html += <<~HTML
            <div class="feature-item">
              <span class="feature-icon">✅</span>
              <span>#{key.to_s.humanize}: #{value}</span>
            </div>
          HTML
        end
      end
      html
    end

    # HTML Builders
    def build_confirmation_html(user_name:, plan_name:, plan_price:, currency:, interval:, start_date:, expires_at:, features:)
      formatted_price = number_with_delimiter(plan_price)
      feature_list_html = generate_feature_list(features)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Premium Confirmation</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <h1>🎉 Welcome to Premium!</h1>
                <p>You're now part of our exclusive community</p>
              </div>

              <div class="content">
                <h1>Welcome to #{plan_name}, #{user_name}!</h1>

                <p>Thank you for upgrading to our <strong>#{plan_name}</strong> premium plan. Your support means the world to us and helps us continue providing exceptional service.</p>

                <div class="subscription-details" style="border-left-color: #667eea;">
                  <h3>📋 Your Plan Details:</h3>
                  <div class="detail-row">
                    <span class="detail-label">Plan:</span>
                    <span class="detail-value">#{plan_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Price:</span>
                    <span class="detail-value">#{currency} #{formatted_price} per #{interval}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Start Date:</span>
                    <span class="detail-value">#{start_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Next Billing:</span>
                    <span class="detail-value">#{expires_at}</span>
                  </div>
                </div>

                #{"<div class='feature-list'>
                  <h3>✨ What you get with #{plan_name}:</h3>
                  #{feature_list_html}
                </div>" if feature_list_html.present?}

                <div class="action-section">
                  <a href="#{frontend_url}/settings/subscription" class="cta-button">Manage Subscription</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your subscription?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Welcome aboard,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_cancellation_html(user_name:, plan_name:, expires_at:)
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
                <h1 style="color: #dc3545;">Goodbye, #{user_name} 😢</h1>

                <p>Your <strong>#{plan_name}</strong> subscription has been successfully cancelled.</p>

                <div class="subscription-details" style="border-left-color: #dc3545;">
                  <div class="detail-row">
                    <span class="detail-label">📅 Access Until:</span>
                    <span class="detail-value">#{expires_at}</span>
                  </div>
                </div>

                <p>You will continue to have access to premium features until <strong>#{expires_at}</strong>.</p>

                <p>We're sorry to see you go. If you changed your mind or have any feedback, we'd love to hear from you.</p>

                <div class="action-section">
                  <a href="#{frontend_url}/settings/subscription" class="cta-button" style="background-color: #27ae60;">Reactivate Subscription</a>
                  <a href="#{frontend_url}/feedback" class="cta-button" style="background-color: #3498db;">Share Feedback</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your cancellation?</strong> Contact us:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for being part of our community.<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_payment_success_html(user_name:, plan_name:, amount:, currency:, reference:)
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
                <h1 style="color: #27ae60;">Thank you for your payment, #{user_name}!</h1>

                <p>Your <strong>#{plan_name}</strong> subscription payment of <strong>#{currency} #{formatted_amount}</strong> was processed successfully.</p>

                <div class="subscription-details" style="border-left-color: #27ae60;">
                  <div class="detail-row">
                    <span class="detail-label">🔑 Reference:</span>
                    <span class="detail-value">#{reference}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/settings/subscription" class="cta-button" style="background-color: #27ae60;">View Subscription</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your payment?</strong> Contact us:</p>
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

    def build_payment_failure_html(user_name:, plan_name:, error_message:, retry_date:)
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
                <h1 style="color: #e74c3c;">Payment Issue, #{user_name}</h1>

                <p>We encountered an issue processing your <strong>#{plan_name}</strong> subscription payment.</p>

                <div class="subscription-details" style="border-left-color: #e74c3c;">
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
                  <a href="#{frontend_url}/settings/payment" class="cta-button" style="background-color: #e67e22;">Update Payment Method</a>
                </div>

                <div class="support-section">
                  <p><strong>Need help resolving this?</strong> Contact our support team:</p>
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

    def build_renewal_reminder_html(user_name:, plan_name:, days_until_renewal:, renewal_date:, price:, currency:)
      urgency = days_until_renewal <= 3 ? '⚠️' : '📌'
      formatted_price = number_with_delimiter(price)

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
                <h1>Hello #{user_name}!</h1>

                <p>Your <strong>#{plan_name}</strong> premium subscription will renew in <strong>#{days_until_renewal}</strong> days on <strong>#{renewal_date}</strong>.</p>

                <div class="subscription-details" style="border-left-color: #3498db;">
                  <div class="detail-row">
                    <span class="detail-label">Plan:</span>
                    <span class="detail-value">#{plan_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value">#{currency} #{formatted_price}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Renewal Date:</span>
                    <span class="detail-value">#{renewal_date}</span>
                  </div>
                </div>

                #{"<div class='urgent-notice'>
                  <p><strong>⚠️ Your subscription is renewing soon!</strong> Please ensure your payment method is up to date.</p>
                </div>" if days_until_renewal <= 3}

                <div class="action-section">
                  <a href="#{frontend_url}/settings/subscription" class="cta-button" style="background-color: #3498db;">Manage Subscription</a>
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

    def build_plan_upgrade_html(user_name:, new_plan_name:, old_plan_name:, features:)
      feature_list_html = generate_feature_list(features)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Plan Upgrade</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <h1>🚀 Plan Upgrade Successful</h1>
              </div>

              <div class="content">
                <h1>Congratulations, #{user_name}!</h1>

                <p>Your plan has been successfully upgraded from <strong>#{old_plan_name}</strong> to <strong>#{new_plan_name}</strong>.</p>

                <div class="subscription-details" style="border-left-color: #667eea;">
                  <h3>✨ What's New with #{new_plan_name}:</h3>
                  #{"<div class='feature-list'>
                    #{feature_list_html}
                  </div>" if feature_list_html.present?}
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/settings/subscription" class="cta-button">View New Features</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your new plan?</strong> Contact us:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Enjoy your new premium features!<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_plan_downgrade_html(user_name:, new_plan_name:, old_plan_name:, effective_date:)
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Plan Downgrade</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #f8d7da;">
                <h1 style="color: #721c24;">📋 Plan Downgrade</h1>
              </div>

              <div class="content">
                <h1 style="color: #dc3545;">Hello #{user_name},</h1>

                <p>Your plan has been changed from <strong>#{old_plan_name}</strong> to <strong>#{new_plan_name}</strong>.</p>

                <div class="subscription-details" style="border-left-color: #dc3545;">
                  <div class="detail-row">
                    <span class="detail-label">📅 Effective Date:</span>
                    <span class="detail-value">#{effective_date}</span>
                  </div>
                </div>

                <p>Your new plan features will be active as of <strong>#{effective_date}</strong>.</p>

                <div class="action-section">
                  <a href="#{frontend_url}/settings/subscription" class="cta-button" style="background-color: #3498db;">View Your Plan</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your downgrade?</strong> Contact us:</p>
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

    # Text Builders
    def build_confirmation_text(user_name:, plan_name:, plan_price:, currency:, interval:, start_date:, expires_at:, features:)
      formatted_price = number_with_delimiter(plan_price)
      feature_text = features.is_a?(Hash) ? features.keys.map { |k| "  - #{k.to_s.humanize}" }.join("\n") : ""

      <<~TEXT
        Welcome to #{plan_name} Premium!

        Dear #{user_name},

        Thank you for upgrading to our #{plan_name} premium plan.

        Your Plan Details:
        - Plan: #{plan_name}
        - Price: #{currency} #{formatted_price} per #{interval}
        - Start Date: #{start_date}
        - Next Billing: #{expires_at}

        #{feature_text.present? ? "What you get with #{plan_name}:\n#{feature_text}" : ""}

        Manage Your Subscription: #{frontend_url}/settings/subscription

        Questions? Contact our support team: #{support_email}

        Welcome aboard!
        #{sender_name}
      TEXT
    end

    def build_cancellation_text(user_name:, plan_name:, expires_at:)
      <<~TEXT
        Subscription Cancelled

        Dear #{user_name},

        Your #{plan_name} subscription has been successfully cancelled.

        You will continue to have access to premium features until #{expires_at}.

        Reactivate Subscription: #{frontend_url}/settings/subscription
        Share Feedback: #{frontend_url}/feedback

        Questions? Contact us: #{support_email}

        Thank you for being part of our community.
        #{sender_name}
      TEXT
    end

    def build_payment_success_text(user_name:, plan_name:, amount:, currency:, reference:)
      formatted_amount = number_with_delimiter(amount)

      <<~TEXT
        Payment Successful

        Dear #{user_name},

        Your #{plan_name} subscription payment of #{currency} #{formatted_amount} was processed successfully.

        Reference: #{reference}

        View Subscription: #{frontend_url}/settings/subscription

        Questions about your payment? Contact us: #{support_email}

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_payment_failure_text(user_name:, plan_name:, error_message:, retry_date:)
      <<~TEXT
        Payment Issue

        Dear #{user_name},

        We encountered an issue processing your #{plan_name} subscription payment.

        Error: #{error_message}
        Next Retry: #{retry_date}

        What You Need To Do:
        1. Verify your payment method is up to date
        2. Ensure sufficient funds are available
        3. Update your payment information if needed

        Update Payment Method: #{frontend_url}/settings/payment

        Need help? Contact our support team: #{support_email}

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_renewal_reminder_text(user_name:, plan_name:, days_until_renewal:, renewal_date:, price:, currency:)
      formatted_price = number_with_delimiter(price)

      <<~TEXT
        Renewal Reminder

        Dear #{user_name},

        Your #{plan_name} premium subscription will renew in #{days_until_renewal} days on #{renewal_date}.

        Plan: #{plan_name}
        Amount: #{currency} #{formatted_price}
        Renewal Date: #{renewal_date}

        #{days_until_renewal <= 3 ? "⚠️ Your subscription is renewing soon! Please ensure your payment method is up to date." : ""}

        Manage Subscription: #{frontend_url}/settings/subscription

        Questions? Contact us: #{support_email}

        Best regards,
        #{sender_name}
      TEXT
    end

    def build_plan_upgrade_text(user_name:, new_plan_name:, old_plan_name:, features:)
      feature_text = features.is_a?(Hash) ? features.keys.map { |k| "  - #{k.to_s.humanize}" }.join("\n") : ""

      <<~TEXT
        Plan Upgrade Successful

        Dear #{user_name},

        Your plan has been successfully upgraded from #{old_plan_name} to #{new_plan_name}.

        #{feature_text.present? ? "What's New with #{new_plan_name}:\n#{feature_text}" : ""}

        View New Features: #{frontend_url}/settings/subscription

        Questions? Contact us: #{support_email}

        Enjoy your new premium features!
        #{sender_name}
      TEXT
    end

    def build_plan_downgrade_text(user_name:, new_plan_name:, old_plan_name:, effective_date:)
      <<~TEXT
        Plan Downgrade

        Dear #{user_name},

        Your plan has been changed from #{old_plan_name} to #{new_plan_name}.

        Effective Date: #{effective_date}

        Your new plan features will be active as of #{effective_date}.

        View Your Plan: #{frontend_url}/settings/subscription

        Questions? Contact us: #{support_email}

        Best regards,
        #{sender_name}
      TEXT
    end

    # Email Sending Method
    def send_email(user:, subject:, html_content:, text_content:, email_type:, subscription:)
      return false unless user.email.present?

      begin
        send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
          to: [{
            email: user.email,
            name: user.full_name
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
            'X-Entity-Ref-Type' => email_type,
            'X-Priority' => '3 (Normal)'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        result = api_instance.send_transac_email(send_smtp_email)

        log_email_sent(user.email, email_type, subscription)
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending #{email_type} to #{user.email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send #{email_type} email to #{user.email}: #{e.message}"
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

      Rails.logger.info "Premium subscription email sent: #{log_data.to_json}"
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
        .header p {
          margin: 10px 0 0;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .content h1 {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }
        .subscription-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
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
        .feature-list {
          margin: 20px 0;
        }
        .feature-list h3 {
          margin-top: 0;
        }
        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          padding: 5px 0;
        }
        .feature-icon {
          margin-right: 10px;
          font-weight: bold;
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
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #e9ecef;
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
          <p>You are receiving this email because you have a Bantuhive account.</p>

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