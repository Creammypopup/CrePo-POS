// src/components/modals/EventModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../features/calendar/calendarSlice';
import moment from 'moment';

function EventModal({ isOpen, onClose, dateInfo }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [allDay, setAllDay] = useState(dateInfo.allDay);
  const [start, setStart] = useState(moment(dateInfo.startStr).format('YYYY-MM-DDTHH:mm'));
  const [end, setEnd] = useState(moment(dateInfo.endStr).format('YYYY-MM-DDTHH:mm'));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createEvent({
      title,
      start: allDay ? moment(start).format('YYYY-MM-DD') : start,
      end: allDay ? moment(end).format('YYYY-MM-DD') : end,
      allDay,
    }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">เพิ่มกิจกรรมใหม่</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">ชื่อกิจกรรม</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <label className="block font-medium">เวลาเริ่มต้น</label>
              <input type={allDay ? 'date' : 'datetime-local'} value={allDay ? moment(start).format('YYYY-MM-DD') : start} onChange={(e) => setStart(e.target.value)} className="form-input"/>
            </div>
            <div className="flex-grow">
              <label className="block font-medium">เวลาสิ้นสุด</label>
              <input type={allDay ? 'date' : 'datetime-local'} value={allDay ? moment(end).format('YYYY-MM-DD') : end} onChange={(e) => setEnd(e.target.value)} className="form-input"/>
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="allDay" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} className="h-4 w-4 rounded" />
            <label htmlFor="allDay" className="ml-2">กิจกรรมทั้งวัน</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-3d-pastel bg-gray-200">ยกเลิก</button>
            <button type="submit" className="btn btn-3d-pastel bg-blue-200">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;