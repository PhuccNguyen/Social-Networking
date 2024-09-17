import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "./UserImage";

const Boxfriend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends || []); // Ensure friends is an array

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // Check if friends is an array, fallback to empty array if not
  const isFriend = Array.isArray(friends) && friends.some((friend) => friend._id === friendId);

  const handleFriendToggle = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Failed to update friend status');
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <WidgetWrapper>
      <Box
        display="flex"
        alignItems="center"
        gap="1rem"
        p="1rem"
        sx={{
          borderRadius: "0.75rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
          transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth hover effect
          "&:hover": {
            transform: "scale(1.01)", // Slight zoom on hover
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
          },
          "@media (max-width: 600px)": {
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
      >
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
          sx={{
            flex: 1,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: palette.action.hover,
              borderRadius: "0.5rem",
              padding: "0.5rem",
            },
            "@media (max-width: 600px)": {
              width: "100%", // Full width on small screens
              padding: "0.5rem 0",
            },
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {},
            }}
          >
            {name}
          </Typography>

          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
        <IconButton
          onClick={handleFriendToggle}
          sx={{
            backgroundColor: primaryLight,
            p: "0.6rem",
            "@media (max-width: 600px)": {
              alignSelf: "flex-end",
            },
          }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      </Box>
    </WidgetWrapper>
  );
};

export default Boxfriend;
