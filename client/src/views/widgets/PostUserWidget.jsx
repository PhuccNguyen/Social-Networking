import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { ChatBubbleOutlineOutlined } from "@mui/icons-material";
import LikeButton from "components/LikeButton";
import SaveButton from "components/SaveButton";
import FlexBetween from "components/Adjustment";
import BoxFriend from "components/BoxFriendDemo";
import Boxcomment from "components/BoxComment";
import WidgetWrapper from "components/WidgetWrapper";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setSavedPosts } from "state";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";


dayjs.extend(relativeTime);

const PostUserWidget = ({
  postId,
  postUserId,
  lastName,
  firstName,
  description,
  destination,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isSaved,
}) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const isDarkMode = useSelector((state) => state.mode === "dark");
  const [saved, setSaved] = useState(isSaved);
  const loggedInUserId = loggedInUser._id;
  const { palette } = useTheme();
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

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

  const handleSavePost = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${loggedInUserId}/saved`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save/unsave post");
      }

      const updatedSavedPosts = await response.json();
      dispatch(setSavedPosts({ savedPosts: updatedSavedPosts }));
      setSaved(!saved);
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
      setNewComment("");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <WidgetWrapper
      sx={{
        width: "90%",
        margin: "1rem auto",
        boxShadow: "0px 6px 13px 3px rgba(0, 0, 0, 0.1)",
        borderRadius: "7px",
      }}
    >
      <BoxFriend
        friendId={postUserId}
        lastName={lastName}
        firstName={firstName}
        subtitle={location}
        userPicturePath={userPicturePath}
        postId={postId}
        description={description}
        location={location}
        destination={destination}
      />
      <Divider />
      <Typography sx={{ mt: "1rem", fontSize: "0.95rem", fontWeight: 500 }}>
        Check In At: {destination}
      </Typography>
      <Typography sx={{ mt: "0.5rem", fontSize: "0.85rem", lineHeight: 1.5 }}>
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
          }}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: "1rem",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <LikeButton isLiked={isLiked} handleLikeToggle={handleLikeToggle} />
          <Typography sx={{ fontSize: "0.85rem" }}>{likeCount}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <IconButton onClick={() => setIsCommentsVisible(!isCommentsVisible)}>
            <ChatBubbleOutlineOutlined sx={{ color: "gray" }} />
          </IconButton>
          <Typography sx={{ fontSize: "0.85rem" }}>
            {comments.length}
          </Typography>
        </Box>

        <Box>
          <SaveButton
            postId={postId}
            isSaved={saved}
            handleSaveToggle={handleSavePost}
          />
        </Box>
      </Box>

      {isCommentsVisible && (
        <Box mt="rem">
          {comments.map(
            (
              {
                userId,
                lastName,
                firstName,
                userPicturePath,
                commentText,
                createdAt,
              },
              index
            ) => (
              <Box
                key={`${userId}-${index}`}
                mt="0.3rem"
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  backgroundColor: isDarkMode ? palette.background.default : "#f9f9f9", // Light or dark background
                  padding: "0.35rem",
                }}
              >
                <Divider />

                <FlexBetween gap="0.75rem" mt="0.3rem">
                  <Boxcomment
                    friendId={userId}
                    firstName={firstName}
                    lastName={lastName}
                    userPicturePath={userPicturePath}
                    subtitle={`${dayjs(createdAt).fromNow()}`}
                  />
                </FlexBetween>
                <Typography
                  sx={{
                    pl: "3rem", 
                    fontSize: "0.9rem", 
                    lineHeight: 1, 
                    color: "text.secondary", 
                    padding: "0rem 3rem", 
                    borderRadius: "8px",
                    maxWidth: "95%",
                    wordBreak: "break-word", 
                    mb: "0.75rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {commentText}
                </Typography>
              </Box>
            )
          )}

          {/* Divider between comments and input */}
          <Divider sx={{ mt: "1rem" }} />

          {/* Comment input box with button inside */}
          <Box
            sx={{
              mt: "0.75rem",
              display: "flex",
              alignItems: "center",              
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "0.5rem 1rem",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              variant="outlined"
              sx={{
                flex: 1,
                // backgroundColor: isDarkMode ? palette.background.default : "#f9f9f9",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
              sx={{
                ml: "0.5rem",
                textTransform: "none",
                borderRadius: "20px",
                px: "1rem",
              }}
            >
              Post
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostUserWidget;
