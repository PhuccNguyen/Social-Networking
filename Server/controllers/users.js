import User from "../models/User.js";
// import SignupVolunteer from "../models/SignupVolunteer.js";
// import VolunteerEvent from "../Folder/Volunteerevent.js";

/* READ */ 
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
    
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath }) => { 
                return { _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    } 
};

/* UPDATE */  
export const addRemoveFriends = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId); 

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath }) => { 
                return { _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* REGISTER FOR EVENT */
export const registerForEvent = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        // Check if the event exists
        const event = await VolunteerEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is already registered for the event
        const existingSignup = await SignupVolunteer.findOne({ eventId, userId });
        if (existingSignup) {
            return res.status(409).json({ message: "User already registered for this event" });
        }

        // Register the user for the event
        const newSignup = new SignupVolunteer({
            eventId,
            userId,
        });
        await newSignup.save();

        // Add the user to the event's participants list
        event.participants.push(userId);
        await event.save();

        res.status(201).json(newSignup);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* UPDATE USER ROLE */
export const updateUserRole = async (req, res) => {
    try {
        const { id, role } = req.body;

        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's role
        user.role = role;
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
