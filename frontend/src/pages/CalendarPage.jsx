import React, { useState, useMemo } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Target, Plus } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import { useAuth } from '../context/AuthContext';
import './CalendarPage.css';

const CalendarPage = () => {
    const { projects } = useProjects();
    const { currentUser } = useAuth();
    const [viewDate, setViewDate] = useState(new Date());

    const userProjects = projects?.filter(project => {
        const isManager = project.manager && currentUser && (
            (project.manager.id && String(project.manager.id) === String(currentUser.id)) ||
            (project.manager.email && project.manager.email === currentUser.email)
        );
        const isMember = project.members && currentUser && project.members.some(m => 
            (m.id && String(m.id) === String(currentUser.id)) ||
            (m.email && m.email === currentUser.email)
        );
        return isManager || isMember;
    }) || [];

    const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
    const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));
    const handleToday = () => setViewDate(new Date());

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(viewDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [viewDate]);

    const getProjectsForDate = (date) => {
        return userProjects.filter(project => {
            if (!project.startDate) return false;
            const start = new Date(project.startDate);
            const end = project.endDate ? new Date(project.endDate) : start;
            // Simplified: show project if it overlaps with this day
            return isSameDay(date, start) || isSameDay(date, end) || (date > start && date < end);
        });
    };

    return (
        <div className="calendar-page-container">
            <div className="calendar-page-header">
                <div className="header-left">
                    <div className="title-group">
                        <h1>Calendar</h1>
                        <p>Track your project timelines and deadlines across the year.</p>
                    </div>
                </div>
                <div className="header-right">
                    <div className="calendar-nav-pill">
                        <button className="nav-btn-sm" onClick={handlePrevMonth}>
                            <ChevronLeft size={18} />
                        </button>
                        <span className="current-month-label">{format(viewDate, 'MMMM yyyy')}</span>
                        <button className="nav-btn-sm" onClick={handleNextMonth}>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <button className="today-btn" onClick={handleToday}>Today</button>
                </div>
            </div>

            <div className="calendar-main-view">
                <div className="calendar-grid-container">
                    <div className="weekdays-header">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="weekday-label">{day}</div>
                        ))}
                    </div>
                    <div className="days-body">
                        {calendarDays.map((day, idx) => {
                            const isCurrentMonth = isSameMonth(day, startOfMonth(viewDate));
                            const isToday = isSameDay(day, new Date());
                            const projectsOnDay = getProjectsForDate(day);

                            return (
                                <div 
                                    key={idx} 
                                    className={`calendar-day-cell ${!isCurrentMonth ? 'outside-month' : ''} ${isToday ? 'is-today' : ''}`}
                                >
                                    <div className="day-cell-header">
                                        <span className="day-num">{format(day, 'd')}</span>
                                    </div>
                                    <div className="day-cell-content">
                                        {projectsOnDay.slice(0, 3).map(proj => (
                                            <div 
                                                key={proj.id} 
                                                className="calendar-event-pill"
                                                style={{ borderLeftColor: proj.color || 'var(--primary-color)' }}
                                            >
                                                <span className="event-name">{proj.name}</span>
                                            </div>
                                        ))}
                                        {projectsOnDay.length > 3 && (
                                            <div className="more-events">+{projectsOnDay.length - 3} more</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;