import Post from "../models/Post.js";
import User from "../models/User.js";

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { userId, description, destination, createDate, status } = req.body;

        // Find the user who is creating the post
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Use the randomized filename generated by multer for picturePath
        const picturePath = req.file ? req.file.filename : null;

        // Create a new post document
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            destination,
            picturePath, // Save the randomized filename
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


export const getFriendPosts = async (req, res) => {
  try {
    const { id: userId } = req.user; 
    
    // Fetch the user to get the list of friends
    const user = await User.findById(userId).populate('friends'); 

    // If the user has no friends, return an empty array
    if (!user || !user.friends || user.friends.length === 0) {
      return res.status(200).json([]); // No friends, no posts to show
    }

    // Retrieve posts where the userId is in the user's friends list
    const friendIds = user.friends.map((friend) => friend._id);
    
    // Fetch posts from friends, sorted by creation date
    const posts = await Post.find({ userId: { $in: friendIds } }).sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch friend posts", error: err.message });
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



// Controller to get trending posts based on interactions
export const getTrendingPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find();

    // Calculate interaction counts (likes + comments) for each post
    const trendingPosts = posts
      .map((post) => {
        const likeCount = post.likes ? Object.keys(post.likes).length : 0;
        const commentCount = post.comments ? post.comments.length : 0;
        const interactionCount = likeCount + commentCount;
        return { ...post.toObject(), interactionCount }; // Include interactionCount in the post
      })
      .sort((a, b) => b.interactionCount - a.interactionCount) // Sort by interactionCount (descending)
      .slice(0, 3); // Limit to top 3 posts

    res.status(200).json(trendingPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Edit a specific post
export const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { description, destination, location } = req.body;
    
    const post = await Post.findById(postId);

    // Ensure the logged-in user owns the post
    if (req.user.id !== post.userId.toString()) {
      return res.status(403).json({ message: "You do not have permission to edit this post." });
    }

    // Update post details
    post.description = description || post.description;
    post.destination = destination || post.destination;
    post.location = location || post.location;

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};






