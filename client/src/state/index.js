import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  campaigns: [], 
  followedUsers: [], 
  notifications: [], 

};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User not found when setting friends.");
      }
    },
    setFollowedUsers: (state, action) => {
      if (state.user) {
        state.user.following = action.payload.followedUsers;
      } else {
        console.error("User not found when setting followed users.");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setSavedPosts: (state, action) => {
      if (state.user) {
        state.user.savedPosts = action.payload.savedPosts;
      } else {
        console.error("User not logged in.");
      }
    },

    // Campaign-related reducers
    setCampaigns: (state, action) => {
      state.campaigns = action.payload.campaigns;
    },
    setCampaign: (state, action) => {
      const updatedCampaigns = state.campaigns.map((campaign) => {
        if (campaign._id === action.payload.campaign._id) return action.payload.campaign;
        return campaign;
      });
      state.campaigns = updatedCampaigns;
    },


    // Notification-related reducers
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications; // Set notifications from the server or socket
    },
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications]; // Add a new notification
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notif) => notif._id !== action.payload._id
      );
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map((notif) => ({
        ...notif,
        isRead: true,
      }));
    },
    markNotificationAsRead: (state, action) => {
      state.notifications = state.notifications.map((notif) =>
        notif._id === action.payload._id ? { ...notif, isRead: true } : notif
      );
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setFollowedUsers,
  setPosts,
  setPost,
  setSavedPosts,
  setCampaigns, 
  setCampaign, 
  setNotifications,
  addNotification,
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} = authSlice.actions;

export default authSlice.reducer;
