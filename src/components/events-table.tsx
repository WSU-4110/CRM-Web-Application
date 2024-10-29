"use client"
import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"

interface Event {
    id: string
    name: string
    customer: string
    price: number
    date: string
    time: string,
    customerId: string
}

export function EventsTable() {
    const [events, setEvents] = useState<Event[]>([])
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await fetch(`/api/events?userId=${user.uid}`)
            const data = await response.json()
            setEvents(data.events)
            console.log(data.events)
        }
        fetchEvents()
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map((event) => (
                    <TableRow
                        key={event.id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => router.push(`/dashboard/events/${event.id}`)}
                    >
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.customerId}</TableCell>
                        <TableCell>${event.price}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.time}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}