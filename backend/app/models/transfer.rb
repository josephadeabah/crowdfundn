class Transfer < ApplicationRecord
  belongs_to :user
  belongs_to :campaign, optional: true

  validates :recipient_code, presence: true
  validates :bank_name, :account_number, :amount, :transfer_code, :reference, presence: true

  # Add validation to ensure campaign exists if campaign_id is present
  # validate :campaign_exists, if: -> { campaign_id.present? }

  # private

  # def campaign_exists
  #   errors.add(:campaign, "does not exist") unless Campaign.exists?(campaign_id)
  # end
end
