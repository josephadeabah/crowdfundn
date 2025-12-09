# app/jobs/send_meeting_reminders_job.rb
class SendMeetingRemindersJob < ApplicationJob
  queue_as :default

  def perform
    # Find meetings starting in 1 hour
    upcoming_meetings = DealRoomMeeting
      .where(status: :scheduled)
      .where('start_time BETWEEN ? AND ?', Time.current, 1.hour.from_now)
    
    upcoming_meetings.each do |meeting|
      meeting.send_reminders
    end
  end
end