import express from 'express';
const router = express.Router();
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/calendarController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getEvents).post(protect, createEvent);
router
  .route('/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

// Changed from 'export default' to a named export for better compatibility.
export { router };
