import mongoose from 'mongoose';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';


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



// Controller to get all campaigns created by the logged-in user
export const getAllCampaigns = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID

    // Fetch all campaigns where createdBy matches the logged-in user's ID
    const campaigns = await Campaign.find({ createdBy: userId })
      .populate('createdBy', 'firstName lastName picturePath')
      .exec();

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};


// Controller to handle user registration for a campaign
export const registerCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user.id; // Extract the userId from the verified JWT token

    // Find the campaign by ID
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the user is already registered for the campaign
    if (user.joinedCampaigns.includes(campaignId)) {
      return res.status(400).json({ message: "You are already registered for this campaign" });
    }

    // Add the campaign to the user's joined campaigns
    user.joinedCampaigns.push(campaignId);
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Successfully registered for the campaign" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getManagedCampaigns = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Find campaigns created by the logged-in assistant admin or admin
    const campaigns = await Campaign.find({ createdBy: userId });

    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ message: "No campaigns found for this user" });
    }

    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Edit a specific campaign
export const editCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const updatedData = req.body;

  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(campaignId, updatedData, { new: true });
    if (!updatedCampaign) return res.status(404).json({ error: 'Campaign not found' });
    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Error editing campaign' });
  }
};

// Delete a specific campaign
export const deleteCampaign = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(campaignId);
    if (!deletedCampaign) return res.status(404).json({ error: 'Campaign not found' });
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting campaign'});
  }
};

export const getCampaignCounts = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user.id;

    // Count Ongoing Campaigns
    const ongoingCount = await Campaign.countDocuments({
      createdBy: userId,
      $or: [
        {
          registrationStartDate: { $lte: now },
          registrationEndDate: { $gte: now },
        },
        {
          registrationEndDate: { $lt: now },
          campaignStartDate: { $gt: now },
        }
      ],
    });

    const startedCount = await Campaign.countDocuments({
      createdBy: userId,
      campaignStartDate: { $lte: now },
      campaignEndDate: { $gte: now },
    });

    const endedCount = await Campaign.countDocuments({
      createdBy: userId,
      campaignEndDate: { $lt: now },
    });

    res.status(200).json({
      ongoing: ongoingCount,
      started: startedCount,
      ended: endedCount,
    });
  } catch (error) {
    console.error("Error fetching campaign counts:", error);
    res.status(500).json({ error: "Failed to fetch campaign counts" });
  }
};


export const getCampaignsByStatus = async (req, res) => {
  const { status } = req.query;
  const now = new Date();
  const userId = req.user.id;

  try {
    let campaigns;

    if (status === "ongoing") {
      // Ongoing campaigns (either in registration period or waiting to start)
      campaigns = await Campaign.find({
        createdBy: userId,
        $or: [
          {
            // Within registration period
            registrationStartDate: { $lte: now },
            registrationEndDate: { $gte: now },
          },
          {
            // After registration period but before campaign start
            registrationEndDate: { $lt: now },
            campaignStartDate: { $gt: now },
          }
        ],
      });
    } else if (status === "started") {
      // Started campaigns (currently in progress)
      campaigns = await Campaign.find({
        createdBy: userId,
        campaignStartDate: { $lte: now },
        campaignEndDate: { $gte: now },
      });
    } else if (status === "ended") {
      // Ended campaigns (already completed)
      campaigns = await Campaign.find({
        createdBy: userId,
        campaignEndDate: { $lt: now },
      });
    } else {
      return res.status(400).json({ error: "Invalid status" });
    }

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns by status:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};


