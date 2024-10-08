import React from 'react'
import { Event } from '../types'

interface CalendarProps {
  events: Event[]
  currentDate: Date
  onEventClick: (event: Event) => void
  view: 'month' | 'week'
}

const Calendar: React.FC<CalendarProps> = ({ events, currentDate, onEventClick, view }) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const renderDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border"></div>)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateString = date.toISOString().split('T')[0]
      const dayEvents = events.filter(event => event.date === dateString)
      days.push(
        <div key={day} className="p-2 border min-h-[100px] relative">
          <span className={`absolute top-1 left-1 ${date.toDateString() === new Date().toDateString() ? 'text-blue-500 font-bold' : ''}`}>{day}</span>
          <div className="mt-6">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="text-xs p-1 mb-1 bg-blue-100 text-blue-800 rounded cursor-pointer truncate"
                onClick={() => onEventClick(event)}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      )
    }
    return days
  }

  if (view === 'month') {
    return (
      <div className="w-full">
        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold p-2 bg-gray-100">{day}</div>
          ))}
          {renderDays()}
        </div>
      </div>
    )
  }

  // Placeholder for week view
  return (
    <div className="w-full p-4 bg-gray-100 rounded">
      <p>The week view is not implemented yet.</p>
    </div>
  )
}

export default Calendar