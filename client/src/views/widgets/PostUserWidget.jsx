import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import Boxfriend from "components/BoxFriend";
import Adjustment from "components/Adjustment";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostUserWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  destination,
  picturePath,
  userPicturePath,
  likes = {}, // Default to an empty object
  comments = [], // Default to an empty array
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id); // Use optional chaining to avoid errors

  const isLiked = Boolean(likes?.[loggedInUserId]);
  const likeCount = Object.keys(likes || {}).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;


  console.log('Post ID:', postId);
console.log('Post User ID:', postUserId);
console.log('Logged-in User ID:', loggedInUserId);


  const patchLike = async () => {
    if (!postId) {
      console.error("Post ID is undefined or invalid");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like status");
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Boxfriend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {destination}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <Adjustment mt="0.25rem">
        <Adjustment gap="1rem">
          <Adjustment gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </Adjustment>

          <Adjustment gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </Adjustment>
        </Adjustment>

        <IconButton onClick={() => alert("Share functionality coming soon!")}>
          <ShareOutlined />
        </IconButton>
      </Adjustment>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
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
