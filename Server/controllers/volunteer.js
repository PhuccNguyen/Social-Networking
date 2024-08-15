import VolunteerEvent from "../models/Volunteerevent.js";

// Create a new volunteer event
export const createEvent = async (req, res) => {
    try {
        const { title, description, location, date, organizerId } = req.body;
        const newEvent = new VolunteerEvent({
            title,
            description,
            location,
            date,
            organizerId,
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Get all volunteer events
export const getEvents = async (req, res) => {
    try {
        const events = await VolunteerEvent.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get a single volunteer event by ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await VolunteerEvent.findById(id);
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Sign up for a volunteer event
export const signupForEvent = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        const event = await VolunteerEvent.findById(eventId);
        event.participants.push(userId);
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
