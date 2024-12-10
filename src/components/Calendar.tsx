import React, { useState, useEffect } from 'react'
import { Event } from '../types'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { Label } from './ui/label'
import { Input } from './ui/input'

const Calendar = ({ events, currentDate, onEventClick, view }) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [item, setItem] = useState([])

  const { user } = useAuth()
  const router = useRouter()

  const fetchEvents = async () => {
    if (!user || !user.uid) {
      console.error('User is not authenticated')
      return
    }

    try {
      const response = await fetch(`/api/calendar?userId=${user.uid}`)
      console.log('Fetch response:', response)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched events:', data.events)
        setItem(data.events || [])
      } else {
        console.error('Fetch error:', response.statusText)
        toast({
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast({
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [user.uid])

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
}

export default Calendar;