import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  registrationStartDate: {
    type: Date,
    required: true,
  },
  registrationEndDate: {
    type: Date,
    required: true,
  },
  maxVolunteers: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  campaignStartDate: {
    type: Date,
    required: true,
  },
  campaignStartTime: {
    type: String,
    required: true,
  },
  campaignEndDate: {
    type: Date,
    required: true,
  },
  campaignEndTime: {
    type: String,
    required: true,
  },
  milestones: {
    type: Array,
    default: [],
  },
  imageCampaing: {
    type: String, 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true,
  },
  status: {
    type: String,
    enum: ['enabled', 'disabled'],
    default: 'enabled',
  },
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', CampaignSchema);
export default Campaign;
