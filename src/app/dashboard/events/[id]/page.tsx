"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/app/contexts/AuthContext"
import { EventMap } from "@/components/event-map"

interface EventDetail {
  id: string
  name: string
  customer: string
  price: number
  date: string
  time: string
  address: string
  inventory: string[]
  notes?: string
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const { user } = useAuth()
  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/api/events/${params.id}?userId=${user.uid}`)
      const data = await response.json()
      setEvent(data)
    }
    fetchEvent()
  }, [params.id])

  if (!event) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{event.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <dt className="font-semibold">Customer</dt>
              <dd>{event.name}</dd>
              
              <dt className="font-semibold">Price</dt>
              <dd>${event.price}</dd>
              
              <dt className="font-semibold">Date & Time</dt>
              <dd>{event.date} at {event.time}</dd>
              
              <dt className="font-semibold">Address</dt>
              <dd>{event.address}</dd>
              
              {event.notes && (
                <>
                  <dt className="font-semibold">Notes</dt>
                  <dd>{event.notes}</dd>
                </>
              )}
            </dl>
          </CardContent>
        </Card>

       
             
              <EventMap 
              eventName={event.name}
                address={event.address}
              />
            
      </div>
    </div>
  )
}