const schedule = require('node-schedule');
const Sale = require('../models/Sale');
// const { getThaiBuddhistDate } = require('../utils/holyDayHelper'); // tạm thời comment ra để server chạy được

const checkReminders = () => {
  console.log('Checking for payment reminders...');
  // Logic to check for reminders will be added here in the future.
};

/**
 * Starts the scheduler to check for reminders daily.
 */
const start = () => {
  // Schedule to run every day at 9:00 AM
  schedule.scheduleJob('0 9 * * *', () => {
    console.log('Running daily reminder check...');
    checkReminders();
  });
  console.log('Notification scheduler started. Will check for reminders daily.');
};

// Export an object with the start function
module.exports = {
  start,
};
