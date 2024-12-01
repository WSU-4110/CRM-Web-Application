"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/app/contexts/AuthContext"
import { EventMap } from "@/components/event-map"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, PlusCircle, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EventService } from "@/lib/EventService"

interface EventDetail {
  id: string
  name: string
  customer: string
  customerId: string  
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

interface Customer {
  firstName: string
 
  phone: string
}



export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedEvent, setEditedEvent] = useState<EventDetail | null>(null)
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false)
  const [availableInventory, setAvailableInventory] = useState<EventDetail['inventory']>([])
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const eventService = new EventService()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await eventService.fetchEvent(params.id, user.uid)
        setEvent(eventData)

        const inventoryData = await eventService.fetchAvailableInventory(user.uid)
        setAvailableInventory(inventoryData.inventory || [])

        const customerData = await eventService.fetchCustomers(user.uid)
        setCustomers(customerData.customers || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [params.id, user.uid])

  const handleUpdateEvent = async () => {
    try {
      const updatedEvent = await eventService.updateEvent(params.id, editedEvent!, user.uid)
      setEvent(updatedEvent)
      setIsEditing(false)
      setIsInventoryDialogOpen(false)
      toast({
        title: "Success",
        description: "Event updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      })
    }
  }

  const handleUpdateInventory = (itemId: string, count: number) => {
    if (!editedEvent) return
    
    setEditedEvent(prev => ({
      ...prev!,
      inventory: prev!.inventory.map(item =>
        item.id === itemId ? { ...item, count } : item
      )
    }))
  }

  const handleRemoveInventory = (itemId: string) => {
    if (!editedEvent) return
    
    setEditedEvent(prev => ({
      ...prev!,
      inventory: prev!.inventory.filter(item => item.id !== itemId)
    }))
  }

  const handleAddInventory = (item: EventDetail['inventory'][0], count: number) => {
    if (!editedEvent) return
    
    setEditedEvent(prev => ({
      ...prev!,
      inventory: [...prev!.inventory, { ...item, count }]
    }))
  }

  const generatePaymentLink = async () => {
    try {
      const response = await eventService.generatePaymentLink(
        event.price,
        event.name,
        event.id
      )
      setPaymentLink(response.url)
      toast({
        title: "Success",
        description: "Payment link generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate payment link",
        variant: "destructive",
      })
    }
  }

  const copyPaymentLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      toast({
        title: "Success",
        description: "Payment link copied to clipboard",
      });
    }
  };

  if (!event) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <div className="flex gap-2">
          {paymentLink ? (
            <Button
              onClick={copyPaymentLink}
              className="bg-green-600 hover:bg-green-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Payment Link
            </Button>
          ) : (
            <Button
              onClick={generatePaymentLink}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Generate Payment Link
            </Button>
          )}
          <Button
            onClick={() => {
              setEditedEvent(event)
              setIsEditing(true)
            }}
            className="bg-black hover:bg-emerald-700"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Event
          </Button>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[625px] w-[600px] p-6">
          <DialogHeader>
            <DialogTitle>Edit Event Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="grid gap-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={editedEvent?.name || ''}
                onChange={(e) => setEditedEvent(prev => ({ ...prev!, name: e.target.value }))}
              />
            </div>

            {customers.length !== 0 && (
          <div>
            <Label htmlFor="customer">Customer</Label>
            <Select name="customer" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto z-[9999]">
                {customers.map((customer) => (
                  <SelectItem key={customer.phone} value={customer.firstName}>
                    {customer.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={editedEvent?.price || ''}
                onChange={(e) => setEditedEvent(prev => ({ ...prev!, price: Number(e.target.value) }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={editedEvent?.date || ''}
                onChange={(e) => setEditedEvent(prev => ({ ...prev!, date: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={editedEvent?.time || ''}
                onChange={(e) => setEditedEvent(prev => ({ ...prev!, time: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editedEvent?.address || ''}
                onChange={(e) => setEditedEvent(prev => ({ ...prev!, address: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editedEvent?.notes || ''}
                onChange={(e) => setEditedEvent(prev => ({ ...prev!, notes: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <dt className="font-semibold">Customer</dt>
              <dd>{event.customerId}</dd>
              
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Event Inventory</CardTitle>
            <Button
              onClick={() => {
                setEditedEvent(event)
                setIsInventoryDialogOpen(true)
              }}
              className="bg-black hover:bg-emerald-700"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Inventory
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
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

      <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event Inventory</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-semibold">Current Event Inventory</h3>
            {editedEvent?.inventory.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Label htmlFor={`quantity-${item.id}`}>Quantity:</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={item.count}
                      onChange={(e) => handleUpdateInventory(item.id, parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveInventory(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <h3 className="font-semibold mt-6">Available Inventory</h3>
            {availableInventory
              .filter(item => !editedEvent?.inventory.some(eventItem => eventItem.id === item.id))
              .map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Label htmlFor={`add-quantity-${item.id}`}>Quantity:</Label>
                      <Input
                        id={`add-quantity-${item.id}`}
                        type="number"
                        defaultValue="1"
                        className="w-20"
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById(`add-quantity-${item.id}`) as HTMLInputElement
                          const count = parseInt(input.value)
                          handleAddInventory(item, count)
                        }}
                        className="ml-2"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsInventoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}