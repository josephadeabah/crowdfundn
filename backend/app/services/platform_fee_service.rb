class PlatformFeeService
  def self.transfer_platform_fees
    # Sum up all unprocessed platform fees for successful donations and equity investments
    total_donation_fee = Donation.successful.where(processed: false).sum(:platform_fee)
    total_equity_fee = EquityInvestment.successful.where(processed: false).sum(:platform_fee)
    total_platform_fee = total_donation_fee + total_equity_fee

    Rails.logger.info "Platform fee calculation: Donations=#{total_donation_fee}, Equity=#{total_equity_fee}, Total=#{total_platform_fee}"

    if total_platform_fee >= 200
      # Transfer the total platform fee to the company's subaccount
      paystack_service = PaystackService.new
      response = paystack_service.initiate_transfer(
        amount: total_platform_fee.round,
        currency: 'GHS',
        recipient: 'RCP_pjyf6vw02jmif6j', # Your company's recipient account
        reason: 'Platform fee accumulation transfer'
      )

      if response[:status] == true
        # Mark the successful donations & investments as processed
        Donation.successful.where(processed: false).update_all(processed: true)
        EquityInvestment.successful.where(processed: false).update_all(processed: true)
        
        Rails.logger.info "Successfully transferred #{total_platform_fee.round} to company recipient. Marked records as processed."
      else
        Rails.logger.error "Transfer failed: #{response[:message]}"
      end
    else
      Rails.logger.info "Total platform fee (#{total_platform_fee.round}) is less than 200, transfer will not happen."
    end
    
    total_platform_fee
  end

  # Helper method to get detailed breakdown of unprocessed fees
  def self.unprocessed_fees_breakdown
    {
      donations: {
        count: Donation.successful.where(processed: false).count,
        total_fee: Donation.successful.where(processed: false).sum(:platform_fee),
        records: Donation.successful.where(processed: false).pluck(:id, :amount, :platform_fee)
      },
      equity_investments: {
        count: EquityInvestment.successful.where(processed: false).count,
        total_fee: EquityInvestment.successful.where(processed: false).sum(:platform_fee),
        records: EquityInvestment.successful.where(processed: false).pluck(:id, :amount, :platform_fee)
      },
      total_unprocessed_fee: Donation.successful.where(processed: false).sum(:platform_fee) + 
                            EquityInvestment.successful.where(processed: false).sum(:platform_fee)
    }
  end

  # Method to manually process specific records
  def self.process_specific_records(donation_ids: [], equity_investment_ids: [])
    total_fee = 0
    
    if donation_ids.any?
      donations = Donation.successful.where(processed: false, id: donation_ids)
      total_fee += donations.sum(:platform_fee)
    end
    
    if equity_investment_ids.any?
      equity_investments = EquityInvestment.successful.where(processed: false, id: equity_investment_ids)
      total_fee += equity_investments.sum(:platform_fee)
    end

    if total_fee > 0
      paystack_service = PaystackService.new
      response = paystack_service.initiate_transfer(
        amount: total_fee.round,
        currency: 'GHS',
        recipient: 'RCP_pjyf6vw02jmif6j',
        reason: 'Manual platform fee transfer'
      )

      if response[:status] == true
        donations.update_all(processed: true) if donation_ids.any?
        equity_investments.update_all(processed: true) if equity_investment_ids.any?
        
        Rails.logger.info "Successfully manually transferred #{total_fee.round}. Processed #{donations.count} donations and #{equity_investments.count} equity investments."
        return true
      else
        Rails.logger.error "Manual transfer failed: #{response[:message]}"
        return false
      end
    else
      Rails.logger.info "No unprocessed fees found for the specified records."
      return false
    end
  end
end