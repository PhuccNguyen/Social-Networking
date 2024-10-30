import User from '../models/User.js';
import mongoose from 'mongoose';

// Fetch all users for the Manage Roles page
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'id name email role lastLogin picturePath'); // Select only required fields
    res.status(200).json(users);
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
