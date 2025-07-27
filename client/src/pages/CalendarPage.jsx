import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  getEvents,
  createEvent,
  deleteEvent,
  reset,
} from "../features/calendar/calendarSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { FaPlus, FaRegCalendarCheck, FaMoon, FaGift } from "react-icons/fa";

// รายชื่อวันสำคัญทางพุทธศาสนาที่เป็นวันหยุดราชการ
const BUDDHIST_PUBLIC_HOLIDAYS = [
  "Makha", // มาฆบูชา
  "Visakha", // วิสาขบูชา
  "Asalha", // อาสาฬหบูชา
  "Khao Phansa", // วันเข้าพรรษา
  "Ok Phansa" // วันออกพรรษา (อาจจะไม่ใช่ Official แต่เพิ่มไว้เผื่อ)
];

function CalendarPage() {
  const dispatch = useDispatch();
  const { events: userEvents, isLoading, isError, message } = useSelector(
    (state) => state.calendar
  );
  const [allEvents, setAllEvents] = useState([]);

  // Fetch user events, public holidays, and wan phra days
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getEvents());

    const fetchAllEvents = async () => {
      try {
        const year = new Date().getFullYear();
        
        // 1. Fetch Wan Phra (วันพระ)
        const wanpraRes = await fetch(`https://wanpra.vercel.app/api/v2/${year}`);
        const wanpraData = await wanpraRes.json();
        const wanpraEvents = wanpraData.map(day => {
          const isMajor = day.khuen.includes('๑๕') || day.khuen.includes('๑๔');
          return {
            title: 'วันพระ',
            start: day.date,
            allDay: true,
            extendedProps: { type: isMajor ? 'buddhist-major' : 'buddhist-minor' },
            classNames: [isMajor ? 'event-buddhist-major' : 'event-buddhist-minor'],
          };
        });

        // 2. Fetch Public Holidays (วันหยุดราชการ)
        const holidaysRes = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/TH`);
        const holidaysData = await holidaysRes.json();
        const publicEvents = holidaysData.map(holiday => {
          // ตรวจสอบว่าเป็นวันสำคัญทางพุทธที่อยู่ในลิสต์หรือไม่
          const isBuddhistPublicHoliday = BUDDHIST_PUBLIC_HOLIDAYS.some(buddhistDay => holiday.name.includes(buddhistDay));
          if (isBuddhistPublicHoliday) {
            return {
              title: holiday.localName,
              start: holiday.date,
              allDay: true,
              extendedProps: { type: 'buddhist-major' },
              classNames: ['event-buddhist-major'],
            };
          }
          return {
            title: holiday.localName,
            start: holiday.date,
            allDay: true,
            extendedProps: { type: 'public-holiday' },
            classNames: ['event-public-holiday'],
          };
        });

        // 3. Combine all events with priority
        const eventsMap = new Map();
        
        // ให้วันพระมีความสำคัญสูงสุด
        [...wanpraEvents, ...publicEvents].forEach(event => {
            // ถ้าเป็นวันพระใหญ่ ให้มีความสำคัญเหนือกว่าวันหยุดราชการ
            if (!eventsMap.has(event.start) || event.extendedProps.type.includes('buddhist')) {
                 eventsMap.set(event.start, event);
            }
        });
        
        const combinedEvents = Array.from(eventsMap.values());
        setAllEvents(combinedEvents);

      } catch (error) {
        console.error("Failed to fetch external holidays:", error);
        toast.error("ไม่สามารถดึงข้อมูลวันหยุดและวันพระได้");
      }
    };

    fetchAllEvents();

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  // Add user events to the combined list
  useEffect(() => {
    const formattedUserEvents = userEvents.map(event => ({
      ...event,
      extendedProps: { ...event.extendedProps, type: 'user' },
      classNames: ['event-user'],
    }));
    // ใช้ Map เพื่อป้องกันการแสดงผลซ้ำซ้อนหากผู้ใช้เพิ่มกิจกรรมในวันหยุด
    const eventsMap = new Map(allEvents.map(e => [e.start, e]));
    formattedUserEvents.forEach(event => {
        eventsMap.set(event.start, event); // กิจกรรมผู้ใช้จะทับวันหยุด
    });
    setAllEvents(Array.from(eventsMap.values()));
  }, [userEvents]);


  const handleDateSelect = (selectInfo) => {
    let title = prompt("กรุณาใส่ชื่อกิจกรรมใหม่:");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    if (title) {
      const newEvent = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };
      dispatch(createEvent(newEvent));
    }
  };

  const handleEventClick = (clickInfo) => {
    const eventType = clickInfo.event.extendedProps.type;
    if (eventType !== 'user') {
        toast.info(`${clickInfo.event.title}`);
        return;
    }

    if (window.confirm(`คุณต้องการลบกิจกรรม '${clickInfo.event.title}' หรือไม่?`)) {
      dispatch(deleteEvent(clickInfo.event.id));
    }
  };

  const renderEventContent = (eventInfo) => {
    const { type } = eventInfo.event.extendedProps;
    return (
      <div className="flex items-center w-full overflow-hidden">
        {type === 'user' && <FaRegCalendarCheck className="mr-2 flex-shrink-0" />}
        {type === 'public-holiday' && <FaGift className="mr-2 flex-shrink-0" />}
        {type === 'buddhist-major' && <FaMoon className="mr-2 flex-shrink-0" />}
        <b className="truncate">{eventInfo.event.title}</b>
      </div>
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">ปฏิทินกิจกรรม</h1>
        <p className="text-gray-500 flex items-center">
            <FaPlus className="mr-2" /> คลิกที่วันที่เพื่อเพิ่มกิจกรรม
        </p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          initialView="dayGridMonth"
          locale="th"
          events={allEvents}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
        />
      </div>
       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center p-2 bg-white rounded-lg shadow-sm"><div className="w-4 h-4 rounded-full bg-green-200 mr-3 border border-green-300"></div><span className="text-gray-600">กิจกรรมของฉัน</span></div>
          <div className="flex items-center p-2 bg-white rounded-lg shadow-sm"><div className="w-4 h-4 rounded-full bg-pink-200 mr-3 border border-pink-300"></div><span className="text-gray-600">วันหยุดนักขัตฤกษ์</span></div>
          <div className="flex items-center p-2 bg-white rounded-lg shadow-sm"><div className="w-4 h-4 rounded-full bg-yellow-200 mr-3 border border-yellow-300 flex items-center justify-center"><FaMoon className="text-yellow-800 text-xs"/></div><span className="text-gray-600">วันพระใหญ่</span></div>
          <div className="flex items-center p-2 bg-white rounded-lg shadow-sm"><div className="w-4 h-4 rounded-full bg-yellow-100 mr-3 border border-yellow-200 flex items-center justify-center text-yellow-600 text-xs">🌕</div><span className="text-gray-600">วันพระเล็ก</span></div>
      </div>
    </div>
  );
}

export default CalendarPage;
