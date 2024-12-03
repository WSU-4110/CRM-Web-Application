import { EventFormService } from './EventFormService';
// test comment for commit part 2
console.log('\n🧪 Starting EventFormService Tests...\n');

describe('EventFormService', () => {
  let service: EventFormService;

  beforeEach(() => {
    service = new EventFormService();
    global.fetch = jest.fn();
  });

  describe('📥 fetchInitialData', () => {
    console.log('Testing fetchInitialData functionality...');

    it('✅ should fetch customers and inventory data successfully', async () => {
      console.log('  → Testing successful data fetch');
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
      console.log('  ✓ Successfully fetched both customers and inventory');
    });

    it('✅ should handle empty arrays', async () => {
      console.log('  → Testing empty data handling');
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
      console.log('  ✓ Successfully handled null/empty data');
    });
  });

  describe('🔄 calculateInventoryChange', () => {
    console.log('\nTesting inventory calculations...');

    const mockItem = {
      id: '1',
      name: 'Test Item',
      count: '5',
      price: '10',
      image: 'test.jpg'
    };

    it('✅ should add new item to inventory', () => {
      console.log('  → Testing adding new item');
      const result = service.calculateInventoryChange([], mockItem, 1);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        ...mockItem,
        count: 1
      });
      console.log('  ✓ Successfully added new item to inventory');
    });

    it('✅ should remove item when count becomes zero', () => {
      console.log('  → Testing item removal');
      const initial = [{
        ...mockItem,
        count: 1
      }];
      const result = service.calculateInventoryChange(initial, mockItem, -1);
      expect(result).toHaveLength(0);
      console.log('  ✓ Successfully removed item when count reached zero');
    });

    it('✅ should not exceed available inventory', () => {
      console.log('  → Testing inventory limits');
      const initial = [{
        ...mockItem,
        count: 5
      }];
      const result = service.calculateInventoryChange(initial, mockItem, 1);
      expect(result).toEqual(initial);
      console.log('  ✓ Successfully prevented exceeding inventory limits');
    });
  });

  describe('📤 submitEventForm', () => {
    console.log('\nTesting form submission...');

    it('✅ should submit form data successfully', async () => {
      console.log('  → Testing successful form submission');
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
      console.log('  ✓ Successfully submitted form data');
    });

    it('❌ should handle submission errors', async () => {
      console.log('  → Testing error handling');
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(
        service.submitEventForm({} as any)
      ).rejects.toThrow('Failed to submit event form');
      console.log('  ✓ Successfully handled submission error');
    });
  });

  afterAll(() => {
    console.log('\n✨ All EventFormService tests completed!\n');
  });
}); 
