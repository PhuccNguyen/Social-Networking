import Post from "../models/Post.js";
import User from "../models/User.js";

// Create 
export const createPost = async (req, res) => {
    try {
      const { userId, description, picturePath, destination, createDate, status } = req.body;
      const user = await User.findById(userId);
        const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        destination,
        description,
        picturePath,
        UserpicturePath: user.picturePath,
        likes: new Map(),  // Initialize likes as an empty Map
        comments: [],      
      });
  
      await newPost.save();
  
      const post = await Post.find();
      res.status(201).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  

// getFeedPosts // Retrieves all posts in the database and returns them to the frontend.
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);     
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}


// getuserpost Retrieves all posts created by a specific user and returns them.
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params();
        const post = await Post.find({ userId });
        res.status(200).json(post);     
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}


// Like or unlike a post
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;  // Corrected params access
        const { userId } = req.body;
        const post = await Post.findById(id);  // Use findById

        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });
        res.status(200).json(updatedPost);  // Changed to 200
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}