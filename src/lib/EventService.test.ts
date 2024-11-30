import { EventService } from './EventService';

describe('EventService', () => {
 let eventService: EventService;
 const mockUserId = 'test-uid';
 const mockEventId = 'test-event-id';
  beforeEach(() => {
   eventService = new EventService();
   global.fetch = jest.fn();
 });
  describe('fetchEvent', () => {
   it('should fetch event successfully', async () => {
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
   });
    it('should throw error when fetch fails', async () => {
     (global.fetch as jest.Mock).mockResolvedValueOnce({
       ok: false
     });
      await expect(
       eventService.fetchEvent(mockEventId, mockUserId)
     ).rejects.toThrow('Failed to fetch event');
   });
 });
  describe('updateEvent', () => {
   it('should update event successfully', async () => {
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
   });
 });
  describe('generatePaymentLink', () => {
   it('should generate payment link successfully', async () => {
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
   });
 });
});