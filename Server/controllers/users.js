import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import Post from "../models/Post.js";
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

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
    
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath }) => { 
                return { _id, firstName, lastName, userName, mobile, email, intro, gender, birthday, status, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
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
  
    