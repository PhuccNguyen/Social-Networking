import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/Adjustment";
import Boxfriend from "components/BoxFriend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostUserWidget = ({
  postId,
  postUserId,
  name,
  description,
  destination,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const background = palette.background.default;
  const widgetBackground = palette.mode === 'dark' ? palette.grey[900] : '#f9f9f9';

  const handleLikeToggle = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      if (!response.ok) throw new Error('Failed to like post');
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <WidgetWrapper
      m="1rem 1.5rem"
      sx={{
        backgroundColor: widgetBackground,
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        color: main,
      }}
    >
      {/* Displaying the user info using Boxfriend component */}
      <Boxfriend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />

      {/* Displaying the post destination and description */}
      <Typography color={main} sx={{ mt: "1rem", fontSize: "0.95rem", fontWeight: 500 }}>
        Check In At: {destination}
      </Typography>
      <Typography color={main} sx={{ mt: "0.5rem", fontSize: "0.85rem", lineHeight: 1.5 }}>
        {description}
      </Typography>

      {/* Displaying the post image centered */}
      {picturePath && (
        <Box
          component="img"
          src={`http://localhost:3001/assets/${picturePath}`}
          alt="post"
          sx={{
            display: 'block',
            margin: '0.75rem auto',
            borderRadius: "10px",
            maxHeight: "400px",
            maxWidth: "100%",
            objectFit: "cover",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      )}

      {/* Displaying like, comment, and share icons */}
      <FlexBetween mt="0.75rem" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleLikeToggle}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined sx={{ color: main }} />
              )}
            </IconButton>
            <Typography sx={{ fontSize: "0.85rem" }}>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsCommentsVisible(!isCommentsVisible)}>
              <ChatBubbleOutlineOutlined sx={{ color: main }} />
            </IconButton>
            <Typography sx={{ fontSize: "0.85rem" }}>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined sx={{ color: main }} />
        </IconButton>
      </FlexBetween>

      {/* Displaying comments if visible */}
      {isCommentsVisible && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem", fontSize: "0.85rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostUserWidget;
