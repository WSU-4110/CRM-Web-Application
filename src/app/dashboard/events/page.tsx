import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EventsTable } from "@/components/events-table"
import Link from "next/link"

export default async function EventsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events & Jobs</h1>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Event
          </Button>
        </Link>
      </div>
      <EventsTable />
    </div>
  )
}