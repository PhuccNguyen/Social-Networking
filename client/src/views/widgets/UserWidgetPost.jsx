import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostUserWidget from "./PostUserWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(true);

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
      dispatch(setPosts({ posts: data }));
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    }
  }, [userId, isProfile, token, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map(({
          _id, userId, firstName, lastName, description, destination, location,
          picturePath, userPicturePath, likes, comments
        }) => (
          <PostUserWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            firstName={firstName}
            description={description}
            destination={destination}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        ))
      ) : (
        <div>No posts available</div>
      )}
    </>
  );
};

export default PostsWidget;
