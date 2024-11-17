class DonationSuccessJob < ApplicationJob
  queue_as :default

  def perform(donation_id, user_data)
    # Find the donation by its ID
    donation = Donation.find(donation_id)
    # Assuming donation verification and other logic goes here
    response = PaystackService.new.verify_transaction(donation.transaction_reference)

    unless response[:status]
      raise "Transaction verification failed for reference #{donation.transaction_reference}"
    end

    transaction_status = response.dig(:data, :status)
    if transaction_status == 'success'
      gross_amount = response.dig(:data, :amount).to_f / 100
      net_amount = gross_amount * 0.985
      donation.update!(status: 'successful', gross_amount: gross_amount, net_amount: net_amount, amount: net_amount)

      Balance.create!(
        amount: gross_amount - net_amount,
        description: "Platform fee for donation #{donation.id}",
        status: 'pending'
      )

      campaign = donation.campaign
      campaign.update!(
        current_amount: campaign.donations.successful.sum(:net_amount)
      )

      # Send the success email using the UserMailer
      UserMailer.charge_success_email(user_data, donation).deliver_later
    else
      donation.update!(status: transaction_status)
      raise "Transaction failed with status: #{transaction_status}"
    end
  end
end
