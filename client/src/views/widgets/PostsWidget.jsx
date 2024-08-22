import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostUserWidget from "views/widgets/PostUserWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();


  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  // const {  _id,
  //   userId,
  //   firstName,
  //   lastName,
  //   description,
  //   destination,
  //   location,
  //   picturePath,
  //   userPicturePath,
  //   likes,
  //   comments, } = useSelector((state) => state.posts);

  const [loading, setLoading] = useState(true); // Loading state

  const getFeedPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error(error.message);
      setLoading(false); // Set loading to false even if there's an error
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
        dispatch(setPosts({ posts: data }));
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
      getFeedPosts(signal);
    }
  
    return () => {
      controller.abort();
    };
  }, [userId, isProfile, token, dispatch]);
  
  if (loading) {
    return <div>Loading...Data Slowwwwwwwwwwwwwwwwwwwwwww</div>; // Loading indicator while data is being fetched
  }

  return (
    <>
        {posts.map(
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
        )}
    </>
);

 
};

export default PostsWidget;
