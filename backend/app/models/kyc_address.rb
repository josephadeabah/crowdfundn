# app/models/kyc_address.rb
class KycAddress < ApplicationRecord
  belongs_to :kyc

  enum :address_type, {
    residential: 'residential',
    mailing: 'mailing',
    business: 'business'
  }, default: 'residential'


  validates :address_type, presence: true
  validates :address_type, uniqueness: { scope: :kyc_id }
  validates :street, :city, :country, presence: true

  def to_frontend_format
    {
      id: id,
      address_type: address_type,
      street: street,
      city: city,
      state: state,
      postal_code: postal_code,
      country: country,
      is_primary: is_primary,
      created_at: created_at,
      updated_at: updated_at
    }
  end

  def full_address
    [street, city, state, postal_code, country].compact.join(', ')
  end
end