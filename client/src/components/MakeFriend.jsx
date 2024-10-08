import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import UserImage from "./UserImage";

const Boxfriend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends || []);

  const { palette } = useTheme();
  const isFriend = friends.some((friend) => friend._id === friendId);

  const handleFriendToggle = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
      } else {
        console.error("Failed to update friend status");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p="0.75rem"
      sx={{
        borderRadius: "0.5rem",
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 5px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <UserImage image={userPicturePath} size="45px" />
      
      <Box
        flex={1}
        ml="0.75rem"
        onClick={() => navigate(`/profile/${friendId}`)}
        sx={{ cursor: "pointer" }}
      >
        <Typography color={palette.neutral.main} variant="h6" fontWeight="500">
          {name}
        </Typography>
        <Typography color={palette.neutral.medium} fontSize="0.8rem">
          {subtitle}
        </Typography>
      </Box>

      <IconButton >
        HH
      </IconButton>
    </Box>
  );
};

export default Boxfriend;
