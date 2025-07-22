import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import th from 'date-fns/locale/th';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents, createEvent, reset } from '../features/calendar/calendarSlice';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

const locales = {
  'th': th,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
  getDay,
  locales,
});

const thaiMessages = {
    allDay: 'ตลอดวัน',
    previous: 'ก่อนหน้า',
    next: 'ถัดไป',
    today: 'วันนี้',
    month: 'เดือน',
    week: 'สัปดาห์',
    day: 'วัน',
    agenda: 'กำหนดการ',
    date: 'วันที่',
    time: 'เวลา',
    event: 'กิจกรรม',
    noEventsInRange: 'ไม่มีกิจกรรมในช่วงนี้',
    showMore: total => `+ ดูเพิ่มอีก ${total} รายการ`,
};

function CalendarPage() {
    const dispatch = useDispatch();
    const { events, isLoading, isError, message } = useSelector((state) => state.calendar);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', start: null, end: null });

    useEffect(() => {
        dispatch(getEvents());
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    const handleSelectSlot = ({ start, end }) => {
        setNewEvent({ title: '', start, end });
        setIsModalOpen(true);
    };

    const handleSaveEvent = () => {
        if (newEvent.title) {
            dispatch(createEvent({
                title: newEvent.title,
                start: newEvent.start.toISOString(),
                end: newEvent.end.toISOString(),
            }));
            toast.success(`สร้างกิจกรรม "${newEvent.title}" สำเร็จ!`);
            setIsModalOpen(false);
        } else {
            toast.error('กรุณาใส่ชื่อกิจกรรม');
        }
    };
    
    const eventStyleGetter = (event) => {
        let style = {
            backgroundColor: event.isHoliday ? '#FFB6C1' : '#A855F7', // สีชมพูสำหรับวันพระ, ม่วงสำหรับกิจกรรม
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return { style };
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-candy-text-primary">ปฏิทินกิจกรรม</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-candy-pink-action hover:brightness-105 text-white font-bold py-2 px-4 rounded-xl flex items-center transition-all duration-300 shadow-lg shadow-pink-100">
                    <FaPlus className="mr-2" /> เพิ่มกิจกรรม
                </button>
            </div>
            <div className="bg-candy-content-bg p-6 rounded-2xl shadow-lg shadow-purple-100 h-[75vh]">
                {isLoading ? (
                    <p>กำลังโหลดข้อมูลปฏิทิน...</p>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        messages={thaiMessages}
                        culture='th'
                        eventPropGetter={eventStyleGetter}
                    />
                )}
            </div>
            
            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-candy-text-primary">เพิ่มกิจกรรมใหม่</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">ชื่อกิจกรรม</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-candy-bg border-2 border-gray-200 rounded-xl"
                                    placeholder="เช่น ประชุมทีม, ส่งของลูกค้า"
                                />
                            </div>
                            {/* We can add start/end time inputs here if needed */}
                        </div>
                        <div className="flex justify-end mt-8 pt-6 border-t">
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-600 font-bold px-6 py-2 mr-4 rounded-lg hover:bg-gray-200">ยกเลิก</button>
                            <button onClick={handleSaveEvent} className="bg-candy-purple-action text-white font-bold px-6 py-3 rounded-lg">บันทึก</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarPage;