import mongoose from 'mongoose';
import Campaign from '../models/Campaign.js';

// Controller for creating a new campaign
export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      registrationStartDate,
      registrationEndDate,
      maxVolunteers,
      location,
      campaignStartDate,
      campaignStartTime,
      campaignEndDate,
      campaignEndTime,
      milestones,
      createdBy
    } = req.body;

    // Parse milestones if needed
    let parsedMilestones = [];
    if (milestones) {
      parsedMilestones = JSON.parse(milestones);
    }

    // Handle the image upload (from multer)
    const imageCampaing = req.file ? req.file.filename : null;

    // Create a new Campaign document
    const newCampaign = new Campaign({
      title,
      description,
      registrationStartDate,
      registrationEndDate,
      maxVolunteers,
      location,
      campaignStartDate,          
      campaignStartTime,
      campaignEndDate,
      campaignEndTime,
      milestones: parsedMilestones,
      createdBy: new mongoose.Types.ObjectId(createdBy),  // Ensure that this is an ObjectId
      imageCampaing,  // Handle image upload
    });

    // Save the campaign to the database
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};



// Controller to get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    // Fetch all campaigns and populate the 'createdBy' field with assistant admin details
    const campaigns = await Campaign.find()
      .populate('createdBy', 'firstName lastName picturePath') // Populate these fields
      .exec();

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};
