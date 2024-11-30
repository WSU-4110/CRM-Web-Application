import { EventFormService } from './EventFormService';

describe('EventFormService', () => {
  let service: EventFormService;
  
  beforeEach(() => {
    service = new EventFormService();
    global.fetch = jest.fn();
  });

  describe('fetchInitialData', () => {
    it('should fetch customers and inventory data successfully', async () => {
      const mockCustomers = [{ firstName: 'John', phone: '123' }];
      const mockInventory = [{ id: '1', name: 'Item 1', count: '5' }];

      (global.fetch as jest.Mock)
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ customers: mockCustomers })
        }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ inventory: mockInventory })
        }));

      const result = await service.fetchInitialData('user123');

      expect(result).toEqual({
        customers: mockCustomers,
        inventory: mockInventory
      });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle empty arrays', async () => {
      (global.fetch as jest.Mock)
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ customers: null })
        }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ inventory: null })
        }));

      const result = await service.fetchInitialData('user123');

      expect(result).toEqual({
        customers: [],
        inventory: []
      });
    });
  });

  describe('calculateInventoryChange', () => {
    const mockItem = {
      id: '1',
      name: 'Test Item',
      count: '5',
      price: '10',
      image: 'test.jpg'
    };

    it('should add new item to inventory', () => {
      const result = service.calculateInventoryChange([], mockItem, 1);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        ...mockItem,
        count: 1
      });
    });

    it('should remove item when count becomes zero', () => {
      const initial = [{
        ...mockItem,
        count: 1
      }];
      const result = service.calculateInventoryChange(initial, mockItem, -1);
      expect(result).toHaveLength(0);
    });

    it('should not exceed available inventory', () => {
      const initial = [{
        ...mockItem,
        count: 5
      }];
      const result = service.calculateInventoryChange(initial, mockItem, 1);
      expect(result).toEqual(initial);
    });
  });

  describe('submitEventForm', () => {
    it('should submit form data successfully', async () => {
      const mockFormData = {
        name: 'Test Event',
        customerId: 'customer123',
        price: 100,
        date: '2024-03-20',
        time: '14:00',
        address: 'Test Address',
        inventory: [],
        userId: 'user123'
      };

      const mockResponse = { id: 'event123', ...mockFormData };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await service.submitEventForm(mockFormData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/events',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockFormData)
        }
      );
    });

    it('should handle submission errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(
        service.submitEventForm({} as any)
      ).rejects.toThrow('Failed to submit event form');
    });
  });
}); 