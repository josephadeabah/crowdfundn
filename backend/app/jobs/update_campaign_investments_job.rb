# app/jobs/update_campaign_investments_job.rb
class UpdateCampaignInvestmentsJob < ApplicationJob
  queue_as :default
  retry_on ActiveRecord::StatementTimeout, wait: 5.seconds, attempts: 3

  def perform(campaign_id)
    @campaign = EquityCampaign.find_by(id: campaign_id)
    return unless @campaign

    @start_time = Time.current
    @total_updated = 0
    @batch_metrics = []

    # Batch update all investments with single SQL query (FASTEST)
    update_investments_in_batches
    
    # Update campaign shares (separate query)
    update_campaign_shares
    
    log_performance_metrics
    
  rescue ActiveRecord::StatementTimeout => e
    Rails.logger.error "UpdateCampaignInvestmentsJob: Timeout updating campaign #{campaign_id} - #{e.message}"
    raise e # Will trigger retry
  rescue StandardError => e
    Rails.logger.error "UpdateCampaignInvestmentsJob: Error updating campaign #{campaign_id} - #{e.message}"
  ensure
    # Ensure we log even if there's an error
    log_performance_metrics if @start_time
  end

  private

  def update_investments_in_batches
    batch_size = 1000
    batch_number = 0
    
    @campaign.equity_investments.successful.find_in_batches(batch_size: batch_size) do |investments_batch|
      batch_start_time = Time.current
      
      # Build SQL update statement
      update_sql = <<~SQL
        UPDATE equity_investments 
        SET current_value = ROUND((#{@campaign.valuation.to_f} * percentage / 100), 2),
            updated_at = NOW()
        WHERE id IN (#{investments_batch.map(&:id).join(',')})
      SQL
      
      # Execute raw SQL for maximum performance
      results = ActiveRecord::Base.connection.execute(update_sql)
      batch_updated = results.cmd_tuples
      @total_updated += batch_updated
      
      batch_duration = Time.current - batch_start_time
      @batch_metrics << {
        batch_number: batch_number += 1,
        records_updated: batch_updated,
        duration: batch_duration.round(4),
        records_per_second: (batch_updated / batch_duration).round(2)
      }
      
      Rails.logger.info "Updated batch #{batch_number}: #{batch_updated} investments in #{batch_duration.round(4)}s"
    end
  end

  def update_campaign_shares
    @shares_update_start = Time.current
    @campaign.update_column(:shares_available, @campaign.public_calculate_shares_available)
    @shares_update_duration = Time.current - @shares_update_start
  end

  def log_performance_metrics
    total_duration = Time.current - @start_time
    average_batch_duration = @batch_metrics.sum { |m| m[:duration] } / @batch_metrics.size.to_f rescue 0
    total_records_per_second = (@total_updated / total_duration).round(2) rescue 0
    
    metrics = {
      campaign_id: @campaign&.id,
      total_records_updated: @total_updated,
      total_duration_seconds: total_duration.round(4),
      average_batch_duration_seconds: average_batch_duration.round(4),
      total_records_per_second: total_records_per_second,
      batch_count: @batch_metrics.size,
      shares_update_duration_seconds: @shares_update_duration&.round(4),
      batch_metrics: @batch_metrics
    }

    Rails.logger.info "UpdateCampaignInvestmentsJob Performance Metrics: #{metrics.to_json}"
    
    # You can also send these metrics to your monitoring system
    send_to_monitoring(metrics) if defined?(send_to_monitoring)
  end

  # Optional: Method to send metrics to your monitoring system
  def send_to_monitoring(metrics)
    # Example: Send to Datadog, New Relic, or your preferred monitoring service
    # StatsD.increment('campaign_investments_job.records_updated', metrics[:total_records_updated])
    # StatsD.timing('campaign_investments_job.duration', metrics[:total_duration_seconds] * 1000)
    
    # Or store in your database for historical analysis
    # PerformanceMetric.create(
    #   job_name: self.class.name,
    #   campaign_id: metrics[:campaign_id],
    #   records_processed: metrics[:total_records_updated],
    #   duration_seconds: metrics[:total_duration_seconds],
    #   created_at: Time.current
    # )
  end
end