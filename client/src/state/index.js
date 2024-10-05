import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  followedUsers: [], // Adding followed users
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
} = authSlice.actions;
export default authSlice.reducer;
