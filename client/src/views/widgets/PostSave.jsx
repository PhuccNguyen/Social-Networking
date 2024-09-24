import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostUserWidget from "./PostUserWidget";

const SavedPosts = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const savedPosts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);

  const fetchSavedPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/savedPosts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved posts");
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
    fetchSavedPosts();
  }, [userId, token, dispatch]);

  if (loading) return <div>Loading saved posts...</div>;

  return (
    <>
      {savedPosts.map((post) => (
        <PostUserWidget
          key={post._id}
          postId={post._id}
          postUserId={post.userId}
          name={`${post.firstName} ${post.lastName}`}
          description={post.description}
          destination={post.destination}
          location={post.location}
          picturePath={post.picturePath}
          userPicturePath={post.userPicturePath}
          likes={post.likes}
          comments={post.comments}
          isSaved={true} // Đánh dấu bài viết đã lưu
        />
      ))}
    </>
  );
};

export default SavedPosts;
