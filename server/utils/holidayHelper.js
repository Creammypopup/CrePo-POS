// server/utils/holidayHelper.js

/**
 * Generates a list of public holidays for Thailand for a given year.
 * This is a static list for now. In the future, this can be replaced with an API call.
 * @param {number} year The full year (e.g., 2025)
 * @returns {Array<Object>} An array of event objects for holidays.
 */
function getPublicHolidays(year) {
  const holidays = [
    // --- 2025 ---
    { id: 'h-2025-01-01', title: 'วันขึ้นปีใหม่', start: new Date(year, 0, 1), allDay: true, type: 'holiday', color: '#fecdd3' }, // Pink
    { id: 'h-2025-02-12', title: 'วันมาฆบูชา', start: new Date(year, 1, 12), allDay: true, type: 'buddhist', color: '#fde68a' }, // Yellow
    { id: 'h-2025-04-06', title: 'วันจักรี', start: new Date(year, 3, 6), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-04-13', title: 'วันสงกรานต์', start: new Date(year, 3, 13), end: new Date(year, 3, 16), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-05-01', title: 'วันแรงงาน', start: new Date(year, 4, 1), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-05-04', title: 'วันฉัตรมงคล', start: new Date(year, 4, 4), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-05-11', title: 'วันวิสาขบูชา', start: new Date(year, 4, 11), allDay: true, type: 'buddhist', color: '#fde68a' },
    { id: 'h-2025-06-03', title: 'วันเฉลิมฯ พระราชินี', start: new Date(year, 5, 3), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-07-10', title: 'วันอาสาฬหบูชา', start: new Date(year, 6, 10), allDay: true, type: 'buddhist', color: '#fde68a' },
    { id: 'h-2025-07-28', title: 'วันเฉลิมฯ ร.10', start: new Date(year, 6, 28), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-08-12', title: 'วันแม่แห่งชาติ', start: new Date(year, 7, 12), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-10-13', title: 'วันคล้ายวันสวรรคต ร.9', start: new Date(year, 9, 13), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-10-23', title: 'วันปิยมหาราช', start: new Date(year, 9, 23), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-12-05', title: 'วันพ่อแห่งชาติ', start: new Date(year, 11, 5), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-12-10', title: 'วันรัฐธรรมนูญ', start: new Date(year, 11, 10), allDay: true, type: 'holiday', color: '#fecdd3' },
    { id: 'h-2025-12-31', title: 'วันสิ้นปี', start: new Date(year, 11, 31), allDay: true, type: 'holiday', color: '#fecdd3' },

     // --- วันพระ (ตัวอย่าง) ---
     { id: 'b-2025-07-25', title: 'วันพระ', start: new Date(2025, 6, 25), allDay: true, type: 'buddhist', color: '#fde68a' },
     { id: 'b-2025-08-02', title: 'วันพระ', start: new Date(2025, 7, 2), allDay: true, type: 'buddhist', color: '#fde68a' },
     { id: 'b-2025-08-10', title: 'วันพระ', start: new Date(2025, 7, 10), allDay: true, type: 'buddhist', color: '#fde68a' },
     { id: 'b-2025-08-17', title: 'วันพระ', start: new Date(2025, 7, 17), allDay: true, type: 'buddhist', color: '#fde68a' },
  ];

  // Return holidays only for the requested year
  return holidays.filter(h => h.start.getFullYear() === year);
}

module.exports = { getPublicHolidays };