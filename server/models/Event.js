const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'กรุณาใส่ชื่อกิจกรรม'],
    trim: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  allDay: {
    type: Boolean,
    default: true,
  },
  isHoliday: { // To mark Buddhist Holy Days
    type: Boolean,
    default: false,
  },
  user: { // Optional: Link event to a user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);