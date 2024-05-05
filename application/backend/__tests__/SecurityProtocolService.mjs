
import SecurityProtocol from '../models/SecurityProtocol.mjs';

export const logEvent = async (eventData) => {
    const event = new SecurityProtocol(eventData);
    return await event.save();
};

export const getEventById = async (id) => {
    return await SecurityProtocol.findById(id);
};

export const getAllEvents = async () => {
    return await SecurityProtocol.find({});
};

export const deleteEvent = async (id) => {
    return await SecurityProtocol.findByIdAndDelete(id);
};
