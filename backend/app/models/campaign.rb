class Campaign < ApplicationRecord
  include InvestorReporting
  # Add optimistic locking
  self.locking_column = :lock_version
  
  belongs_to :fundraiser, class_name: 'User', foreign_key: 'fundraiser_id'
  has_many :rewards, dependent: :destroy
  has_many :updates, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_one :subaccount, dependent: :destroy 
  has_many :backers, through: :donations # assuming a Backer model related to donations
  has_many :donations, dependent: :destroy
  has_many :transfers, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_many :subscribers, through: :subscriptions, source: :user
  has_many :favorites, dependent: :destroy
  has_many :favorited_by_users, through: :favorites, source: :user
  has_many :campaign_shares, dependent: :destroy
  has_many :pledges, dependent: :destroy
  has_many :investor_documents, dependent: :destroy
  has_many :campaign_team_members, foreign_key: 'campaign_id', dependent: :destroy
  has_many :archived_campaigns, dependent: :destroy
  has_many :archived_by_users, through: :archived_campaigns, source: :user
  has_many :reports, dependent: :destroy
  has_many :mentor_assignments, dependent: :destroy
  has_many :mentors, through: :mentor_assignments
  # Add these associations to existing ones
  has_many :financial_statements, dependent: :destroy
  has_many :campaign_kpis, dependent: :destroy
  has_many :kpi_values, through: :campaign_kpis
  has_many :investor_reports, dependent: :destroy
  has_many :investor_portfolio_metrics, dependent: :nullify
  has_one :deal_room, dependent: :destroy

  has_rich_text :description

  validates :title, :description, :goal_amount, :start_date, :end_date, :currency, presence: true
  validates :goal_amount, numericality: { greater_than: 0 }
  validates :slug, uniqueness: true, presence: true

  enum :status, { active: 0, completed: 1, canceled: 2 }

  # Permissions settings
  attribute :accept_donations, :boolean, default: true
  attribute :leave_words_of_support, :boolean, default: true
  attribute :appear_in_search_results, :boolean, default: true
  attribute :suggested_fundraiser_lists, :boolean, default: true
  attribute :receive_donation_email, :boolean, default: true
  attribute :receive_daily_summary, :boolean, default: false
  attribute :is_public, :boolean, default: true

  # Promotions settings
  attribute :enable_promotions, :boolean, default: false
  attribute :schedule_promotion, :boolean, default: false
  attribute :promotion_frequency, :string, default: 'daily'
  attribute :promotion_duration, :integer, default: 1
  # Add shares_available to the database schema
  attribute :shares_available, :decimal, precision: 20, scale: 4, default: 0.0
  # Attachments for images or videos
  has_one_attached :media # Use `has_many_attached` if there are multiple files

  before_destroy :safe_purge_media
  after_initialize :set_default_status, if: :new_record?
  before_validation :generate_slug, if: -> { slug.blank? && title.present? }
  after_update :send_status_update_webhook, if: :status_changed?
  # Automatically call `update_status_based_on_date` after update
  after_update :update_status_based_on_date, if: -> { remaining_days.zero? && active? }

  # AI Analysis associations and methods
  has_many :deal_score_logs, dependent: :destroy
  scope :with_ai_analysis, -> { where.not(ai_deal_score: nil) }
  scope :high_quality_deals, -> { where("ai_deal_score >= ?", 80) }
  scope :low_risk_deals, -> { where("ai_risk_score <= ?", 30) }

  # Add neighbor configuration conditionally - ONLY if ai_embedding column exists
  if column_names.include?('ai_embedding')
    has_neighbors :ai_embedding
  end

  # Scope for archived campaigns for a specific user
  scope :archived_by, ->(user) { 
    joins(:archived_campaigns).where(archived_campaigns: { user: user }) 
  }
  # Scope for non-archived campaigns (visible in search/lists)
  scope :not_archived, -> { where(is_public: true, appear_in_search_results: true) }

  # Add this method to check if campaign has pending reports
  def has_pending_reports?
    reports.pending.exists?
  end

  def recent_reports(limit = 5)
    reports.order(created_at: :desc).limit(limit)
  end

  def to_param
    slug
  end

  # STI Configuration (replace the line 45 declaration with this)
  def self.inheritance_column
    'type'
  end

  def self.descendants
    [EquityCampaign] # Add other subclasses as needed
  end

  # Add archive-related methods
  def archive!(user, reason = nil)
    return false if archived_by_user?(user)
    
    ActiveRecord::Base.transaction do
      archived_campaigns.create!(
        user: user,
        archived_at: Time.current,
        reason: reason
      )
      
      # Update campaign permissions to hide from public
      update!(
        appear_in_search_results: false,
        suggested_fundraiser_lists: false,
        is_public: false
      )
    end
    true
  rescue => e
    Rails.logger.error "Failed to archive campaign #{id}: #{e.message}"
    false
  end

  def unarchive!(user)
    archived_campaign = archived_campaigns.find_by(user: user)
    return false unless archived_campaign
    
    ActiveRecord::Base.transaction do
      archived_campaign.destroy!
      
      # Restore campaign permissions
      update!(
        appear_in_search_results: true,
        suggested_fundraiser_lists: true,
        is_public: true
      )
    end
    true
  rescue => e
    Rails.logger.error "Failed to unarchive campaign #{id}: #{e.message}"
    false
  end

  def archived_by_user?(user)
    archived_campaigns.exists?(user: user)
  end

  def archived?
    # A campaign is considered archived if it's not public and has archive records
    !is_public && archived_campaigns.any?
  end

  def archive_info_for_user(user)
    archived_campaigns.find_by(user: user)
  end
  
  # New cancel method
  def cancel
    update!(status: :canceled)
  end

  # Add validation to prevent transfers when user is locked
  def can_transfer_funds?(direction = :outgoing)
    case direction
    when :outgoing
      # Only block outgoing transfers (withdrawals)
      return false unless fundraiser.can_make_transfers?
      return false if fundraiser.transfer_locked?
    when :incoming
      # Always allow incoming investments
      return true
    end
    true
  end

  # Update the transfer amount method to check locks
  def update_transferred_amount(new_donated_amount)
    unless can_transfer_funds?(:incoming)  # Allow incoming investments
      raise "Transfers are locked for this fundraiser"
    end
    
    # Update campaign's transferred_amount
    update!(transferred_amount: transferred_amount + new_donated_amount)
    
    # Update user's total transferred amount by summing all campaigns
    new_total = fundraiser.campaigns.sum(:transferred_amount)
    fundraiser.update!(total_transferred_amount: new_total)
  end

  # app/models/campaign.rb
  def reset_transferred_amount!(admin_user = nil)
    transaction do
      # Store the amount being reset for logging
      amount_reset = transferred_amount
      previous_user_total = fundraiser.total_transferred_amount
      
      # Reset this campaign's transferred amount
      update!(transferred_amount: 0)
      
      # Recalculate user's total transferred amount by summing all campaigns
      new_total = fundraiser.campaigns.sum(:transferred_amount)
      fundraiser.update!(total_transferred_amount: new_total)
      
      # Log the admin action if an admin performed it
      if admin_user && admin_user.admin?
        AdminAction.create!(
          admin_user: admin_user,
          target_user: fundraiser,
          campaign: self,
          action: 'reset_transferred_amount',
          metadata: {
            campaign_title: title,
            amount_reset: amount_reset,
            previous_total: previous_user_total,
            new_total: new_total
          }
        )
      end
    end
  end

  def media_attached?
    return false unless media.attached?
    
    # Check if blob record exists in database
    return false unless media.blob.present?
    
    # Check if file exists in storage
    blob_exists?(media)
  rescue Aws::S3::Errors::NoSuchKey, ActiveRecord::RecordNotFound => e
    Rails.logger.warn "Media attachment check failed for campaign #{id}: #{e.message}"
    false
  end

  def blob_exists?(attachment)
    attachment.blob.service.exist?(attachment.blob.key)
  rescue => e
    Rails.logger.error "Failed to check blob existence for campaign #{id}: #{e.message}"
    false
  end

  def safe_purge_media
    return unless media.attached?

    begin
      # First check if the file exists in storage
      if blob_exists?(media)
        # Try to purge (delete from storage and remove association)
        media.purge
      else
        # If file doesn't exist, just detach
        media.detach
      end
    rescue Aws::S3::Errors::ServiceError, ActiveRecord::RecordNotFound => e
      Rails.logger.warn "Safe purge failed for campaign #{id}: #{e.message}"
      # Ensure the association is cleared even if purge fails
      media.detach
    ensure
      # Double check the association is cleared
      media.detach if media.attached?
    end
  end

  def media_url
    return unless media_attached?

    if Rails.env.production?
      "#{ENV.fetch('SUPABASE_URL')}/storage/v1/object/public/#{ENV.fetch('SUPABASE_STORAGE_BUCKET')}/#{media.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(media)
    end
  rescue => e
    Rails.logger.error(
      "Failed to generate media URL for campaign #{id}: #{e.message}"
    )

    nil
  end

  def media_filename
    media.attached? ? media.filename.to_s : nil
  end

  # Add method to handle equity-specific calculations
  def total_equity_invested
    # Use the stored value if available, otherwise calculate it
    self[:total_equity_invested] || (is_a?(EquityCampaign) ? equity_investments.successful.sum(:amount) : 0)
  end

  # SEO methods
  def seo_title
    self[:seo_title].presence || title.truncate(60)
  end

  def seo_description
    description_text = self[:seo_description].presence || 
                      ActionView::Base.full_sanitizer.sanitize(description.to_s)
    
    # Clean up newlines, extra spaces, and truncate
    description_text
      .gsub(/\s+/, ' ')          # Replace multiple whitespace with single space
      .strip                     # Remove leading/trailing whitespace
      .truncate(155)             # Truncate to 155 characters
  end

  def canonical_url
    "#{ENV.fetch('FRONTEND_URL')}/campaign/#{slug}"
  end
  
  # Add this method to update investor metrics when valuation changes
  def update_investor_metrics_for_valuation_change(old_valuation)
    return unless valuation.present? && old_valuation.present?
    return if valuation == old_valuation
    
    # Update all investor portfolio metrics
    equity_investments.successful.distinct.pluck(:user_id).each do |user_id|
      user = User.find(user_id)
      
      # Find the specific investment for this user
      investment = equity_investments.successful.find_by(user_id: user_id)
      
      # Send email notification if investment exists
      if investment
        # Check if user has valuation update notifications enabled
        preferences = NotificationPreference.defaults_for_user(user)
        if preferences.email_notifications && preferences.enabled_for_report_type?(:valuation_updates)
          # Send email notification
          InvestorNotificationEmailService.valuation_update(
            user,
            self,
            old_valuation,
            valuation,
            investment
          )
          
          Rails.logger.info "Sent valuation update notification to investor #{user.id} (#{user.email})"
        else
          Rails.logger.info "Skipped valuation update notification for investor #{user.id} - email notifications disabled"
        end
      end
      
      # Update metrics
      InvestorPortfolioMetric.calculate_for_user(user_id)
    end
  end
  
  # Add this method to get financial performance summary
  def financial_performance_summary(periods = 4)
    financial_statements.published
                        .order(period_end: :desc)
                        .limit(periods)
                        .map do |statement|
      {
        period: "#{statement.period_type.capitalize} #{statement.period_end.year}",
        period_start: statement.period_start,
        period_end: statement.period_end,
        revenue: statement.revenue,
        net_income: statement.net_income,
        gross_margin: statement.gross_margin,
        net_margin: statement.net_margin,
        burn_rate: statement.burn_rate,
        runway_months: statement.runway_months
      }
    end
  end
  
  # Add this method to get KPI dashboard
  def kpi_dashboard
    primary_kpis = campaign_kpis.primary.includes(:kpi_values).ordered
    
    {
      primary_metrics: primary_kpis.map do |kpi|
        latest = kpi.latest_value
        {
          id: kpi.id,
          name: kpi.name,
          value: latest&.value,
          formatted_value: latest&.format_value,
          unit: kpi.unit,
          trend: kpi.trend(days: 90),
          target: kpi.target_value,
          performance_vs_target: kpi.performance_vs_target
        }
      end,
      categories: campaign_kpis.group_by(&:kpi_type).transform_values do |kpis|
        kpis.map { |kpi| { id: kpi.id, name: kpi.name, value: kpi.latest_value&.value } }
      end
    }
  end

  # app/models/campaign.rb
  def as_json(options = {})
    json = super({
      only: %i[
        id title goal_amount current_amount transferred_amount start_date end_date
        category location currency currency_code currency_symbol status
        fundraiser_id created_at updated_at valuation equity_offered minimum_investment 
        total_shares is_public appear_in_search_results slug
      ],
      methods: %i[media_url media_filename total_days remaining_days archived?]
    }.merge(options))

    # Add mentor assignments if requested
    if options[:include_mentors]
      json[:mentor_assignments] = mentor_assignments.includes(:mentor).map do |assignment|
        {
          id: assignment.id,
          status: assignment.status,
          mentor: {
            id: assignment.mentor.id,
            name: assignment.mentor.user.full_name,
            professional_title: assignment.mentor.professional_title,
            rating: assignment.mentor.rating,
            expertise: assignment.mentor.expertise_list
          },
          started_at: assignment.started_at,
          completed_at: assignment.completed_at
        }
      end
    end

    # Add archive information if user context is provided
    if options[:user]
      user_archive_info = archive_info_for_user(options[:user])
      json.merge!(
        archived_by_current_user: archived_by_user?(options[:user]),
        archive_info: user_archive_info ? {
          archived_at: user_archive_info.archived_at,
          reason: user_archive_info.reason
        } : nil
      )
    end

    # Only include equity fields for EquityCampaign instances
    if is_a?(EquityCampaign)
      json.merge!(
        shares_issued: shares_issued,
        total_equity_invested: total_equity_invested,
        shares_available: shares_available,
        percentage_raised: percentage_raised
      )
    end

    # Add KYC verification status for the fundraiser
    kyc_status = if fundraiser.latest_kyc
                   {
                     verified: fundraiser.latest_kyc.verified?,
                     status: fundraiser.latest_kyc.status,
                     kyc_type: fundraiser.latest_kyc.kyc_type,
                     verified_at: fundraiser.latest_kyc.verified_at,
                     is_expired: fundraiser.latest_kyc.expired?,
                     # Specific verification types
                     investor_verified: fundraiser.investor_kyc_verified?,
                     issuer_verified: fundraiser.issuer_kyc_verified?,
                     both_verified: fundraiser.verified_both?
                   }
                 else
                   {
                     verified: false,
                     status: 'none',
                     kyc_type: nil,
                     verified_at: nil,
                     is_expired: false,
                     investor_verified: false,
                     issuer_verified: false,
                     both_verified: false
                   }
                 end

    # Add additional fields
    json.merge!(
      type: self.class.name,
      # Add SEO fields
      seo_title: seo_title,
      seo_description: seo_description,
      canonical_url: canonical_url,
      description: description.as_json,
      total_social_media_shares: total_social_media_shares,
      donations_over_time: donations_over_time,
      media_attached: media_attached?,
      media_content_type: media_attached? ? media.content_type : nil,
      media_file_size: media_attached? ? media.byte_size : nil,
      permissions: {
        accept_donations: accept_donations,
        leave_words_of_support: leave_words_of_support,
        appear_in_search_results: appear_in_search_results,
        suggested_fundraiser_lists: suggested_fundraiser_lists,
        receive_donation_email: receive_donation_email,
        receive_daily_summary: receive_daily_summary,
        is_public: is_public
      },
      promotions: {
        enable_promotions: enable_promotions,
        schedule_promotion: schedule_promotion,
        promotion_frequency: promotion_frequency,
        promotion_duration: promotion_duration
      },
      rewards: rewards,
      updates: updates,
      comments: comments,
      investor_documents: investor_documents.map(&:as_json),
      required_documents: required_documents.map(&:as_json),
      team_members: campaign_team_members.includes(:user).map do |member|
        {
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role,
          title: member.title,
          equity_percentage: member.equity_percentage,
          description: member.description,
          avatar_url: member.avatar_url,
          user: if member.user
                  {
                    id: member.user.id,
                    email: member.user.email,
                    profile: {
                      first_name: member.user.profile&.first_name,
                      last_name: member.user.profile&.last_name
                    },
                    # Add KYC status for team member users too
                    kyc_verified: member.user.latest_kyc&.verified? || false,
                    kyc_status: member.user.latest_kyc&.status || 'none'
                  }
                end
        }
      end,
      fundraiser: {
        id: fundraiser.id,
        name: fundraiser.full_name,
        currency: fundraiser.currency,
        currency_symbol: fundraiser.currency_symbol,
        profile: fundraiser.profile,
        # Include KYC verification status in fundraiser object
        kyc_verified: kyc_status[:verified],
        kyc_status: kyc_status[:status],
        kyc_type: kyc_status[:kyc_type],
        kyc_verified_at: kyc_status[:verified_at],
        kyc_expired: kyc_status[:is_expired],
        investor_kyc_verified: kyc_status[:investor_verified],
        issuer_kyc_verified: kyc_status[:issuer_verified],
        both_kyc_verified: kyc_status[:both_verified]
      },
      # Also include KYC status at the campaign level for easy access
      fundraiser_kyc_verified: kyc_status[:verified],
      fundraiser_kyc_status: kyc_status[:status],
      fundraiser_kyc_type: kyc_status[:kyc_type],
      total_days: total_days,
      remaining_days: remaining_days,
      favorited: options[:user] ? options[:user].favorited_campaigns.include?(self) : false
    )
  end

  def total_days
    return 0 unless start_date && end_date

    (end_date.to_date - start_date.to_date).to_i.clamp(0, Float::INFINITY)
  end

  def remaining_days
    return 0 if canceled?
    return 0 unless end_date

    (end_date.to_date - Date.current).to_i.clamp(0, Float::INFINITY)
  end

  def update_status_based_on_date
    return if canceled? # Skip if already canceled

    update!(status: :completed)
  end

  # Calculate the total number of unique donors (authenticated + anonymous)
  def total_donors
    authenticated_donors = donations.where(status: 'successful').where.not(user_id: nil).distinct.count(:user_id)
    anonymous_donors = donations.where(status: 'successful', user_id: nil).count
    authenticated_donors + anonymous_donors
  end

  def performance_percentage
    return 0 if goal_amount.zero?

    (transferred_amount / goal_amount.to_f * 100).round(2)
  end

  def send_status_update_webhook
    CampaignWebhookService.new(self).send_status_update
  end

  def update_fundraiser_leaderboard
    total_raised = donations.successful.sum(:amount) # Adjust the field name as needed
    FundraiserLeaderboardEntry.update_leaderboard(fundraiser, total_raised)
  end

  def total_social_media_shares
    campaign_shares.count
  end

  def donations_over_time
    # Define the start and end of the current month
    start_of_month = Time.zone.now.beginning_of_month
    end_of_month = Time.zone.now.end_of_month

    # Fetch successful donations within the current month and group them by day
    donations = self.donations
                    .where(status: 'successful', created_at: start_of_month..end_of_month)
                    .group_by_day(:created_at, format: '%Y-%m-%d')
                    .sum(:amount)

    # Ensure all days in the current month are included, even if there are no donations
    (start_of_month.to_date..end_of_month.to_date).each do |date|
      formatted_date = date.strftime('%Y-%m-%d')
      donations[formatted_date] ||= 0
    end

    donations.sort.to_h
  end

  def required_documents
    investor_documents.required
  end

  def cleanup_associations
    # Handle points for donations
    donations.find_each { |d| d.points.update_all(donation_id: nil) }
    
    # Handle points for equity investments if this is an equity campaign
    if is_a?(EquityCampaign)
      equity_investments.find_each { |i| i.points.update_all(equity_investment_id: nil) }
    end
    
    # Clean up rich text associations
    description.body.attachments.each(&:purge) if description.present?
    
    # Purge any other attachments
    media.purge_later if media.attached?
    
    # Clean up ActiveStorage blobs for other attachments
    investor_documents.each do |doc|
      doc.files.each { |file| file.purge_later }
    end
  end

  # AI Analysis Methods
  def comprehensive_ai_analysis_present?
    ai_deal_score.present? && ai_risk_score.present? && ai_sentiment.present?
  end

  def latest_comprehensive_analysis
    deal_score_logs.recent.first
  end

  def ai_sentiment_analysis
    return nil unless ai_sentiment.present?
    
    {
      sentiment: ai_sentiment,
      color: sentiment_color,
      icon: sentiment_icon
    }
  end

  def ai_team_assessment_data
    return nil unless ai_team_assessment.present?
    
    {
      assessment: ai_team_assessment,
      color: team_assessment_color,
      description: team_assessment_description
    }
  end

  def ai_market_analysis
    return nil unless ai_market_opportunity.present?
    
    {
      opportunity: ai_market_opportunity,
      color: market_opportunity_color,
      potential: market_opportunity_potential
    }
  end

  def investment_thesis
    latest_analysis = latest_comprehensive_analysis
    return nil unless latest_analysis
    
    latest_analysis.investment_thesis
  end

  def upside_downside_analysis
    latest_analysis = latest_comprehensive_analysis
    return nil unless latest_analysis
    
    {
      upside: latest_analysis.upside_potential || [],
      downside: latest_analysis.downside_risks || [],
      balance_score: calculate_risk_reward_balance
    }
  end

  def similar_deals_with_analysis(limit: 5)
    AI::SimilarDealsService.new(self).find_similar(limit: limit).map do |similar|
      {
        campaign: similar[:campaign],
        similarity_score: similar[:similarity_score],
        common_features: similar[:common_features],
        analysis_comparison: compare_with_similar_deal(similar[:campaign])
      }
    end
  end

  def ai_analysis_present?
    ai_deal_score.present? && ai_risk_score.present?
  end

  def latest_ai_analysis
    deal_score_logs.recent.first
  end

  def embedding_available?
    respond_to?(:ai_embedding) && ai_embedding.present?
  end
  
  def update_ai_embedding
    AI::DealScoringService.generate_embeddings(self) if embedding_available?
  end

  def risk_assessment
    return nil unless ai_analysis_present?
    
    {
      score: ai_risk_score,
      category: ai_risk_category,
      level: risk_level,
      color: risk_color
    }
  end

  def deal_quality
    return nil unless ai_analysis_present?
    
    {
      score: ai_deal_score,
      grade: deal_grade,
      color: deal_color
    }
  end

  def similar_deals(limit: 5)
    AI::SimilarDealsService.new(self).find_similar(limit: limit)
  end

  private

  def enqueue_media_cleanup
    MediaCleanupJob.perform_later(media.blob.id) if media.attached?
  rescue => e
    Rails.logger.error "Failed to enqueue media cleanup for campaign #{id}: #{e.message}"
  end

  def generate_slug
    # Truncate title to avoid overly long slugs
    base = title.parameterize.truncate(80, omission: '')
    self.slug = base

    counter = 1
    while Campaign.exists?(slug: slug) &&
          (new_record? || Campaign.where.not(id: id).exists?(slug: slug))
      self.slug = "#{base}-#{counter}"
      counter += 1
    end
  end

  def set_default_status
    self.status ||= :active
  end

  def risk_level
    case ai_risk_score
    when 0..20 then 'Very Low'
    when 21..40 then 'Low'
    when 41..60 then 'Medium'
    when 61..80 then 'High'
    else 'Very High'
    end
  end

  def risk_color
    case ai_risk_score
    when 0..20 then '#10B981' # green
    when 21..40 then '#34D399' # light green
    when 41..60 then '#FBBF24' # yellow
    when 61..80 then '#F59E0B' # orange
    else '#EF4444' # red
    end
  end

  def deal_grade
    case ai_deal_score
    when 90..100 then 'A+'
    when 80..89 then 'A'
    when 70..79 then 'B'
    when 60..69 then 'C'
    when 50..59 then 'D'
    else 'F'
    end
  end

  def deal_color
    case ai_deal_score
    when 80..100 then '#10B981' # green
    when 60..79 then '#FBBF24' # yellow
    when 40..59 then '#F59E0B' # orange
    else '#EF4444' # red
    end
  end

  def sentiment_color
    case ai_sentiment
    when 'positive' then '#10B981'
    when 'neutral' then '#6B7280'
    when 'negative' then '#EF4444'
    else '#6B7280'
    end
  end

  def sentiment_icon
    case ai_sentiment
    when 'positive' then '👍'
    when 'neutral' then '😐'
    when 'negative' then '👎'
    else '❓'
    end
  end

  def team_assessment_color
    case ai_team_assessment
    when 'strong' then '#10B981'
    when 'adequate' then '#F59E0B'
    when 'weak' then '#EF4444'
    else '#6B7280'
    end
  end

  def team_assessment_description
    case ai_team_assessment
    when 'strong' then 'Experienced team with relevant background'
    when 'adequate' then 'Competent team with some relevant experience'
    when 'weak' then 'Team may lack necessary experience'
    else 'Team assessment not available'
    end
  end

  def market_opportunity_color
    case ai_market_opportunity
    when 'large' then '#10B981'
    when 'medium' then '#F59E0B'
    when 'small' then '#EF4444'
    else '#6B7280'
    end
  end

  def market_opportunity_potential
    case ai_market_opportunity
    when 'large' then 'Significant market potential'
    when 'medium' then 'Moderate market opportunity'
    when 'small' then 'Limited market size'
    else 'Market assessment not available'
    end
  end

  def calculate_risk_reward_balance
    return 0 unless ai_deal_score && ai_risk_score
    
    # Simple risk-reward balance calculation
    reward_factor = ai_deal_score / 100.0
    risk_factor = (100 - ai_risk_score) / 100.0
    (reward_factor * risk_factor * 100).round(2)
  end

  def compare_with_similar_deal(other_campaign)
    {
      deal_score_difference: (ai_deal_score || 0) - (other_campaign.ai_deal_score || 0),
      risk_score_difference: (ai_risk_score || 0) - (other_campaign.ai_risk_score || 0),
      performance_comparison: performance_percentage - (other_campaign.performance_percentage || 0)
    }
  end
end