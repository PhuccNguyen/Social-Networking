import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSavedPosts } from "state";
import PostUserWidget from "./PostUserWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const savedPosts = useSelector((state) => state.user.savedPosts || []); // Ensure savedPosts is an array
  const [loading, setLoading] = useState(true);

  // Function to fetch all posts
  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user-specific posts
  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user posts");
      }

      const data = await response.json();
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [userId, isProfile, token, dispatch]);

  // Check if the post is saved
  const isPostSaved = (postId) => Array.isArray(savedPosts) && savedPosts.includes(postId);

  // Memoizing the posts to avoid unnecessary re-renders
  const renderedPosts = useMemo(
    () =>
      Array.isArray(posts) &&
      posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          destination,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostUserWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            destination={destination}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            isSaved={isPostSaved(_id)}
          />
        )
      ),
    [posts, savedPosts]
  );

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts available</div>;
  }

  return <>{renderedPosts}</>;
};

export default PostsWidget;
