import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            firstName, lastName,
            userName, mobile,
            email, intro,
            gender, birthday,
            status, password,
            picturePath, friends,
            location, occupation
            } = req.body;

        console.log ("Receive Data: You Inputed :", req.body);  // Add logging to see received data

        // Check if required fields are provided
        if (!firstName || !lastName || 
            !userName || !mobile || 
            !email || !intro || 
            !gender || !birthday || 
            !status || !password || 
            !location || !occupation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ userName }, { email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName,
            userName, mobile,
            email, intro,
            gender, birthday,
            status,
            password: passwordHash,
            picturePath, friends,
            location, occupation,
            // viewedProfile: Math.floor(Math.random() * 1000),
            // impressions: Math.floor(Math.random() * 1000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to register user" });
    }
};



// LOGIN USER 
export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Find the user by email, mobile or username
        const user = await User.findOne({ 
            $or: [{ email: identifier }, { mobile: identifier }, { userName: identifier }]
        });

        if (!user) {
            return res.status(404).json({ msg: "User does not exist!" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

        // Remove password before returning user data
        const { password: _, ...userWithoutPassword } = user.toObject();
        
        // Send token and user info in the response
        res.status(200).json({ token, user: userWithoutPassword });

    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
