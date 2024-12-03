import React, { useState, useEffect } from 'react'
import { Event } from '../types'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { Label } from './ui/label'
import { Input } from './ui/input'

const EventForm = ({ onSubmit, onCancel, initialEvent, onDelete }) => {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [events, setEvents] = useState([])

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchEvents()
    } else {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title)
      setDate(initialEvent.date.split('T')[0])
      setDescription(initialEvent.description)
    } else {
      setTitle('')
      setDate(new Date().toISOString().split('T')[0])
      setDescription('')
    }
  }, [initialEvent])

  const fetchEvents = async () => {
    const response = await fetch(`/api/calendar?userId=${user.uid}`)
    if (response.ok) {
      const data = await response.json()
      setEvents(data.events || [])
    } else {
      toast({
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const eventData = {
      id: initialEvent ? initialEvent.id : Date.now().toString(),
      title,
      date,
      description,
    }

    const response = await fetch(`/api/calendar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.uid,
        calendar: eventData,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      toast({
        title: 'Success',
        description: 'Event added successfully',
        variant: 'default',
      })
      onSubmit(eventData)
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add event',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-6">{initialEvent ? 'Edit Event' : 'Add Event'}</h2>
        <div className="mb-4">
          <Label htmlFor="title" className="block text-sm font-medium mb-2">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="date" className="block text-sm font-medium mb-2">Date</Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="description" className="block text-sm font-medium mb-2">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          ></textarea>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            {initialEvent ? 'Update' : 'Add'}
          </button>
          {initialEvent && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(initialEvent.id)}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default EventForm