// server/controllers/calendarController.js
const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const ical = require('node-ical');
const moment = require('moment');

const getOnlineCalendarEvents = async (url, type) => {
    try {
        const events = await ical.async.fromURL(url);
        const formattedEvents = [];
        const majorBuddhistKeywords = ['บูชา', 'พรรษา', 'ขึ้น 15 ค่ำ', 'แรม 15 ค่ำ', 'ดับ', 'เพ็ญ'];
        const minorBuddhistKeywords = ['ขึ้น 8 ค่ำ', 'แรม 8 ค่ำ'];

        for (const key in events) {
            if (Object.prototype.hasOwnProperty.call(events, key)) {
                const event = events[key];
                if (event.type === 'VEVENT') {
                    let eventType = type;
                    if (type === 'buddhist') {
                       if (majorBuddhistKeywords.some(keyword => event.summary.includes(keyword))) {
                           eventType = 'budduddhist-major';
                       } else if (minorBuddhistKeywords.some(keyword => event.summary.includes(keyword))) {
                           eventType = 'buddhist-minor';
                       }
                    }
                    formattedEvents.push({
                        _id: event.uid, title: event.summary, start: event.start,
                        end: event.end || event.start, allDay: true, type: eventType,
                    });
                }
            }
        }
        return formattedEvents;
    } catch (error) {
        console.error(`[Server] Error fetching calendar from ${url}:`, error.message);
        return [];
    }
};

const getEvents = asyncHandler(async (req, res) => {
    const userEvents = await Event.find({ user: req.user.id });
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const thaiHolidaysUrl = 'https://calendar.google.com/calendar/ical/th.th%23holiday%40group.v.calendar.google.com/public/basic.ics';
    const wanPhraUrlCurrentYear = `https://www.myhora.com/ical/ical_wanphra.php?year=${currentYear}`;
    const wanPhraUrlNextYear = `https://www.myhora.com/ical/ical_wanphra.php?year=${nextYear}`;
    const [holidaysData, buddhistDaysCurrent, buddhistDaysNext] = await Promise.all([
        getOnlineCalendarEvents(thaiHolidaysUrl, 'holiday'),
        getOnlineCalendarEvents(wanPhraUrlCurrentYear, 'buddhist'),
        getOnlineCalendarEvents(wanPhraUrlNextYear, 'buddhist'),
    ]);
    const allPublicEvents = [...holidaysData, ...buddhistDaysCurrent, ...buddhistDaysNext];
    const allEvents = [...userEvents, ...allPublicEvents];
    res.status(200).json(allEvents);
});

const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, allDay } = req.body;
  if (!title || !start) { res.status(400); throw new Error('Please provide title and start date'); }
  const event = await Event.create({
    user: req.user.id, title, start: new Date(start),
    end: end ? new Date(end) : new Date(start),
    allDay: allDay || false, type: 'user',
  });
  res.status(201).json(event);
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.user.toString() !== req.user.id) { res.status(401); throw new Error('Not authorized'); }
  await event.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getEvents, createEvent, deleteEvent };