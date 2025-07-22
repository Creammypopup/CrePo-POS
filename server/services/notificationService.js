const axios = require('axios');
const schedule = require('node-schedule');
const Event = require('../models/Event');
const { startOfTomorrow, endOfTomorrow } = require('date-fns');

/**
 * Sends a notification message to a LINE Notify group.
 * @param {string} message The message to be sent.
 */
const sendLineNotify = async (message) => {
  const token = process.env.LINE_NOTIFY_TOKEN;
  if (!token) {
    console.error('LINE Notify token not found in .env file. Skipping notification.');
    return;
  }

  try {
    await axios.post('https://notify-api.line.me/api/notify', `message=${message}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log(`LINE notification sent: "${message}"`);
  } catch (error) {
    console.error('Error sending LINE notification:', error.response ? error.response.data : error.message);
  }
};

/**
 * This function sets up recurring jobs to check for upcoming events
 * and send reminders. This is the function that was missing.
 */
const scheduleReminders = () => {
  console.log('Notification scheduler started. Will check for reminders daily.');

  // Schedule a job to run every day at 8:00 AM
  schedule.scheduleJob('0 8 * * *', async () => {
    console.log('Running daily check for tomorrow\'s events...');

    try {
      const tomorrowStart = startOfTomorrow();
      const tomorrowEnd = endOfTomorrow();

      const upcomingEvents = await Event.find({
        start: {
          $gte: tomorrowStart,
          $lt: tomorrowEnd,
        },
        isHoliday: { $ne: true } // Don't send reminders for holidays
      });

      if (upcomingEvents.length > 0) {
        let reminderMessage = 'แจ้งเตือนกิจกรรมวันพรุ่งนี้:\n';
        upcomingEvents.forEach(event => {
          reminderMessage += `- ${event.title}\n`;
        });
        await sendLineNotify(reminderMessage);
      } else {
        console.log('No events scheduled for tomorrow.');
      }

    } catch (error) {
      console.error('Error fetching events for reminders:', error);
    }
  });
};

module.exports = { 
  sendLineNotify,
  scheduleReminders // <-- Exporting the missing function
};