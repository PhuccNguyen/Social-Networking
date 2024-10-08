import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  BookmarkBorderOutlined, // Icon cho lưu bài viết
  BookmarkOutlined, // Icon cho đã lưu bài viết
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
import Boxfriend from "components/BoxFriendDemo";

import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setSavedPosts  } from "state";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PostUserWidget = ({
  postId,
  postUserId,
  friendRequestStatus, // New prop for friend request status
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
  const [saved, setSaved] = useState(isSaved); // Trạng thái lưu bài viết
  const loggedInUserId = loggedInUser._id;
  const isLiked = Boolean(likes[loggedInUserId]);
  const   likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  // const widgetBackground =
  //   palette.mode === "dark" ? palette.grey[900] : "#f9f9f9";

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
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }), 
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save/unsave post');
      }

      const updatedSavedPosts = await response.json(); 
      dispatch(setSavedPosts({ savedPosts: updatedSavedPosts }));
      setSaved(!saved);  // Đảo ngược trạng thái nút lưu
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
      setNewComment(""); // Xóa nội dung trong trường nhập sau khi bình luận
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <WidgetWrapper
      m="1rem 1.5rem"
      sx={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        color: main,
      }}
    >
      <Boxfriend
        friendId={postUserId}
        lastName={lastName}
        firstName={firstName}
        subtitle={location}
        initialFriendRequestStatus={friendRequestStatus} // Pass the friend request status
        userPicturePath={userPicturePath}
     />
       <Divider />
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

      {/* Bố cục cho các nút like, comment và save */}
      <FlexBetween
        mt="0.75rem"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <FlexBetween gap="1rem">
          {/* Nút thích */}
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

          {/* Nút bình luận */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsCommentsVisible(!isCommentsVisible)}>
              <ChatBubbleOutlineOutlined sx={{ color: main }} />
            </IconButton>
            <Typography sx={{ fontSize: "0.85rem" }}>
              {comments.length}
            </Typography>
          </FlexBetween>

          {/* Nút lưu bài viết */}
          <FlexBetween
        mt="0.75rem"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleSavePost}>
              {saved ? (
                <BookmarkOutlined sx={{ color: primary }} />
              ) : (
                <BookmarkBorderOutlined sx={{ color: main }} />
              )}
            </IconButton>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
        </FlexBetween>
      </FlexBetween>

      {/* Phần render comment */}
      {isCommentsVisible && (
        <Box mt="0.5rem">
          {comments.map(
            ({ userId, lastName, firstName, userPicturePath, commentText, createdAt }, i) => (
              <Box key={`${userId}-${i}`} mt="0.5rem">
                <Divider />
                <FlexBetween gap="0.75rem" mt="0.5rem">
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
                    color: main,
                    m: "0rem 0 0.5rem",
                    pl: "3rem",
                    fontSize: "0.85rem",
                  }}
                >
                  {commentText}
                </Typography>
              </Box>
            )
          )}

          <Divider sx={{ mt: "0.1rem" }} />

          <Box>
          <TextField
            label="Write a comment..."
            fullWidth
            multiline
            maxRows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: "0.75rem" }}
          />
        </Box>
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
