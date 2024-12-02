export interface Customer {
    id?: string;
    firstName: string; // Separate firstName
    lastName: string;  // Separate lastName
    phoneNumber: string;
    emailAddress: string;
  }  
  export class CustomerService {
    async fetchCustomers(userId: string) {
      const response = await fetch(`/api/customers?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      return Array.isArray(data.customers) ? data.customers : [];
    }
    // for add testing
    async addCustomer(newCustomer: Omit<Customer, 'id'>, userId: string) {
      const response = await fetch('/api/customers', {
        method: 'POST',
        body: JSON.stringify({
          ...newCustomer,
          userId
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error, could not add customer');
      }
      return response.json();
    }
  
    // for updating
    async updateCustomer(customerId: string, updatedData: Partial<Customer>) {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update customer');
      }
      return response.json();
    }
    // for deleting
    async deleteCustomer(customerId: string) {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      return response.json();
    }
  }
  