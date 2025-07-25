const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const ical = require('node-ical');

const getOnlineCalendarEvents = async (url, type, color) => {
    try {
        const events = await ical.async.fromURL(url);
        const formattedEvents = [];
        const majorBuddhistKeywords = ['บูชา', 'พรรษา', 'วิสาขบูชา', 'มาฆบูชา', 'อาสาฬหบูชา'];

        for (const key in events) {
            if (Object.prototype.hasOwnProperty.call(events, key)) {
                const event = events[key];
                if (event.type === 'VEVENT') {
                    
                    let isMajor = false;
                    // **ปรับปรุงการเช็ควันพระใหญ่:**
                    // วันพระใหญ่จะมีชื่อเฉพาะ ส่วนวันพระเล็กจะชื่อว่า "วันพระ" เฉยๆ
                    if (type === 'buddhist') {
                       isMajor = majorBuddhistKeywords.some(keyword => event.summary.includes(keyword));
                    }

                    formattedEvents.push({
                        _id: event.uid,
                        title: event.summary,
                        start: event.start,
                        end: event.end || event.start,
                        allDay: true,
                        type: type,
                        color: color,
                        isMajor: isMajor, // ส่ง isMajor ไปให้ Client
                    });
                }
            }
        }
        return formattedEvents;
    } catch (error) {
        console.error(`Error fetching calendar from ${url}:`, error);
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
      getOnlineCalendarEvents(thaiHolidaysUrl, 'holiday', '#fecdd3'),
      getOnlineCalendarEvents(wanPhraUrlCurrentYear, 'buddhist', '#fde68a'),
      getOnlineCalendarEvents(wanPhraUrlNextYear, 'buddhist', '#fde68a'),
  ]);

  // **แก้ไข:** ลบวันหยุดที่ซ้ำกับวันพระใหญ่ออกจากรายการวันหยุดของ Google
  const buddhistMajorTitles = [...buddhistDaysCurrent, ...buddhistDaysNext]
    .filter(e => e.isMajor)
    .map(e => e.title);
    
  const holidays = holidaysData.filter(h => !buddhistMajorTitles.includes(h.title));

  const allBuddhistDays = [...buddhistDaysCurrent, ...buddhistDaysNext];

  const allEvents = [...userEvents, ...holidays, ...allBuddhistDays];

  res.status(200).json(allEvents);
});


// ... (ส่วนที่เหลือของไฟล์เหมือนเดิม) ...
const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, allDay, type } = req.body;
  if (!title || !start) {
    res.status(400);
    throw new Error('Please provide all required fields: title, start');
  }
  const event = await Event.create({
    user: req.user.id,
    title,
    start: new Date(start),
    end: end ? new Date(end) : new Date(start),
    allDay: allDay || false,
    type: type || 'user',
  });
  res.status(201).json(event);
});
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedEvent);
});
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await event.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Event removed' });
});
module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};