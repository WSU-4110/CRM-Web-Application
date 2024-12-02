import { CustomerService } from '@/lib/CustomerService';
import { Customer } from "./CustomerService";
global.fetch = jest.fn();
describe('CustomerService', () => {
  const customerService = new CustomerService();
  const userId = 'testuser';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('test 1: fetchCustomers should return a list of customers', async () => {
    const mockResponse = {
      customers: [
        { phone: '173500', firstName: 'Taaseen', lastName: 'Khan', email: 't.k@example.com' },
        { phone: '274080', firstName: 'Nuz', lastName: 'Abu', email: 'n.z@example.com' },
      ],
    }; // first mock check
    (fetch as jest.Mock).mockResolvedValueOnce({

      ok: true,

      json: async () => mockResponse,});


    const customers = await customerService.fetchCustomers(userId);

    expect(customers).toEqual(mockResponse.customers);

    expect(fetch).toHaveBeenCalledWith(`/api/customers?userId=${userId}`);
  });

  it('Test 2: fetchCustomers should throw error on failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error, fail, went wrong' }),
    });

    await expect(customerService.fetchCustomers(userId)).rejects.toThrow('Failed to fetch customers');
  }
);

  it('Test 3: addCustomer should add a customer', async () => {
    const newCustomer = {phoneNumber: '123456', firstName: 'User', lastName: 'Test', emailAddress: 't.u@example.com' };
    const mockResponse = { id: 'customera', ...newCustomer };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const response = await customerService.addCustomer(newCustomer, userId);
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('/api/customers', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ ...newCustomer, userId }),
    }
)
);
  }
);

  it('Test 4: addCustomer should throw error on failure', async () => {const newCustomer: Omit<Customer, "id"> = {
    firstName: 'Spiel',
    lastName: 'Berg',
    phoneNumber: '1234567890',
    emailAddress: 'S.B@example.com',
  };  
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Something went wrong' }),
    });

    await expect(customerService.addCustomer(newCustomer, userId)).rejects.toThrow('Error, could not add customer');
  });

  it('Test 5: updateCustomer should update customer information', async () => {
    const customerId = 'customera';
    const updatedData = { phoneNumber: '55555' };
    const mockResponse = { id: customerId, ...updatedData };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await customerService.updateCustomer(customerId, updatedData);
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`/api/customers/${customerId}`, expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }));
  });

  it('Test 6: deleteCustomer should delete a customer', async () => {
    const customerId = 'customera';
    const mockResponse = { message: ' deleted customer  successfully' };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await customerService.deleteCustomer(customerId);
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`/api/customers/${customerId}`, expect.objectContaining({
      method: 'DELETE',
    }));
  });
});
