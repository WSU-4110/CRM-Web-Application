import { EventService } from './EventService';

console.log('\n🧪 Starting EventService Tests...\n');

describe('EventService', () => {
  let eventService: EventService;
  const mockUserId = 'test-uid';
  const mockEventId = 'test-event-id';

  beforeEach(() => {
    eventService = new EventService();
    global.fetch = jest.fn();
  });

  describe('📥 fetchEvent', () => {
    console.log('Testing event fetching functionality...');

    it('✅ should fetch event successfully', async () => {
      console.log('  → Testing successful event fetch');
      const mockEvent = {
        id: mockEventId,
        name: 'Test Event',
        price: 1000
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent
      });

      const result = await eventService.fetchEvent(mockEventId, mockUserId);

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/events/${mockEventId}?userId=${mockUserId}`
      );
      expect(result).toEqual(mockEvent);
      console.log('  ✓ Successfully fetched event details');
    });

    it('❌ should handle fetch failure', async () => {
      console.log('  → Testing error handling for failed fetch');
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(
        eventService.fetchEvent(mockEventId, mockUserId)
      ).rejects.toThrow('Failed to fetch event');
      console.log('  ✓ Successfully handled fetch error');
    });
  });

  describe('🔄 updateEvent', () => {
    console.log('\nTesting event update functionality...');

    it('✅ should update event successfully', async () => {
      console.log('  → Testing successful event update');
      const mockEventData = {
        name: 'Updated Event',
        price: 2000
      };

      const mockResponse = { ...mockEventData, id: mockEventId };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await eventService.updateEvent(
        mockEventId,
        mockEventData,
        mockUserId
      );

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/events/${mockEventId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...mockEventData, userId: mockUserId })
        }
      );
      expect(result).toEqual(mockResponse);
      console.log('  ✓ Successfully updated event');
    });

    it('❌ should handle update failure', async () => {
      console.log('  → Testing error handling for failed update');
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(
        eventService.updateEvent(mockEventId, {}, mockUserId)
      ).rejects.toThrow('Failed to update event');
      console.log('  ✓ Successfully handled update error');
    });
  });

  describe('💰 generatePaymentLink', () => {
    console.log('\nTesting payment link generation...');

    it('✅ should generate payment link successfully', async () => {
      console.log('  → Testing successful payment link generation');
      const mockPaymentData = {
        price: 1000,
        eventName: 'Test Event',
        eventId: mockEventId
      };

      const mockResponse = { url: 'https://test-payment.com' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await eventService.generatePaymentLink(
        mockPaymentData.price,
        mockPaymentData.eventName,
        mockPaymentData.eventId
      );

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/stripe/create-checkout',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockPaymentData)
        }
      );
      expect(result).toEqual(mockResponse);
      console.log('  ✓ Successfully generated payment link');
    });

    it('❌ should handle payment link generation failure', async () => {
      console.log('  → Testing error handling for payment link generation');
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(
        eventService.generatePaymentLink(1000, 'Test Event', mockEventId)
      ).rejects.toThrow('Failed to generate payment link');
      console.log('  ✓ Successfully handled payment link generation error');
    });
  });

  describe('👥 fetchCustomers', () => {
    console.log('\nTesting customer fetching functionality...');

    it('✅ should fetch customers successfully', async () => {
      console.log('  → Testing successful customers fetch');
      const mockCustomers = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ customers: mockCustomers })
      });

      const result = await eventService.fetchCustomers(mockUserId);
      expect(result).toEqual({ customers: mockCustomers });
      console.log('  ✓ Successfully fetched customers');
    });
  });

  describe('📦 fetchAvailableInventory', () => {
    console.log('\nTesting inventory fetching functionality...');

    it('✅ should fetch inventory successfully', async () => {
      console.log('  → Testing successful inventory fetch');
      const mockInventory = [
        { id: '1', name: 'Item 1', count: 5 },
        { id: '2', name: 'Item 2', count: 10 }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ inventory: mockInventory })
      });

      const result = await eventService.fetchAvailableInventory(mockUserId);
      expect(result).toEqual({ inventory: mockInventory });
      console.log('  ✓ Successfully fetched inventory');
    });
  });

  afterAll(() => {
    console.log('\n✨ All EventService tests completed!\n');
  });
});
