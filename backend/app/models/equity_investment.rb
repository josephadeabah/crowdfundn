class EquityInvestment < Donation
  belongs_to :campaign, class_name: 'EquityCampaign'
  has_many :pledges, dependent: :destroy

  validates :shares, :percentage, presence: true, numericality: { greater_than: 0 }
  
  before_validation :calculate_shares_and_percentage, on: :create
  before_create :generate_certificate_number
  before_create :set_investment_date
  after_commit :update_campaign_equity, on: [:create, :update], if: :saved_change_to_amount?
  after_commit :generate_certificate_after_commit, on: [:create, :update], if: :should_generate_certificate?
  after_commit :update_investor_portfolios, on: [:create, :update], if: :successful?

  def current_value
    (campaign.valuation * percentage / 100).round(2)
  end

  def total_returns
    (current_value - amount).round(2)
  end

  def roi
    return 0 if amount.zero?
    ((total_returns / amount) * 100).round(2)
  end

  def self.total_invested(campaign_id)
    where(campaign_id: campaign_id, status: 'successful').sum(:amount)
  end

  def certificate_url
    return unless certificate.attached?
    Rails.application.routes.url_helpers.url_for(certificate)
  end

  def certificate_present?
    certificate.attached? && certificate.blob.present?
  end

  private

  def calculate_shares_and_percentage
    return unless campaign && amount.present? && amount.positive?

    total_equity_value = (campaign.valuation.to_f * campaign.equity_offered.to_f / 100)
    self.percentage = ((amount / total_equity_value) * 100).round(8)
    
    total_available_shares = (campaign.equity_offered.to_f / 100) * campaign.total_shares.to_f
    self.shares = (percentage / 100 * total_available_shares).round(4)
  end

  def generate_certificate_number
    self.certificate_number ||= "BHV-#{SecureRandom.alphanumeric(10).upcase}"
  end

  def set_investment_date
    self.investment_date ||= Date.current
  end

  def update_campaign_equity
    campaign.update_shares_available
  end

  def should_generate_certificate?
    successful? && certificate_number.present? && 
    (certificate.blank? || certificate_needs_update?)
  end

  def generate_certificate_after_commit
    if InvestmentCertificateService.generate_certificate(self)
      Rails.logger.info "Successfully generated certificate for investment #{id}"
    else
      Rails.logger.error "Failed to generate certificate for investment #{id}"
      CertificateGenerationJob.set(wait: 5.minutes).perform_later(id)
    end
  end

  def certificate_needs_update?
    saved_change_to_amount? || saved_change_to_shares? || saved_change_to_percentage? ||
    saved_change_to_certificate_number? || certificate.blob.blank?
  end

  def update_investor_portfolios
    campaign.donations.investments.successful.each do |inv|
      InvestmentUpdateJob.perform_later(inv.id)
    end
  end
end