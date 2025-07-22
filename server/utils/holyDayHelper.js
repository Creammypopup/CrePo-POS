// This file separates the logic for calculating holy days

/**
 * Generates a list of Buddhist Holy Days for a given year.
 * NOTE: This is a simplified placeholder. A real-world application would need a more
 * accurate library or API for calculating Thai lunar calendar dates.
 * @param {number} year The full year (e.g., 2025)
 * @returns {Array<Object>} An array of event objects for holy days.
 */
const getBuddhistHolyDays = (year) => {
    // Dummy data for demonstration purposes
    return [
        { title: 'วันพระ', start: new Date(year, 6, 25), end: new Date(year, 6, 25), allDay: true, isHoliday: true, id: 'holy-2025-07-25' },
        { title: 'วันพระ', start: new Date(year, 7, 2), end: new Date(year, 7, 2), allDay: true, isHoliday: true, id: 'holy-2025-08-02' },
        { title: 'วันสารทจีน', start: new Date(year, 7, 29), end: new Date(year, 7, 29), allDay: true, isHoliday: true, id: 'holy-2025-08-29' },
        { title: 'วันพระ', start: new Date(year, 8, 10), end: new Date(year, 8, 10), allDay: true, isHoliday: true, id: 'holy-2025-09-10' },
    ];
};

module.exports = { getBuddhistHolyDays };