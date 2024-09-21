import User from "../models/User.js";
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

/* UPDATE */  
export const addRemoveFriends = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId); 

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

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

// UPDATE INFOR USER
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, status, location, occupation, email, mobile } = req.body;

        // Check if the user is trying to edit their own profile
        if (id !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this profile" });
        }

        // FIND USER BY ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // UPDATE INFOR USER
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.status = status || user.status;
        user.location = location || user.location;
        user.occupation = occupation || user.occupation;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;


        await user.save(); // Save New Infor In Database
        res.status(200).json(user); // Return updated user info
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Update Password
export const changePassword = async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
  
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
  
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(newPassword, salt);
  
      await user.save();
      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
// Update Email and Mobile
export const updateContact = async (req, res) => {
    try {
      const { id } = req.params;
      const { email, mobile } = req.body;
  
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.email = email || user.email;
      user.mobile = mobile || user.mobile;
  
      await user.save();
      res.status(200).json({ message: "Contact information updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  

