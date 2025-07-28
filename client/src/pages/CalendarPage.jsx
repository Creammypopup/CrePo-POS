// client/src/pages/CalendarPage.jsx
import React, { useState, useEffect, useCallback } from "react";
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
import { FaPlus } from "react-icons/fa";
import axios from 'axios';

const BUDDHIST_PUBLIC_HOLIDAYS = ["Makha", "Visakha", "Asalha", "Khao Phansa"];

function CalendarPage() {
  const dispatch = useDispatch();
  const { events: userEvents, isLoading, isError, message } = useSelector(
    (state) => state.calendar
  );
  const { user } = useSelector((state) => state.auth);
  const [allEvents, setAllEvents] = useState([]);

  const getToken = useCallback(() => user?.token, [user]);
  const getConfig = useCallback(() => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }), [getToken]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getEvents());

    const fetchExternalEvents = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;

        const [wanpraResCurrent, wanpraResNext, holidaysRes] = await Promise.all([
            axios.get(`/api/proxy/wanpra/${currentYear}`, getConfig()),
            axios.get(`/api/proxy/wanpra/${nextYear}`, getConfig()),
            axios.get(`/api/proxy/holidays/${currentYear}`, getConfig())
        ]);

        // Ensure data is an array before mapping
        const wanpraData = [
            ...(Array.isArray(wanpraResCurrent.data) ? wanpraResCurrent.data : []),
            ...(Array.isArray(wanpraResNext.data) ? wanpraResNext.data : [])
        ];
        const holidaysData = Array.isArray(holidaysRes.data) ? holidaysRes.data : [];

        const wanpraEvents = wanpraData.map(day => ({
            title: day.isMajorBuddhistDay ? `วันพระใหญ่ (${day.title})` : `วันพระ (${day.title})`,
            start: day.date,
            allDay: true,
            extendedProps: { type: day.isMajorBuddhistDay ? 'buddhist-major' : 'buddhist-minor' },
            display: 'background',
        }));

        const publicEvents = holidaysData.map(holiday => ({
            title: holiday.localName,
            start: holiday.date,
            allDay: true,
            extendedProps: { type: BUDDHIST_PUBLIC_HOLIDAYS.some(d => holiday.name.includes(d)) ? 'buddhist-major' : 'public-holiday' },
            display: 'background',
        }));

        const eventsMap = new Map();
        [...publicEvents, ...wanpraEvents].forEach(event => {
            if (!eventsMap.has(event.start) || event.extendedProps.type.includes('buddhist')) {
                 eventsMap.set(event.start, event);
            }
        });

        // Filter out user events before setting, to avoid duplication
        setAllEvents(prev => [...prev.filter(e => e.extendedProps.type === 'user'), ...Array.from(eventsMap.values())]);

      } catch (error) {
        console.error("Failed to fetch external holidays:", error);
        toast.warn("ไม่สามารถดึงข้อมูลวันหยุดและวันพระได้ อาจเกิดจากปัญหาชั่วคราว");
      }
    };

    fetchExternalEvents();

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message, getConfig]);

  useEffect(() => {
    const formattedUserEvents = userEvents.map(event => ({
      id: event._id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: { type: 'user' },
      className: 'event-user' // Add class for styling
    }));

    setAllEvents(prevEvents => [...prevEvents.filter(e => e.extendedProps.type !== 'user'), ...formattedUserEvents]);
  }, [userEvents]);


  const handleDateSelect = (selectInfo) => {
    let title = prompt("กรุณาใส่ชื่อกิจกรรมใหม่:");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    if (title) {
      dispatch(createEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      }));
    }
  };

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.extendedProps.type !== 'user') {
        toast.info(`${clickInfo.event.title}`);
        return;
    }

    if (window.confirm(`คุณต้องการลบกิจกรรม '${clickInfo.event.title}' หรือไม่?`)) {
      dispatch(deleteEvent(clickInfo.event.id));
    }
  };

  if (isLoading && !allEvents.length) {
    return <Spinner />;
  }

  return (
    <>
    <style>{`
        :root {
          --fc-bg-user-event: #DBCDF0;
          --fc-bg-public-holiday: #F2C6DE;
          --fc-bg-buddhist-major: #FAEDCB;
          --fc-bg-buddhist-minor: #C9E4DE;
        }
        .fc { font-family: 'IBM Plex Sans Thai', sans-serif; border: none; }
        .fc .fc-toolbar-title { font-size: 1.5em; font-weight: 600; color: #434242; }
        .fc .fc-button { background: #F6F5F2; border: 1px solid #e5e7eb; color: #434242; box-shadow: none !important; }
        .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background: #A076F9; border-color: #A076F9; color: white; }
        .fc-daygrid-day-number { padding: 0.5em; }
        .fc .fc-day-today { background: rgba(160, 118, 249, 0.1); }
        .fc-day-today .fc-daygrid-day-number { background-color: #A076F9; color: white; border-radius: 9999px; width: 2em; height: 2em; display: inline-flex; align-items: center; justify-content: center; padding: 0; }

        .fc-event { border-radius: 6px; padding: 4px 8px; font-weight: 500; border: 1px solid rgba(0,0,0,0.1); }
        .event-user { background-color: var(--fc-bg-user-event) !important; color: #3c1e5a !important; }

        .fc-day-public-holiday { background-color: var(--fc-bg-public-holiday); }
        .fc-day-buddhist-major { background-color: var(--fc-bg-buddhist-major); }
        .fc-day-buddhist-minor { background-color: var(--fc-bg-buddhist-minor); }
    `}</style>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">ปฏิทิน</h1>
        <button onClick={() => toast.info('คลิกที่วันที่ว่างเพื่อเพิ่มกิจกรรมใหม่')} className="btn btn-3d-pastel btn-primary">
            <FaPlus className="mr-2" /> เพิ่มกิจกรรม
        </button>
      </div>
       <div className="bg-white p-4 rounded-2xl shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth" }}
          initialView="dayGridMonth"
          locale="th"
          events={allEvents}
          dayCellClassNames={(arg) => {
              const backgroundEvent = allEvents.find(e => e.start === arg.dateStr && e.display === 'background');
              return backgroundEvent ? [`fc-day-${backgroundEvent.extendedProps.type}`] : [];
          }}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </div>
       <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-bg-user-event)] mr-3"></div><span>กิจกรรมของฉัน</span></div>
          <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-bg-public-holiday)] mr-3"></div><span>วันหยุดราชการ</span></div>
          <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-bg-buddhist-major)] mr-3"></div><span>วันพระใหญ่/วันสำคัญ</span></div>
          <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-bg-buddhist-minor)] mr-3"></div><span>วันพระเล็ก</span></div>
      </div>
    </div>
    </>
  );
}

export default CalendarPage;