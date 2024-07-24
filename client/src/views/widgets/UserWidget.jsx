import {ManageAccountsOutlined, EditOutlined,LocationOnOutlined, WorkOutlineOutlined,} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import AdjustContent from "components/adjustment";
import Widgetwrapper from "components/widgetwrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
          const data = await response.json();
          console.log("Fetched User Data Successful:", data); //check
          setUser(data);
      } else {
          console.error("Failed to fetch user data");
      }
  };

  useEffect(() => {
      getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
      return null;
  }

  const {
      firstName,
      lastName,
      location,
      occupation,
      viewedProfile,
      impressions,
      friends,
  } = user;

  return (
      <Widgetwrapper>
          {/* FIRST ROW */}
          <AdjustContent
              gap="0.5rem" pb="1.1rem"
              onClick={() => navigate(`/profile/${userId}`)}
          >
              <AdjustContent gap="1rem">
                  <UserImage image={picturePath} />
                  <Box>
                      <Typography
                          variant="h4"
                          color={dark}
                          fontWeight="500"
                          sx={{
                              "&:hover": {
                                  color: palette.primary.light,
                                  cursor: "pointer",
                              },
                          }}
                      >
                          {firstName} {lastName}
                      </Typography>
                      <Typography >{friends.length} friends</Typography>
                  </Box>
              </AdjustContent>
              <ManageAccountsOutlined />
          </AdjustContent>
          <Divider />

          {/* SECOND ROW */}
          <Box p="1rem 0">
              <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                  <LocationOnOutlined fontSize="large" sx={{ color: main }} />
                  <Typography color={medium}>{location}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap="1rem">
                  <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
                  <Typography color={medium}>{occupation}</Typography>
              </Box>
          </Box>
          <Divider />

          {/* THIRD ROW */}
          <Box p="1rem 0">
              <AdjustContent mb="0.5rem">
                  <Typography color={medium}>Who's viewed your profile</Typography>
                  <Typography color={main} fontWeight="500">
                      {viewedProfile}
                  </Typography>
              </AdjustContent>
              <AdjustContent>
                  <Typography color={medium}>Impressions of your post</Typography>
                  <Typography color={main} fontWeight="500">
                      {impressions}
                  </Typography>
              </AdjustContent>
          </Box>
          <Divider />

          {/* FOURTH ROW */}
          <Box p="1rem 0">
              <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                  Social Profiles
              </Typography>
              <AdjustContent gap="1rem" mb="0.5rem">
                  <AdjustContent gap="1rem">
                      {/* <img src="../assets/zalo.png" alt="zalo" /> */}
                      <Box>
                          <Typography color={main} fontWeight="500">
                              Zalo
                          </Typography>
                          <Typography color={medium}>Social Network</Typography>
                      </Box>
                  </AdjustContent>
                  <EditOutlined sx={{ color: main }} />
              </AdjustContent>
              <AdjustContent gap="1rem">
                  <AdjustContent gap="1rem">
                      {/* <img src="../assets/linkedin.png" alt="linkedin" /> */}
                      <Box>
                          <Typography color={main} fontWeight="500">
                              LinkedIn
                          </Typography>
                          <Typography color={medium}>Network Platform</Typography>
                      </Box>
                  </AdjustContent>
                  <EditOutlined sx={{ color: main }} />
              </AdjustContent>
          </Box>
      </Widgetwrapper>
  );
};

export default UserWidget;
