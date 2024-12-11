import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostUserWidget from "./PostUserWidget";
import Loader from "components/Loader";
import { Box, CircularProgress, Typography } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const savedPosts = useSelector((state) => state.user.savedPosts || []);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        isProfile
          ? `http://localhost:3001/posts/${userId}/posts`
          : "http://localhost:3001/posts/friends",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    getPosts();
  }, [userId, isProfile, token, dispatch]);

  const isPostSaved = (postId) =>
    Array.isArray(savedPosts) && savedPosts.includes(postId);

  const renderedPosts = useMemo(
    () =>
      Array.isArray(posts)
        ? posts.map((post) => (
            <PostUserWidget
              key={post._id}
              postId={post._id}
              postUserId={post.userId}
              firstName={post.firstName}
              lastName={post.lastName}
              description={post.description}
              destination={post.destination}
              location={post.location}
              picturePath={post.picturePath}
              userPicturePath={post.userPicturePath}
              likes={post.likes}
              comments={post.comments}
              isSaved={isPostSaved(post._id)}
            />
          ))
        : [],
    [posts, savedPosts]
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Loader /> 
      </Box>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        No posts available
      </Typography>
    );
  }

  return <Box>{renderedPosts}</Box>;
};

export default PostsWidget;
