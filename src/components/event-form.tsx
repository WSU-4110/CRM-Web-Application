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

interface Customer {
  phone: string
  firstName: string
}

interface InventoryItem {
  id: string
  name: string
}

export function EventForm() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [selectedInventory, setSelectedInventory] = useState<string[]>([])
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
      inventory: selectedInventory,
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
      <div>
        <Label htmlFor="name">Event Name</Label>
        <Input id="name" name="name" required />
      </div>

  {  customers.length !== 0 &&  <div>
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
      </div>}

      <div>
        <Label htmlFor="price">Price ($)</Label>
        <Input id="price" name="price" type="number" step="0.01" required />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" required />
      </div>

      <div>
        <Label htmlFor="time">Time</Label>
        <Input id="time" name="time" type="time" required />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" required />
      </div>

      <div>
        <Label>Inventory Items</Label>
        {inventory.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`inventory-${item.id}`}
              value={item.id}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedInventory([...selectedInventory, item.id])
                } else {
                  setSelectedInventory(selectedInventory.filter(id => id !== item.id))
                }
              }}
            />
            <Label htmlFor={`inventory-${item.id}`}>{item.name}</Label>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>

      <Button type="submit">Create Event</Button>
    </form>
  )
}