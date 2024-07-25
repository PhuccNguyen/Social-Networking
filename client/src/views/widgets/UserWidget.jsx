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
          console.log("Fetched User Data Successful From UW:", data); //check
          setUser(data);
      } else {
          console.error("Failed to fetch user data - UserWidget:");
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
    userName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <widgetwrapper>
       {/* FIRST ROW */}
       
       <AdjustContent>
       <h2> Chadasd </h2>
        <AdjustContent gap="1rem">
         <Box>
            <Typography>
                {userName}
            </Typography>

         </Box>
       <h2> Chadasd </h2>
        </AdjustContent>
       </AdjustContent>

    </widgetwrapper>
  )

};

export default UserWidget;
