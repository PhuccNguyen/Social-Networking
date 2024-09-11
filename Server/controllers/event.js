import Event from "../models/Event.js";
import User from "../models/User.js";

// Create a new event (Admin and Assistant Admin)
export const createEvent = async (req, res) => {
    try {
        const { title, description, location, date, organizerId } = req.body;
        const organizer = await User.findById(organizerId);

        if (organizer.role === "admin" || organizer.role === "assistantAdmin") {
            const newEvent = new Event({
                title,
                description,
                location,
                date,
                organizerId,
            });
            await newEvent.save();
            res.status(201).json(newEvent);
        } else {
            res.status(403).json({ message: "Only Admin or Assistant Admin can create events" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// User registers for an event
export const registerForEvent = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        const event = await Event.findById(eventId);
        const user = await User.findById(userId);

        if (!event) return res.status(404).json({ message: "Event not found" });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!event.participants.includes(userId)) {
            event.participants.push(userId);
            await event.save();
            res.status(200).json({ message: "Registered successfully" });
        } else {
            res.status(409).json({ message: "User already registered" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
