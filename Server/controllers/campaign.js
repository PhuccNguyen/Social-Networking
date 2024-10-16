import Campaign from '../models/Campaign.js'; // Import the Campaign model

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
      milestones: JSON.parse(milestones),  // Parse milestones if it's sent as a JSON string
      createdBy,  // Ensure createdBy is passed from the frontend
      image: req.file ? req.file.filename : null,  // Use multer to handle image upload
    });
    
    // Save the campaign to the database
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};
