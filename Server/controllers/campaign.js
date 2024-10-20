import Campaign from '../models/Campaign.js'; // Import the Campaign model
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
      milestones: JSON.parse(milestones),
      createdBy: mongoose.Types.ObjectId(createdBy),  // Ensure that this is an ObjectId
      imageCampaing,  
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
