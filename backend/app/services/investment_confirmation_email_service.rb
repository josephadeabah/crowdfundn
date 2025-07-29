# app/services/investment_confirmation_email_service.rb
class InvestmentConfirmationEmailService
  def self.send_confirmation_email(investment, certificate_url)
    user = investment.user
    campaign = investment.campaign
    
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [{ email: user.email, name: user.full_name }],
      template_id: 2, # Different template for investments
      params: {
        name: user.full_name,
        amount: investment.amount,
        shares: investment.shares,
        percentage: investment.percentage,
        company_name: campaign.company_name,
        certificate_url: certificate_url
      },
      # ... rest of email configuration ...
    )
    
    # Send email using Sendinblue API
    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
    api_instance.send_transac_email(send_smtp_email)
  end
end