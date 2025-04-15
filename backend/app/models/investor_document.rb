# app/models/investor_document.rb
class InvestorDocument < ApplicationRecord
  belongs_to :user
  
  DOCUMENT_TYPES = %w[accreditation_form id_proof tax_document agreement].freeze
  
  validates :document_type, inclusion: { in: DOCUMENT_TYPES }
  has_one_attached :file
end