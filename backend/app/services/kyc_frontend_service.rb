# app/services/kyc_frontend_service.rb
class KycFrontendService
  def self.format_for_frontend(kyc)
    return nil unless kyc
    
    base_data = {
      id: kyc.id,
      reference: kyc.reference,
      kyc_type: kyc.kyc_type,
      status: kyc.status,
      verification_type: kyc.verification_type,
      id_number: kyc.id_number,
      id_expiry_date: kyc.id_expiry_date,
      date_of_birth: kyc.date_of_birth,
      nationality: kyc.nationality,
      occupation: kyc.occupation,
      source_of_funds: kyc.source_of_funds,
      risk_level: kyc.risk_level,
      business_name: kyc.business_name,
      business_registration_number: kyc.business_registration_number,
      business_tax_id: kyc.business_tax_id,
      business_industry: kyc.business_industry,
      business_established_date: kyc.business_established_date,
      # ADD DECLARATION FIELDS HERE
      accredited_investor: kyc.accredited_investor || false,
      nominee_agreement_accepted: kyc.nominee_agreement_accepted || false,
      risk_acknowledgment: kyc.risk_acknowledgment || false,
      terms_accepted: kyc.terms_accepted || false,
      data_consent: kyc.data_consent || false,
      addresses: kyc.kyc_addresses.map { |a| format_address(a) },
      documents: kyc.kyc_documents.map { |d| format_document(d) },
      # ADD MENTOR APPLICATION HERE
      mentor_application: kyc.mentor_application ? format_mentor_application(kyc.mentor_application) : nil,
      signature_data: kyc.signature_data,
      investor_signature_data: kyc.investor_signature_data,
      issuer_signature_data: kyc.issuer_signature_data,
      signature_image_url: kyc.signature_image_url,
      issuer_signature_url: kyc.issuer_signature_url,
      issuer_accepted_terms: kyc.issuer_accepted_terms,
      signature_completed_at: kyc.signature_completed_at,
      issuer_signature_completed_at: kyc.issuer_signature_completed_at,
      verified_at: kyc.verified_at,
      verified_by: kyc.verified_by&.full_name,
      rejection_reason: kyc.rejection_reason,
      created_at: kyc.created_at,
      updated_at: kyc.updated_at,
      user: format_user(kyc.user)
    }
    
    # Add upgrade information if this is an upgrade
    if kyc.is_upgrade && kyc.upgraded_from_type.present?
      base_data[:upgrade_info] = {
        is_upgrade: true,
        upgraded_from: kyc.upgraded_from_type,
        superseded_at: kyc.superseded_at,
        superseded_by_type: kyc.superseded_by_type
      }
    end
    
    base_data
  end

  def self.format_mentor_application(mentor_app)
    return nil unless mentor_app
    
    {
      id: mentor_app.id,
      tracking_id: mentor_app.tracking_id,
      professional_title: mentor_app.professional_title,
      years_of_experience: mentor_app.years_of_experience,
      industry_expertise: mentor_app.industry_expertise || [],
      previous_mentoring: mentor_app.previous_mentoring,
      linkedin_profile: mentor_app.linkedin_profile,
      resume_url: mentor_app.resume_url,
      mentorship_approach: mentor_app.mentorship_approach,
      availability: mentor_app.availability,
      status: mentor_app.status,
      submitted_at: mentor_app.submitted_at,
      reviewed_at: mentor_app.reviewed_at,
      review_notes: mentor_app.review_notes,
      created_at: mentor_app.created_at,
      updated_at: mentor_app.updated_at,
      user_id: mentor_app.user_id,
      kyc_id: mentor_app.kyc_id,
      mentor_id: mentor_app.mentor_id
    }
  end

  def self.format_address(address)
    return nil unless address
    
    {
      id: address.id,
      address_type: address.address_type,
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_primary: address.is_primary,
      full_address: address.full_address,
      created_at: address.created_at,
      updated_at: address.updated_at
    }
  end

  def self.format_document(document)
    return nil unless document
    
    {
      id: document.id,
      document_type: document.document_type,
      file_name: document.file_name,
      file_url: document.file_url,
      verification_status: document.verification_status,
      rejection_reason: document.rejection_reason,
      verified_at: document.verified_at,
      verified_by: document.verified_by&.full_name,
      created_at: document.created_at,
      updated_at: document.updated_at
    }
  end

  def self.format_user(user)
    return nil unless user
    
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      fundraiser_info: user.campaigns.any? ? {
        has_campaigns: true,
        total_campaigns: user.campaigns.count,
        active_campaigns: user.campaigns.active.count,
        campaign_titles: user.campaigns.pluck(:title)
      } : {
        has_campaigns: false
      }
    }
  end

  def self.create_from_frontend(user, frontend_data)
    kyc = user.kycs.build(
      kyc_type: frontend_data[:kyc_type],
      verification_type: frontend_data[:verification_type],
      id_number: frontend_data[:id_number],
      id_expiry_date: frontend_data[:id_expiry_date],
      date_of_birth: frontend_data[:date_of_birth],
      nationality: frontend_data[:nationality],
      occupation: frontend_data[:occupation],
      source_of_funds: frontend_data[:source_of_funds],
      business_name: frontend_data[:business_name],
      business_registration_number: frontend_data[:business_registration_number],
      business_tax_id: frontend_data[:business_tax_id],
      business_industry: frontend_data[:business_industry],
      business_established_date: frontend_data[:business_established_date],
      signature_data: frontend_data[:signature_data],
      investor_signature_data: frontend_data[:investor_signature_data],
      issuer_signature_data: frontend_data[:issuer_signature_data],
      issuer_accepted_terms: frontend_data[:issuer_accepted_terms],
      # ADD DECLARATION FIELDS HERE
      accredited_investor: frontend_data[:accredited_investor] || false,
      nominee_agreement_accepted: frontend_data[:nominee_agreement_accepted] || false,
      risk_acknowledgment: frontend_data[:risk_acknowledgment] || false,
      terms_accepted: frontend_data[:terms_accepted] || false,
      data_consent: frontend_data[:data_consent] || false,
      # Add upgrade fields if present
      upgraded_from_type: frontend_data[:upgraded_from_type],
      is_upgrade: frontend_data[:is_upgrade]
    )

    # Create addresses
    if frontend_data[:addresses]
      frontend_data[:addresses].each do |address_data|
        kyc.kyc_addresses.build(
          address_type: address_data[:address_type],
          street: address_data[:street],
          city: address_data[:city],
          state: address_data[:state],
          postal_code: address_data[:postal_code],
          country: address_data[:country],
          is_primary: address_data[:is_primary]
        )
      end
    end

    # Create mentor application if present
    if frontend_data[:mentor_application_attributes]
      kyc.build_mentor_application(
        professional_title: frontend_data[:mentor_application_attributes][:professional_title],
        years_of_experience: frontend_data[:mentor_application_attributes][:years_of_experience],
        industry_expertise: frontend_data[:mentor_application_attributes][:industry_expertise] || [],
        previous_mentoring: frontend_data[:mentor_application_attributes][:previous_mentoring],
        linkedin_profile: frontend_data[:mentor_application_attributes][:linkedin_profile],
        resume_url: frontend_data[:mentor_application_attributes][:resume_url],
        mentorship_approach: frontend_data[:mentor_application_attributes][:mentorship_approach],
        availability: frontend_data[:mentor_application_attributes][:availability]
      )
      kyc.mentor_application.user = user
    end

    kyc
  end

  # New method to format upgrade eligibility
  def self.format_upgrade_eligibility(user)
    return nil unless user
    
    latest_kyc = user.latest_kyc
    can_upgrade = user.can_upgrade_to_both?
    
    {
      can_upgrade: can_upgrade,
      current_type: latest_kyc&.kyc_type,
      upgrade_type: 'both',
      message: can_upgrade ? 
        "You can upgrade from #{latest_kyc.kyc_type} to full platform access" :
        latest_kyc ? "You already have #{latest_kyc.kyc_type == 'both' ? 'full platform access' : latest_kyc.kyc_type} access" : "No KYC verification found"
    }
  end
end