"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/app/contexts/AuthContext"
import { Plus, Minus } from "lucide-react"
import Image from "next/image"

interface Customer {
  phone: string
  firstName: string
}

interface InventoryItem {
  id: string
  name: string
  count: string
  price: string
  image: string
}

interface SelectedInventoryItem {
  id: string
  name: string
  count: number
  price: string
  image: string
}

export function EventForm() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [selectedInventory, setSelectedInventory] = useState<SelectedInventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const auth = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
     
        const userId =  auth.user.uid

        const customersRes = await fetch(`/api/customers?userId=${userId}`)
        const customersData = await customersRes.json()
        
        if (customersData.error) {
          throw new Error(customersData.error)
        }
        
        setCustomers(Array.isArray(customersData.customers) ? customersData.customers : [])

    
        const inventoryRes = await fetch(`/api/inventory?userId=${userId}`)
        const inventoryData = await inventoryRes.json()
        console.log(inventoryData)
        setInventory(Array.isArray(inventoryData.inventory) ? inventoryData.inventory : [])

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleQuantityChange = (item: InventoryItem, change: number) => {
    const existingItem = selectedInventory.find(i => i.id === item.id)
    const currentCount = existingItem?.count || 0
    const newCount = currentCount + change

    if (newCount === 0) {
      setSelectedInventory(selectedInventory.filter(i => i.id !== item.id))
      return
    }

    if (newCount > parseInt(item.count)) return

    if (existingItem) {
      setSelectedInventory(selectedInventory.map(i => 
        i.id === item.id ? { ...i, count: newCount } : i
      ))
    } else {
      setSelectedInventory([...selectedInventory, {
        id: item.id,
        name: item.name,
        count: newCount,
        price: item.price,
        image: item.image
      }])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const eventData = {
      name: formData.get("name"),
      customerId: formData.get("customer"),
      price: parseFloat(formData.get("price") as string),
      date: formData.get("date"),
      time: formData.get("time"),
      address: formData.get("address"),
      inventory: selectedInventory.length > 0 ? selectedInventory : [],
      notes: formData.get("notes"),
      userId: auth.user.uid
    }
    const userId =  auth.user.uid
    const response = await fetch(`/api/events`, {
      method: "POST",
      body: JSON.stringify(eventData),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      router.push("/dashboard/events")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Event Name</Label>
          <Input id="name" name="name" required />
        </div>

        {customers.length !== 0 && (
          <div>
            <Label htmlFor="customer">Customer</Label>
            <Select name="customer" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.phone} value={customer.firstName}>
                    {customer.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="price">Price ($)</Label>
        <Input id="price" name="price" type="number" step="0.01" required />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>

        <div>
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" type="time" required />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea 
          id="address" 
          name="address" 
          required 
          className="h-10 py-2 resize-none"
        />
      </div>

      <div>
        <Label>Inventory Items</Label>
        <div className="flex overflow-x-auto gap-4 pb-4 mt-2">
          {inventory.map((item) => {
            const selected = selectedInventory.find(i => i.id === item.id)
            return (
              <div
                key={item.id}
                className="flex-shrink-0 w-[200px] border rounded-lg p-4 space-y-3"
              >
                <div className="relative h-32 w-full">
                  <img src={item.image} alt={item.name} className="object-cover rounded-md"/>
                </div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  Available: {item.count}
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => handleQuantityChange(item, -1)}
                    disabled={!selected}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">
                    {selected?.count || 0}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => handleQuantityChange(item, 1)}
                    disabled={selected?.count === parseInt(item.count)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>

      <Button type="submit">Create Event</Button>
    </form>
  )
}