import bcrypt from "bcrypt";
// import jwt, { sign } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            userName,
            mobile,
            email,
            intro,
            gender,
            birthday,
            status,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // Check if required fields are provided
        if (!firstName || !lastName || !userName || !mobile || !email || !intro || !gender || !birthday || !status || !password) {
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
            firstName,
            lastName,
            userName,
            mobile,
            email,
            intro,
            gender,
            birthday,
            status,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



     /* LOGIN USER */ 
export const login = async (req, res) => {
    try {
      const { userName, mobile, email, password } = req.body;

    // Find the user by email, mobile or username
      const user = await User.findOne({ userName: userName, mobile: mobile, email: email });
      if (!user){
            return res.status(404).json({ msg: "User don't exist" });
        }
      
    // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(404).json({ msg: "Don't Match Or Account Don't Exist" });
    }
    /*Create A JWT Token*/ 
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
    delete user.password;
    
    // Send the token and user information in the response
    res.status(200).json({ token, user });
    
    // Send response without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ token, user: userWithoutPassword });

    // Last login time
        user.lastLogin = new Date();
        await user.save();

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
