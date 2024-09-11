import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "views/navbar";
import FriendListWidget from "views/widgets/FriendList";
import MyPostWidget from "views/widgets/MyPostWidget";
import PostsWidget from "views/widgets/PostsWidget";
import UserWidget from "views/widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const loggedInUserId = useSelector((state) => state.user._id); // logged-in user ID from Redux
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  // Fetch user data for the profile being viewed
  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [userId]); // Re-fetch if the userId changes

  if (!user) return null; // Render null if the user data hasn't loaded yet

  // Check if the current profile being viewed is the logged-in user's profile
  const isMyProfile = userId === loggedInUserId;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        {/* Left side: User widget and friends list */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          {/* <FriendListWidget userId={userId} /> */}
        </Box>

        {/* Right side: Posts section */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* Render the MyPostWidget only if it's the logged-in user's profile */}
          {isMyProfile && <MyPostWidget picturePath={user.picturePath} />}
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile={isMyProfile} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
