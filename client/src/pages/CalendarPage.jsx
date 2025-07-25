import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, createEvent, updateEvent, deleteEvent, reset } from '../features/calendar/calendarSlice';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/th';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import { FaPlus, FaTimes, FaChurch } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

moment.locale('th');
const localizer = momentLocalizer(moment);

// --- START OF EDIT: ปรับปรุง Custom Event Component ---
const CustomEvent = ({ event }) => {
  const isBuddhistDay = event.type === 'buddhist';

  return (
    <div className="flex items-center overflow-hidden whitespace-nowrap">
      {/* ถ้าเป็นวันพระ (ทั้งเล็กและใหญ่) ให้แสดงไอคอนโบสถ์ */}
      {isBuddhistDay && <FaChurch className="mr-1.5 flex-shrink-0" />}
      
      {/* แสดงชื่อกิจกรรม/วันหยุด (Backend จะจัดการชื่อที่ถูกต้องให้แล้ว) */}
      <span className="truncate">{event.title}</span>
    </div>
  );
};
// --- END OF EDIT ---

// ... (ส่วน customModalStyles และ Modal.setAppElement เหมือนเดิม) ...
const customModalStyles = {
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', borderRadius: '1rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', width: '90%', maxWidth: '500px', background: '#fff' },
  overlay: { backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }
};

Modal.setAppElement('#root');

function CalendarPage() {
  const dispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector((state) => state.calendar);

  // ... (ส่วน state และ useEffect เหมือนเดิม) ...
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState({ title: '', start: new Date(), end: new Date() });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getEvents());
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);


  const formattedEvents = useMemo(() => 
    events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    })), 
  [events]);

  const eventStyleGetter = (event) => {
    let style = { borderRadius: '5px', opacity: 0.9, border: '0px', display: 'block' };
    
    if (event.color) {
        style.backgroundColor = event.color;
        if (event.type === 'buddhist') {
          style.color = '#78350f'; 
        } else if (event.type === 'holiday') {
          style.color = '#881337'; // ทำให้สีตัวอักษรบนพื้นหลังชมพูเข้มขึ้น
        } else {
          style.color = 'black';
        }
    } else {
        style.backgroundColor = '#a78bfa';
        style.color = 'white';
    }
    
    return { style };
  };

  // ... (ส่วน handleFunctions และ messages, formats เหมือนเดิม) ...
  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setEventData({ title: '', start, end, allDay: false });
    setModalIsOpen(true);
  };

  const handleSelectEvent = (event) => {
    if (event.type === 'holiday' || event.type === 'buddhist') {
        return;
    }
    setSelectedEvent(event);
    setEventData({ title: event.title, start: event.start, end: event.end, allDay: event.allDay });
    setModalIsOpen(true);
  };

  const handleDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setEventData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'start' || name === 'end') {
        setEventData(prev => ({ ...prev, [name]: new Date(value) }));
    } else {
        setEventData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEvent = () => {
    if (eventData.title) {
      if (selectedEvent) {
        dispatch(updateEvent({ ...eventData, _id: selectedEvent._id }));
      } else {
        dispatch(createEvent(eventData));
      }
      closeModal();
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
        dispatch(deleteEvent(selectedEvent._id));
        closeModal();
    }
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
    setEventData({ title: '', start: new Date(), end: new Date() });
  };
  
  const messages = {
    allDay: 'ตลอดวัน', previous: '‹', next: '›', today: 'วันนี้', month: 'เดือน', week: 'สัปดาห์', day: 'วัน', agenda: 'กำหนดการ', date: 'วันที่', time: 'เวลา', event: 'กิจกรรม', noEventsInRange: 'ไม่มีกิจกรรมในช่วงนี้', showMore: total => `+ ดูอีก ${total} รายการ`
  };

  const formats = {
    monthHeaderFormat: 'MMMM YYYY',
    dayHeaderFormat: 'dddd D MMM',
    dayRangeHeaderFormat: ({ start, end }, culture, local) =>
      `${local.format(start, 'D MMMM')} - ${local.format(end, 'D MMMM')}`,
  };


  if (isLoading && !events.length) {
    return <Spinner />;
  }

  return (
    // --- START OF EDIT: เปลี่ยนพื้นหลังเป็นสีขาวทึบ ---
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-lg">
    {/* --- END OF EDIT --- */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">ปฏิทินกิจกรรม</h1>
            <button onClick={() => handleSelectSlot({ start: new Date(), end: new Date() })} className="flex items-center px-4 py-2 bg-pastel-purple-dark text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors">
                <FaPlus className="mr-2" />
                เพิ่มกิจกรรม
            </button>
        </div>

      <div className="bg-white p-4 rounded-xl">
        <Calendar
            localizer={localizer}
            events={formattedEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '75vh' }}
            eventPropGetter={eventStyleGetter}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            culture='th'
            messages={messages}
            formats={formats}
            components={{
                event: CustomEvent,
            }}
        />
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customModalStyles} contentLabel="Event Modal">
        {/* ... (Modal content is unchanged) ... */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">{selectedEvent ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}</h2>
            <button onClick={closeModal}><FaTimes className="text-gray-400 hover:text-gray-600 text-2xl"/></button>
        </div>
        <div className="space-y-4">
            <input type="text" name="title" placeholder="ชื่อกิจกรรม" value={eventData.title} onChange={handleDataChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastel-purple focus:border-transparent" />
            <div>
                <label className="block text-sm font-medium text-gray-700">เวลาเริ่มต้น</label>
                <input type="datetime-local" name="start" value={moment(eventData.start).format('YYYY-MM-DDTHH:mm')} onChange={handleDataChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">เวลาสิ้นสุด</label>
                <input type="datetime-local" name="end" value={moment(eventData.end).format('YYYY-MM-DDTHH:mm')} onChange={handleDataChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="allDay" name="allDay" checked={eventData.allDay || false} onChange={handleDataChange} className="h-4 w-4 rounded border-gray-300 text-pastel-purple focus:ring-pastel-purple" />
                <label htmlFor="allDay" className="ml-2 block text-sm text-gray-900">กิจกรรมตลอดวัน</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                {selectedEvent && (
                    <button onClick={handleDeleteEvent} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">ลบ</button>
                )}
                <button onClick={handleSaveEvent} className="px-6 py-2 bg-pastel-purple-dark text-white rounded-lg hover:bg-purple-700">บันทึก</button>
            </div>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarPage;