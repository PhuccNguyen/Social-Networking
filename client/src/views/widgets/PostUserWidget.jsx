import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/Adjustment";
import Boxcomment from "components/BoxComment";
import Boxfriends from "components/BoxFriend";

import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; 

dayjs.extend(relativeTime); 

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
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const loggedInUserId = loggedInUser._id;
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const widgetBackground =
    palette.mode === "dark" ? palette.grey[900] : "#f9f9f9";

  const handleLikeToggle = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            userName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
            userPicturePath: loggedInUser.picturePath,
            commentText: newComment,
          }),
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <WidgetWrapper
      m="1rem 1.5rem"
      sx={{
        backgroundColor: widgetBackground,
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        color: main,
      }}
    >
      <Boxfriends
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />

      <Typography
        color={main}
        sx={{ mt: "1rem", fontSize: "0.95rem", fontWeight: 500 }}
      >
        Check In At: {destination}
      </Typography>
      <Typography
        color={main}
        sx={{ mt: "0.5rem", fontSize: "0.85rem", lineHeight: 1.5 }}
      >
        {description}
      </Typography>

      {picturePath && (
        <Box
          component="img"
          src={`http://localhost:3001/assets/${picturePath}`}
          alt="post"
          sx={{
            display: "block",
            margin: "0.75rem auto",
            borderRadius: "10px",
            maxHeight: "400px",
            maxWidth: "100%",
            objectFit: "cover",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      )}

      <FlexBetween
        mt="0.75rem"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
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
            <Typography sx={{ fontSize: "0.85rem" }}>
              {comments.length}
            </Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>

      {isCommentsVisible && (
        <Box mt="0.5rem">
          {/* Render existing comments */}
          {comments.map(
            ({ userId, userName, userPicturePath, commentText, createdAt }, i) => (
              <Box key={`${userId}-${i}`} mt="0.5rem">
                <Divider />
                <FlexBetween gap="0.75rem" mt="0.5rem">
                  <Boxcomment
                    friendId={userId}
                    name={userName}
                    userPicturePath={userPicturePath}
                    subtitle={`${dayjs(createdAt).fromNow()}`}
                  />
                </FlexBetween>
                <Typography
                  sx={{
                    color: main,
                    m: "0.5rem 0",
                    pl: "1rem",
                    fontSize: "0.85rem",
                  }}
                >
                  {commentText}
                </Typography>
              </Box>
            )
          )}

          <Divider sx={{ mt: "1rem" }} />
          <TextField
            label="Write a comment..."
            fullWidth
            multiline
            maxRows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: "0.75rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            sx={{ mt: "0.5rem", float: "right" }}
          >
            Comment
          </Button>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostUserWidget;
