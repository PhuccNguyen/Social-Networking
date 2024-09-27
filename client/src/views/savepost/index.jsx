import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostUserWidget from "views/widgets/PostUserWidget";

const SavedPosts = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const savedPosts = useSelector((state) => state.posts); // Get saved posts from Redux
  const token = useSelector((state) => state.token); // Get authorization token
  const userId = useSelector((state) => state.user._id); // Get current user's ID

  // Fetch saved posts from the backend
  const fetchSavedPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/savedPosts`,
        {
          method: "POST", // POST to fetch saved posts
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved posts");
      }

      const data = await response.json(); // Get the saved posts data from the response
      dispatch(setPosts({ posts: data })); // Dispatch the data to the Redux store
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  // Call fetchSavedPosts when the component mounts
  useEffect(() => {
    fetchSavedPosts();
  }, [userId, token, dispatch]);

  // Show a loading message if the data is still being fetched
  if (loading) return <div>Loading saved posts...</div>;

  // If no posts are found, show a message
  if (!savedPosts || savedPosts.length === 0) {
    return <div>No saved posts available</div>;
  }

  // Render the saved posts using PostUserWidget
  return (
    <>
      {savedPosts.map((post) => (
        <PostUserWidget
          key={post._id}
          postId={post._id}
          postUserId={post.userId._id} // Get user ID from the saved post
          firstName={post.firstName}
          lastName={post.lastName}
          description={post.description}
          destination={post.destination}
          location={post.location}
          userPicturePath={post.userPicturePath}
          picturePath={post.picturePath}
          // userPicturePath={post.userId.userPicturePath} // Get user profile picture
          likes={post.likes}
          comments={post.comments}
          isSaved={true} // Indicate that the post is saved
        />
      ))}
    </>
  );
};

export default SavedPosts;
