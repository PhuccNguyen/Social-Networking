import Campaign from '../models/Campaign.js';  // Import model Campaign
import User from '../models/User.js';  // Import model User

// Controller để tạo chiến dịch mới
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
      milestones
    } = req.body;

    const createdBy = req.user._id;  // Lấy thông tin người tạo chiến dịch từ req.user (có được sau khi xác thực qua token)
    const imagePath = req.file ? `/assets/${req.file.filename}` : ""; // Lấy đường dẫn của ảnh nếu có upload

    // Kiểm tra xem người tạo có tồn tại không
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tạo một chiến dịch mới với các thông tin đã nhận từ body của request
    const newCampaign = new Campaign({
      title,
      description,
      createdBy,
      registrationStartDate,
      registrationEndDate,
      maxVolunteers,
      location,
      campaignStartDate,
      campaignEndDate,
      milestones,
      imagePath,
      volunteerCount: 0,  // Ban đầu chưa có ai tham gia
      progress: 0,        // Ban đầu tiến độ bằng 0
      status: 'ongoing',  // Trạng thái ban đầu là ongoing
      volunteers: [],     // Mảng rỗng, chưa có tình nguyện viên nào
    });

    // Lưu chiến dịch vào database
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);  // Trả về kết quả là chiến dịch vừa được tạo
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Failed to create campaign', error: error.message });
  }
};
