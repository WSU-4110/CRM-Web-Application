export class EventService {
    async fetchEvent(eventId: string, userId: string) {
     const response = await fetch(`/api/events/${eventId}?userId=${userId}`);
     if (!response.ok) throw new Error('Failed to fetch event');
     return response.json();
   }
    async fetchAvailableInventory(userId: string) {
     const response = await fetch(`/api/inventory?userId=${userId}`);
     if (!response.ok) throw new Error('Failed to fetch inventory');
     return response.json();
   }
    async fetchCustomers(userId: string) {
     const response = await fetch(`/api/customers?userId=${userId}`);
     if (!response.ok) throw new Error('Failed to fetch customers');
     return response.json();
   }
    async updateEvent(eventId: string, eventData: any, userId: string) {
     const response = await fetch(`/api/events/${eventId}`, {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ ...eventData, userId }),
     });
     if (!response.ok) throw new Error('Failed to update event');
     return response.json();
   }
    async generatePaymentLink(price: number, eventName: string, eventId: string) {
     const response = await fetch('/api/stripe/create-checkout', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         price,
         eventName,
         eventId,
       }),
     });
     if (!response.ok) throw new Error('Failed to generate payment link');
     return response.json();
   }
}