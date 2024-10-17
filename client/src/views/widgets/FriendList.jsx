import { Box, Typography, useTheme } from "@mui/material";
import MakeFriend from "components/MakeFriend";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends || []); // Initialize empty array if no friends data

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      {/* Title Section */}
      <Typography
        color={palette.neutral.dark}
        variant="h4"  // Increased font size for better hierarchy
        fontWeight="600"  // Bolder font for title
        sx={{
          mb: "1.5rem",
          textAlign: 'center',  // Center align the title for better UI balance
          textTransform: 'uppercase',  // Add uppercase style for a modern look
          letterSpacing: '1.5px',  // Slight letter spacing for improved readability
        }}
      >
        Friend List
      </Typography>

      {/* Friend List Section */}
      <Box
        display="flex"
        flexDirection="column"
        gap="1.25rem"  // Add gap between each friend component for better spacing
        maxHeight="400px"  // Set a max height for scrollable list
        overflowY="auto"  // Enable scrolling if list exceeds max height
        sx={{
          "&::-webkit-scrollbar": { width: "8px" },  // Customize scrollbar width
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "10px" },  // Customize scrollbar thumb with rounded edges
          "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },  // Change scrollbar thumb color on hover
          padding: "0 0.5rem",  // Add padding for content
        }}
      >
        {friends.length > 0 ? (
          friends.map((friend) => (
            <MakeFriend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              role={friend.role}
            />
          ))
        ) : (
          <Typography
            color={palette.neutral.medium}
            sx={{
              textAlign: "center",
              fontStyle: "italic",
              color: palette.neutral.light,
            }}
          >
            No friends to display.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FriendListWidget;
