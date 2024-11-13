# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

every 1.day, at: '14:00' do
    runner "Campaign.archive_expired_campaigns"
end

every :day, at: '12:00 am' do
    runner "TransferPlatformFeeJob.perform_now"
end

# Run [whenever --update-crontab] command to update your crontab with the schedule.
  

# Learn more: http://github.com/javan/whenever
