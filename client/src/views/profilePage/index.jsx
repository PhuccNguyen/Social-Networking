import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "views/navbar";
import UserWidgetInformation from "views/widgets/UserWidgetInformation";
import UserWidgetProfile from "views/widgets/UserWidgetProfile";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const loggedInUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Failed to fetch user data:", response.statusText);
        return;
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
    return () => {
      setUser(null); // Reset on unmount or userId change
    };
  }, [userId]);

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

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
        <Box flexBasis="30%" mt="70px">
          <UserWidgetProfile userId={userId} picturePath={user.picturePath} />
        </Box>

        <Box flexBasis="70%" mt={isNonMobileScreens ? "70px" : "2rem"}>
          <UserWidgetInformation
            userId={userId}
            user={user}
            picturePath={user.picturePath}
            isMyProfile={isMyProfile}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
