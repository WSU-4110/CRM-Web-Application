"use client";
import React, { useEffect, useState } from 'react'
import Calendar from '../../../components/Calendar'
import EventForm from '../../../components/CalendarEventForm'
import { Event } from '../../../types'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';


const CalendarPage = () => { //Calendar page
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [view, setView] = useState<'month' | 'week'>('month')
  

  const addEvent = (event: Event) => {
    setEvents([...events, event])
    setShowEventForm(false)
  }

  const editEvent = (updatedEvent: Event) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e))
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="flex min-h-screen bg-white p-10">

      {/* container for calendar */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify between space-x-10 items-center mb-5 justify-between">
          <button onClick={goToToday} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Today</button>
          <button onClick={prevMonth} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><ChevronRight size={20} /></button>
          
          <h2 className="text-xl font-semibold ml-2">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
        
          <button onClick={() => setView('week')} className={`px-4 py-2 rounded ${view === 'week' ? 'bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Week</button>
          <button onClick={() => setView('month')} className={`px-4 py-2 rounded ${view === 'month' ? 'bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Month</button>
          <button onClick={() => setShowEventForm(true)} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><Plus size={20} /></button>
        </div>



        <Calendar
          events={events}
          currentDate={currentDate}
          onEventClick={(event) => {
            setEditingEvent(event)
            setShowEventForm(true)
          }}
          view={view}
        />


      </div>

      <div className='px-10'>
        <Card className="overflow-scroll px-10 " x-chunk="upcoming-events-chunk">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent >
            <ul>
              {events.map(event => (
                <li key={event.id} className="mb-4">
                  <strong>{event.title}</strong>
                  <br />
                  {event.date.toLocaleString()}
                </li>
              ))}
            </ul>

            {events.length === 0 && <p>No upcoming events</p>}
            </CardContent>
        </Card>
      </div>


      {showEventForm && (
        <EventForm
          onSubmit={editingEvent ? editEvent : addEvent}
          onCancel={() => {
            setShowEventForm(false)
            setEditingEvent(null)
          }}
          initialEvent={editingEvent}
          onDelete={deleteEvent}
        />
      )}
    </div>
  )
};

export default CalendarPage;
