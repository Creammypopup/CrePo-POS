// client/src/pages/CalendarPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaCalendarPlus, FaPrint, FaDharmachakra, FaRegCalendarAlt } from "react-icons/fa";import {
  getEvents,
  createEvent,
  deleteEvent,
  reset,
} from "../features/calendar/calendarSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function CalendarPage() {
  const dispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector(
    (state) => state.calendar
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getEvents());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  const handleAddEvent = () => {
    let title = prompt("กรุณาใส่ชื่อกิจกรรม:");
    if (!title) return;

    let dateStr = prompt("กรุณาใส่วันที่ (YYYY-MM-DD):", new Date().toISOString().slice(0, 10));
    if (!dateStr) return;

    dispatch(createEvent({
        title,
        start: dateStr,
        allDay: true,
    }));
  };

  const handleDateSelect = (selectInfo) => {
    let title = prompt("กรุณาใส่ชื่อกิจกรรมใหม่สำหรับวันที่เลือก:");
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
        toast.info(`✨ ${clickInfo.event.title}`);
        return;
    }
    if (window.confirm(`คุณต้องการลบกิจกรรม '${clickInfo.event.title}' หรือไม่?`)) {
      dispatch(deleteEvent(clickInfo.event.id || clickInfo.event._id));
    }
  };

  const getEventClassNames = (eventInfo) => {
    const type = eventInfo.event.extendedProps.type || eventInfo.event.type;
    return `event-${type}`;
  };

  const renderEventContent = (eventInfo) => {
    const type = eventInfo.event.extendedProps.type || eventInfo.event.type;
    const title = eventInfo.event.title;

    switch (type) {
      case 'buddhist-major':
        return <div className="flex items-center gap-2"><FaDharmachakra /> <span>{title}</span></div>;
      case 'buddhist-minor':
        return <div className="flex items-center gap-2"><FaDharmachakra /></div>;
      case 'user':
        return <div className="flex items-center gap-2"><FaRegCalendarAlt /> <span>{title}</span></div>;
      default:
        return <span>{title}</span>;
    }
  };
  
  return (
    <>
    <style>{`
        :root {
          --fc-user-event-bg: #E9D5FF; /* ม่วง */
          --fc-user-event-border: #C084FC;
          --fc-user-event-text: #581c87;
          --fc-holiday-bg: #FECDD3; /* ชมพู */
          --fc-holiday-border: #FB7185;
          --fc-holiday-text: #881337;
          --fc-buddhist-major-bg: #FDE68A; /* เหลือง */
          --fc-buddhist-major-border: #FBBF24;
          --fc-buddhist-major-text: #78350f;
          --fc-buddhist-minor-bg: #FDE68A; /* เหลือง */
          --fc-buddhist-minor-border: #FBBF24;
          --fc-buddhist-minor-text: #78350f;
        }
        .fc { font-family: 'IBM Plex Sans Thai', sans-serif; border: none; }
        .fc .fc-toolbar-title { font-size: 1.5em; font-weight: 600; color: #434242; }
        .fc .fc-button { background: #F6F5F2; border: 1px solid #e5e7eb; color: #434242; box-shadow: none !important; }
        .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background: #A076F9; border-color: #A076F9; color: white; }
        .fc-daygrid-day-number { padding: 0.5em; }
        .fc .fc-day-today { background: rgba(160, 118, 249, 0.1); }
        .fc-day-today .fc-daygrid-day-number { background-color: #A076F9; color: white; border-radius: 9999px; width: 2em; height: 2em; display: inline-flex; align-items: center; justify-content: center; padding: 0; }

        .fc-event { border-radius: 6px; padding: 4px 8px; font-weight: 500; border: 1px solid; }
        .event-user { background-color: var(--fc-user-event-bg) !important; color: var(--fc-user-event-text) !important; border-color: var(--fc-user-event-border) !important; }
        .event-holiday { background-color: var(--fc-holiday-bg) !important; color: var(--fc-holiday-text) !important; border-color: var(--fc-holiday-border) !important; }
        .event-buddhist-major { background-color: var(--fc-buddhist-major-bg) !important; color: var(--fc-buddhist-major-text) !important; border-color: var(--fc-buddhist-major-border) !important; }
        .event-buddhist-minor { background-color: var(--fc-buddhist-minor-bg) !important; color: var(--fc-buddhist-minor-text) !important; border-color: var(--fc-buddhist-minor-border) !important; }
    `}</style>
    <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">ปฏิทิน</h1>
            <div className="flex gap-2">
                <button onClick={handleAddEvent} className="btn btn-3d-pastel bg-purple-100 text-purple-700">
                    <FaCalendarPlus className="mr-2" /> เพิ่มกิจกรรม
                </button>
                <button onClick={() => window.print()} className="btn btn-3d-pastel bg-gray-100 text-gray-700">
                    <FaPrint className="mr-2" /> พิมพ์
                </button>
            </div>
        </div>

       <div className="bg-white p-4 rounded-2xl shadow-lg">
        {isLoading && !events.length ? <Spinner /> : (
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek,dayGridDay" }}
                initialView="dayGridMonth"
                locale="th"
                events={events}
                eventClassNames={getEventClassNames}
                eventContent={renderEventContent}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                fixedWeekCount={false}
            />
        )}
      </div>
       <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-user-event-bg)] mr-3"></div><span>กิจกรรมของฉัน</span></div>
          <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-holiday-bg)] mr-3"></div><span>วันหยุดราชการ</span></div>
          <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-buddhist-major-bg)] mr-3"></div><span>วันพระ/วันสำคัญ</span></div>
      </div>
    </div>
    </>
  );
}

export default CalendarPage;