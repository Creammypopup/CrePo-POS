const mongoose = require('mongoose'); // Corrected from import to require

const eventSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
    },
    allDay: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
    },
    // Added a type field to distinguish between user events and holidays
    type: {
        type: String,
        default: 'user', // 'user', 'holiday', 'buddhist'
    }
  },
  {
    timestamps: true,
  }
);

// This is the fix: Changed from ES Module to CommonJS export
module.exports = mongoose.model('Event', eventSchema);