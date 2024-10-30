import User from '../models/User.js';
import mongoose from 'mongoose';

// Fetch all users for the Manage Roles page
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id name email role lastLogin picturePath isActive'); // Include isActive field
    const usersWithId = users.map(user => ({
      id: user._id, // Map _id to id for frontend compatibility
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      picturePath: user.picturePath,
      isActive: user.isActive // Include isActive in response
    }));

    res.status(200).json(usersWithId);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};



// Promote a user to Assistant Admin
export const promoteToAssistantAdmin = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const user = await User.findByIdAndUpdate(id, { role: 'assistantAdmin' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User promoted to Assistant Admin', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to promote user' });
  }
};

// Demote to User
export const demoteToUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const user = await User.findByIdAndUpdate(id, { role: 'user' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User demoted to User', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to demote user' });
  }
};

// toggleUserActiveStatus user is active and deactivated
export const toggleUserActiveStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user status" });
  }
};
