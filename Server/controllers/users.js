import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import Post from "../models/Post.js";
import Campaign from "../models/Campaign.js";
// import SignupVolunteer from "../models/SignupVolunteer.js";
// import VolunteerEvent from "../Folder/Volunteerevent.js";


/* READ */ 
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// controllers/users.js

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
    
        // Lấy danh sách bạn của người dùng
        const friends = await Promise.all(
            user.friends.map((friendId) => User.findById(friendId))
        );

        // Tính toán số lượng bạn chung cho mỗi người bạn
        const mutualFriendsCount = friends.map((friend) => {
            const mutualFriends = friend.friends.filter((f) => user.friends.includes(f));
            return mutualFriends.length;
        });

        // Định dạng lại thông tin bạn bè và thêm số lượng bạn chung
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath }, index) => {
                return { 
                    _id, 
                    firstName, 
                    lastName, 
                    userName, 
                    mobile, 
                    email, 
                    intro, 
                    gender, 
                    birthday, 
                    status, 
                    occupation, 
                    location, 
                    picturePath,
                    mutualFriends: mutualFriendsCount[index], 
                };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({ message: "Failed to get friends", error: err.message });
    }
};


// /* UPDATE */  
// export const addRemoveFriends = async (req, res) => {
//     try {
//         const { id, friendId } = req.params;
//         const user = await User.findById(id);
//         const friend = await User.findById(friendId); 

//         if (user.friends.includes(friendId)) {
//             user.friends = user.friends.filter((id) => id !== friendId);
//             friend.friends = friend.friends.filter((id) => id !== id);
//         } else {
//             user.friends.push(friendId);
//             friend.friends.push(id);
//         }
//         await user.save();
//         await friend.save();

//         const friends = await Promise.all(
//             user.friends.map((id) => User.findById(id))
//         );
//         const formattedFriends = friends.map(
//             ({ _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath }) => { 
//                 return { _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath };
//             }
//         );
//         res.status(200).json(formattedFriends);
//     } catch (err) {
//         res.status(404).json({ message: err.message });
//     }
// };

// UPDATE USER ROLE (Admin only)
export const updateUserRole = async (req, res) => {
    try {
      const { id, role } = req.body;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.role = role; // Update the role
      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  // UPDATE INFOR USER + PASSWORD
  export const updateUser = async (req, res) => {
      try {
          const { id } = req.params;
          const { firstName, lastName, status, location, occupation, email, intro, mobile, oldPassword, newPassword } = req.body;
  
          // Check if the user is trying to edit their own profile
          if (id !== req.user.id) {
              return res.status(403).json({ message: "You are not authorized to update this profile" });
          }
  
          // FIND USER BY ID
          const user = await User.findById(id);
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }
  
          // UPDATE USER INFORMATION
          user.firstName = firstName || user.firstName;
          user.lastName = lastName || user.lastName;
          user.status = status || user.status;
          user.intro = intro || user.intro;
          user.location = location || user.location;
          user.occupation = occupation || user.occupation;
          user.email = email || user.email;
          user.mobile = mobile || user.mobile;
  
          // CHANGE PASSWORD IF REQUESTED
          if (oldPassword && newPassword) {
              const isMatch = await bcrypt.compare(oldPassword, user.password);
              if (!isMatch) {
                  return res.status(400).json({ message: "Current password is incorrect" });
              }
  
              const salt = await bcrypt.genSalt();
              user.password = await bcrypt.hash(newPassword, salt);
          }
  
          // SAVE UPDATED INFORMATION TO DATABASE
          await user.save();
  
          // RETURN UPDATED USER INFO
          res.status(200).json(user); 
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  };

  // controllers/users.js

export const deleteUserFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;

        // Find the user and remove the friend from the list
        const user = await User.findById(id);
        user.friends = user.friends.filter(friend => friend.toString() !== friendId);

        // Update the user's friends list in the database
        await user.save();

        // Optionally, remove the current user from the friend's friends list
        const friend = await User.findById(friendId);
        friend.friends = friend.friends.filter(f => f.toString() !== id);
        await friend.save();

        res.status(200).json({ message: "Friend removed successfully", friends: user.friends });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove friend", error });
    }
};

  
 // Save or unsave a post
export const savePosts = async (req, res) => {
    try {
        console.log("Request Params:", req.params);
        console.log("Request Body:", req.body);

        const { id } = req.params;  
        const { postId } = req.body;

        if (!id || !postId) {
            console.log("Missing user ID or post ID");
            return res.status(400).json({ message: "User ID and Post ID are required." });
        }

        const user = await User.findById(id);
        console.log("User Found:", user);

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(postId);
        console.log("Post Found:", post);

        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        const isSaved = user.savedPosts.some(savedPost => savedPost._id.equals(post._id));
        console.log("Is Post Already Saved:", isSaved);

        if (isSaved) {
            user.savedPosts = user.savedPosts.filter(savedPost => !savedPost._id.equals(post._id));
            console.log("Post unsaved");
        } else {
            user.savedPosts.push(post);
            console.log("Post saved");
        }

        // Save updated user data
        await user.save();
        console.log("User saved successfully");

        // Return updated saved posts
        res.status(200).json(user.savedPosts);
    } catch (err) {
        console.log("Error occurred:", err.message);
        res.status(500).json({ message: err.message });
    }
};

   
  
// Get all posts saved by a user
export const getSavedPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate({
            path: "savedPosts",
            populate: {
                path: "userId", // Populating userId in savedPosts
                select: "firstName lastName userPicturePath", // Select specific fields
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.savedPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserJoinedCampaigns = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).populate("joinedCampaigns");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json(user.joinedCampaigns);
    } catch (error) {
      console.error("Error fetching joined campaigns:", error);
      res.status(500).json({ error: "Failed to retrieve joined campaigns" });
    }
  };
  

  export const updateUserAchievements = async (userId) => {
    try {
      const user = await User.findById(userId).populate("joinedCampaigns");
  
      if (!user) throw new Error("User not found");
  
      // Calculate campaign count and determine achievement level
      const campaignCount = user.joinedCampaigns.length;
      let achievementLevel = "Newcomer";
      if (campaignCount >= 21) achievementLevel = "Champion of Service";
      else if (campaignCount >= 11) achievementLevel = "Leader of Change";
      else if (campaignCount >= 6) achievementLevel = "Impact Maker";
      else if (campaignCount >= 3) achievementLevel = "Active Volunteer";
  
      // Award badges based on milestones
      const badges = [];
      const completedMilestoneCount = user.joinedCampaigns.reduce((count, campaign) => {
        return campaign.milestones.every((m) => m.completed) ? count + 1 : count;
      }, 0);
      if (completedMilestoneCount >= 5) badges.push("milestone_achiever");
  
      // Update user achievements and save
      user.achievementLevel = achievementLevel;
      user.campaignCount = campaignCount;
      user.badges = badges;
      await user.save();
  
      return {
        ...user.toObject(),
        joinedCampaigns: user.joinedCampaigns,
      };
    } catch (error) {
      console.error("Error updating user achievements:", error);
      throw error;
    }
  };
  
  

// // Update Password
// export const changePassword = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { oldPassword, newPassword } = req.body;
  
//       const user = await User.findById(id);
//       if (!user) return res.status(404).json({ message: "User not found" });
  
//       const isMatch = await bcrypt.compare(oldPassword, user.password);
//       if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
  
//       const salt = await bcrypt.genSalt();
//       user.password = await bcrypt.hash(newPassword, salt);
  
//       await user.save();
//       res.status(200).json({ message: "Password updated successfully" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };
  
  
// // Update Email and Mobile
// export const updateContact = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { email, mobile } = req.body;
  
//       const user = await User.findById(id);
//       if (!user) return res.status(404).json({ message: "User not found" });
  
//       user.email = email || user.email;
//       user.mobile = mobile || user.mobile;
  
//       await user.save();
//       res.status(200).json({ message: "Contact information updated successfully" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };
  
    