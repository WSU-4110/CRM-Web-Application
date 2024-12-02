interface Customer {
    phone: string;
    firstName: string;
  }
  
  interface InventoryItem {
    id: string;
    name: string;
    count: string;
    price: string;
    image: string;
  }
  
  interface SelectedInventoryItem {
    id: string;
    name: string;
    count: number;
    price: string;
    image: string;
  }
  
  interface EventFormData {
    name: string;
    customerId: string;
    price: number;
    date: string;
    time: string;
    address: string;
    inventory: SelectedInventoryItem[];
    notes?: string;
    userId: string;
  }
  
  export class EventFormService {
    async fetchInitialData(userId: string) {
      const [customersRes, inventoryRes] = await Promise.all([
        fetch(`/api/customers?userId=${userId}`),
        fetch(`/api/inventory?userId=${userId}`)
      ]);
  
      if (!customersRes.ok) throw new Error('Failed to fetch customers');
      if (!inventoryRes.ok) throw new Error('Failed to fetch inventory');
  
      const customersData = await customersRes.json();
      const inventoryData = await inventoryRes.json();
  
      return {
        customers: Array.isArray(customersData.customers) ? customersData.customers : [],
        inventory: Array.isArray(inventoryData.inventory) ? inventoryData.inventory : []
      };
    }
  
    calculateInventoryChange(
      selectedInventory: SelectedInventoryItem[],
      item: InventoryItem,
      change: number
    ): SelectedInventoryItem[] {
      const existingItem = selectedInventory.find(i => i.id === item.id);
      const currentCount = existingItem?.count || 0;
      const newCount = currentCount + change;
  
      if (newCount === 0) {
        return selectedInventory.filter(i => i.id !== item.id);
      }
  
      if (newCount > parseInt(item.count)) {
        return selectedInventory;
      }
  
      if (existingItem) {
        return selectedInventory.map(i => 
          i.id === item.id ? { ...i, count: newCount } : i
        );
      }
  
      return [...selectedInventory, {
        id: item.id,
        name: item.name,
        count: newCount,
        price: item.price,
        image: item.image
      }];
    }
  
    async submitEventForm(formData: EventFormData) {
      const response = await fetch('/api/events', {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit event form');
      }
  
      return response.json();
    }
  } 