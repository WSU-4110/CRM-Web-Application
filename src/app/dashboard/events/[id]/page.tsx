"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/app/contexts/AuthContext"
import { EventMap } from "@/components/event-map"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface EventDetail {
  id: string
  name: string
  customer: string
  price: number
  date: string
  time: string
  address: string
  inventory: {
    count: number
    id: string
    image: string
    name: string
    price: string
  }[]
  expenses: {
    amount: string
    associatedEvent: string
    date: string
    merchant: string
    status: string
    type: string
  }[]
  notes?: string
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/api/events/${params.id}?userId=${user.uid}`)
      const data = await response.json()
      console.log(data)
      setEvent(data)
    }
    fetchEvent()
  }, [params.id])

  if (!event) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{event.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Event Expenses</CardTitle>
            <Button
              onClick={() => router.push('/dashboard/expenses')}
              className="bg-black hover:bg-emerald-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.expenses && event.expenses.length > 0 ? (
                  event.expenses.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell>${expense.amount}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${expense.status === 'Approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                          {expense.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto gap-4 pb-4">
              {event.inventory && event.inventory.length > 0 ? (
                event.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-[200px] border rounded-lg p-4 space-y-3"
                  >
                    <div className="relative h-32 w-full">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Quantity: {item.count}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-muted-foreground">
                  No inventory items found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}