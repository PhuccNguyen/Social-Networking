import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostUserWidget from "./PostUserWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const [loading, setLoading] = useState(true);

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
      console.log("Fetched posts:", data); // Debug log
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

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
      console.log("Fetched user posts:", data); // Debug log
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (isProfile) {
      getUserPosts(signal);
    } else {
      getPosts(signal);
    }

    return () => {
      controller.abort();
    };
  }, [userId, isProfile, token, dispatch]);

  if (loading) {
    return <div>Loading...Data Slow</div>;
  }

  return (
    <>
      {Array.isArray(posts) ? (
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
            />
          )
        )
      ) : (
        <div>No posts available</div>
      )}
    </>
  );
};

export default PostsWidget;
