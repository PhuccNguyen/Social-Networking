import Campaign from '../models/Campaign.js';

// Controller để tạo một chiến dịch mới
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
      campaignEndDate,
      milestones,
    } = req.body;

    // Lấy đường dẫn ảnh từ multer (nếu có)
    const imagePath = req.file ? `/assets/${req.file.filename}` : "";

    // Tạo một chiến dịch mới với các thông tin đã nhận từ body của request
    const newCampaign = new Campaign({
      title,
      description,
      imagePath,  // Lưu đường dẫn ảnh
      registrationStartDate,
      registrationEndDate,
      maxVolunteers,
      location,
      campaignStartDate,
      campaignEndDate,
      milestones,
      createdBy: req.user._id,  // Lấy thông tin người tạo từ req.user (được xác thực qua token)
    });

    // Lưu chiến dịch vào database
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);  // Trả về kết quả là chiến dịch vừa được tạo
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Failed to create campaign', error: error.message });
  }
};
