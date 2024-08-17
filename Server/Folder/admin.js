import VolunteerEvent from "./Volunteerevent.js";
import User from "../models/User.js";

// Create a new volunteer event
export const createEvent = async (req, res) => {
    try {
        const { title, description, location, date, organizerId } = req.body;

        // Check if the user is a main admin
        const organizer = await User.findById(organizerId);
        if (!organizer || organizer.role !== 'admin') {
            return res.status(403).json({ message: "Only main admins can create events" });
        }

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
        const newSignup = new SignupVolunteer({
            eventId,
            userId,
        });
        await newSignup.save();

        const event = await VolunteerEvent.findById(eventId);
        event.participants.push(userId);
        await event.save();

        res.status(200).json(newSignup);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Grant permissions to a user
export const grantPermissions = async (req, res) => {
    try {
        const { userId, role } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's role
        user.role = role;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
