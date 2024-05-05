
import { logEvent, getEventById, getAllEvents, deleteEvent } from './SecurityProtocolService.mjs';
import SecurityProtocol from '../models/SecurityProtocol.mjs';

jest.mock('../models/SecurityProtocol.mjs');

describe('Security Protocol Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Log a new event', async () => {
        const mockEventData = {
            timestamp: new Date(),
            description: 'Unauthorized access attempt.',
            eventType: 'security breach',
            ip_address: '192.168.1.1',
            userID: 101
        };
        SecurityProtocol.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockEventData)
        }));

        const result = await logEvent(mockEventData);
        expect(result).toEqual(mockEventData);
        expect(SecurityProtocol).toHaveBeenCalled();
    });

    test('Retrieve an event by ID', async () => {
        const mockEvent = {
            _id: 'abc123',
            timestamp: new Date(),
            description: 'Unauthorized access attempt.',
            eventType: 'security breach',
            ip_address: '192.168.1.1',
            userID: 101
        };
        SecurityProtocol.findById.mockResolvedValue(mockEvent);

        const result = await getEventById('abc123');
        expect(result).toEqual(mockEvent);
        expect(SecurityProtocol.findById).toHaveBeenCalledWith('abc123');
    });

    test('Get all events', async () => {
        const mockEvents = [{
            _id: 'abc123',
            timestamp: new Date(),
            description: 'Unauthorized access attempt.',
            eventType: 'security breach',
            ip_address: '192.168.1.1',
            userID: 101
        }];
        SecurityProtocol.find.mockResolvedValue(mockEvents);

        const result = await getAllEvents();
        expect(result).toEqual(mockEvents);
        expect(SecurityProtocol.find).toHaveBeenCalled();
    });

    test('Delete an event', async () => {
        const mockId = 'abc123';
        SecurityProtocol.findByIdAndDelete.mockResolvedValue({ _id: mockId });

        const result = await deleteEvent(mockId);
        expect(result).toEqual({ _id: mockId });
        expect(SecurityProtocol.findByIdAndDelete).toHaveBeenCalledWith(mockId);
    });
});
