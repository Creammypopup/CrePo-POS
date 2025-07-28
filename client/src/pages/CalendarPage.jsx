    // client/src/pages/CalendarPage.jsx
    import React, { useState, useEffect, useCallback } from "react";
    import { useSelector, useDispatch } from "react-redux";
    import FullCalendar from "@fullcalendar/react";
    import dayGridPlugin from "@fullcalendar/daygrid";
    import interactionPlugin from "@fullcalendar/interaction";
    import moment from 'moment';
    import {
      getEvents,
      createEvent,
      deleteEvent,
      reset,
    } from "../features/calendar/calendarSlice";
    import { toast } from "react-toastify";
    import Spinner from "../components/Spinner";
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
            const [wanpraRes, holidaysRes] = await Promise.all([
                axios.get(`/api/proxy/wanpra/${currentYear}`, getConfig()),
                axios.get(`/api/proxy/holidays/${currentYear}`, getConfig())
            ]);
            
            const wanpraData = Array.isArray(wanpraRes.data) ? wanpraRes.data : [];
            const holidaysData = Array.isArray(holidaysRes.data) ? holidaysRes.data : [];

            const eventsMap = new Map();

            holidaysData.forEach(holiday => {
                eventsMap.set(moment(holiday.date).format('YYYY-MM-DD'), {
                    title: holiday.localName,
                    start: holiday.date,
                    allDay: true,
                    display: 'background',
                    extendedProps: { type: BUDDHIST_PUBLIC_HOLIDAYS.some(d => holiday.name.includes(d)) ? 'buddhist-major' : 'public-holiday' }
                });
            });

            wanpraData.forEach(day => {
                const dateStr = moment(day.date).format('YYYY-MM-DD');
                eventsMap.set(dateStr, {
                    title: day.title,
                    start: day.date,
                    allDay: true,
                    display: 'background',
                    extendedProps: { type: day.isMajorBuddhistDay ? 'buddhist-major' : 'buddhist-minor' }
                });
            });
            
            setAllEvents(prev => [...prev.filter(e => e.extendedProps?.type === 'user'), ...Array.from(eventsMap.values())]);

          } catch (error) {
            console.error("Failed to fetch external holidays:", error);
            toast.warn("ไม่สามารถดึงข้อมูลวันหยุดและวันพระได้");
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
          className: 'event-user'
        }));
        
        setAllEvents(prevEvents => [...prevEvents.filter(e => e.extendedProps?.type !== 'user'), ...formattedUserEvents]);
      }, [userEvents]);


      const handleDateSelect = (selectInfo) => {
        let title = prompt("กรุณาใส่ชื่อกิจกรรมใหม่:");
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

      return (
        <>
        <style>{`
            :root {
              --fc-user-event-bg: #DBCDF0;
              --fc-user-event-text: #581c87;
              --fc-public-holiday-bg: #FBCFE8;
              --fc-buddhist-major-bg: #FDE68A;
              --fc-buddhist-minor-bg: #D1FAE5;
            }
            .fc { font-family: 'IBM Plex Sans Thai', sans-serif; border: none; }
            .fc .fc-toolbar-title { font-size: 1.5em; font-weight: 600; color: #434242; }
            .fc .fc-button { background: #F6F5F2; border: 1px solid #e5e7eb; color: #434242; box-shadow: none !important; }
            .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background: #A076F9; border-color: #A076F9; color: white; }
            .fc-daygrid-day-number { padding: 0.5em; }
            .fc .fc-day-today { background: rgba(160, 118, 249, 0.1); }
            .fc-day-today .fc-daygrid-day-number { background-color: #A076F9; color: white; border-radius: 9999px; width: 2em; height: 2em; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
            
            .fc-event { border-radius: 6px; padding: 4px 8px; font-weight: 500; border: none; }
            .event-user { background-color: var(--fc-user-event-bg) !important; color: var(--fc-user-event-text) !important; border: 1px solid #c0a2e8 !important; }

            .fc-day-public-holiday { background-color: var(--fc-public-holiday-bg); }
            .fc-day-buddhist-major { background-color: var(--fc-buddhist-major-bg); }
            .fc-day-buddhist-minor { background-color: var(--fc-buddhist-minor-bg); }
        `}</style>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">ปฏิทิน</h1>
           <div className="bg-white p-4 rounded-2xl shadow-lg">
            {isLoading && !allEvents.length ? <Spinner /> : (
                <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth" }}
                initialView="dayGridMonth"
                locale="th"
                events={allEvents}
                dayCellClassNames={(arg) => {
                    const dateStr = moment(arg.date).format('YYYY-MM-DD');
                    const backgroundEvent = allEvents.find(e => e.start === dateStr && e.display === 'background');
                    return backgroundEvent ? [`fc-day-${backgroundEvent.extendedProps.type}`] : [];
                }}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                fixedWeekCount={false}
                />
            )}
          </div>
           <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-user-event-bg)] mr-3"></div><span>กิจกรรมของฉัน</span></div>
              <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-public-holiday-bg)] mr-3"></div><span>วันหยุดราชการ</span></div>
              <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-buddhist-major-bg)] mr-3"></div><span>วันพระใหญ่/วันสำคัญ</span></div>
              <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-[var(--fc-buddhist-minor-bg)] mr-3"></div><span>วันพระเล็ก</span></div>
          </div>
        </div>
        </>
      );
    }

    export default CalendarPage;
    