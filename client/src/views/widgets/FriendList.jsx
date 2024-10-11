import { Box, Typography, useTheme } from "@mui/material";
import Boxfriend from "components/MakeFriend";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import Loader from "components/Loader"; // Thêm loader

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends || []);
  const [loading, setLoading] = useState(true);

  const getFriends = async () => {
    try {
      setLoading(true); // Bắt đầu tải
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Failed to fetch friends", error);
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Typography
        color={palette.neutral.dark}
        variant="h4"
        fontWeight="600"
        sx={{
          mb: "1.5rem",
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
        }}
      >
        Friend List
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap="1.25rem"
        maxHeight="400px"
        overflowY="auto"
        sx={{
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "10px" },
          "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
          padding: "0 0.5rem",
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <Loader />
          </Box>
        ) : friends.length > 0 ? (
          friends.map((friend) => (
            <Boxfriend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
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
