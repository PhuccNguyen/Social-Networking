import Post from "../models/Post.js";
import User from "../models/User.js";

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath, destination, createDate, status } = req.body;

        // Find the user who is creating the post
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new post document
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            destination,
            picturePath,
            userPicturePath: user.picturePath, // User's profile picture
            likes: new Map(),  // Initialize likes as an empty Map
            comments: [],      // Initialize comments as an empty array
        });

        // Save the new post to the database
        await newPost.save();

        // Return the newly created post
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//read
// Get all posts for the feed
export const getFeedPosts = async (req, res) => {
    try {
      const post = await Post.find();
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

// Get posts by a specific user
export const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await Post.find({ userId });
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };


// Like or unlike a post
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;  
        const { userId } = req.body;

        // Find the post to be liked/unliked
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user has already liked the post
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);  // Unlike the post
        } else {
            post.likes.set(userId, true);  // Like the post
        }

        // Update the post with the new likes object
        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            { likes: post.likes }, 
            { new: true }
        );

        res.status(200).json(updatedPost);  
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// ADD COMMENT
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, commentText } = req.body;

        // Tìm kiếm bài viết theo postId
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Tìm kiếm người dùng theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add the comment to the post with user information fetched from the database
        const newComment = {
            userId,
            firstName: user.firstName,
            lastName: user.lastName, 
            userPicturePath: user.picturePath,
            commentText,
            createdAt: new Date(),
        };
        post.comments.push(newComment);

        // Lưu lại bài viết sau khi thêm bình luận
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



