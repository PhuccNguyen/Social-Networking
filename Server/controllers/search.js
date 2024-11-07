import User from "../models/User.js";
import Post from "../models/Post.js";
import Campaign from "../models/Campaign.js";

export const searchInformation = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const users = await User.find({
      userName: { $regex: query, $options: "i" },
    }).select("_id userName picturePath");

    const posts = await Post.find({
      description: { $regex: query, $options: "i" },
    }).select("_id description createdAt");

    const campaigns = await Campaign.find({
      title: { $regex: query, $options: "i" },
    }).select("_id title location");

    res.status(200).json({ users, posts, campaigns });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Failed to perform search" });
  }
};
