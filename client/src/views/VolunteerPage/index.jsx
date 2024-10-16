// import { Box, useMediaQuery } from '@mui/material'; 
// import Navbar from "views/navbar";
// import { useSelector } from 'react-redux';
// import UserWidget from 'views/widgets/UserWidget';
// import MyPostWidget from "views/widgets/MyPostWidget";
// import PostsWidget from "views/widgets/PostsWidget";
// import EventVolunteer from "views/widgets/VolunteerAdsEvent";
// import VolunteerPost from "views/widgets/VolunteerPost";
// import VolunteerPostsWidget from "views/widgets/PostsWidget";

// const VolunteerPage = () => {
//   const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
//   const { _id, picturePath, userName, role } = useSelector((state) => state.user); // Ensure 'role' is in state

//   return (
//     <Box>
//       <Navbar />
//       <Box
//         width="100%"
//         padding="2rem 6%"
//         display={isNonMobileScreen ? "flex" : "block"}
//         gap="0.5rem"
//         justifyContent="space-between"
//         marginTop="70px"
//       >
//         <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
//           <UserWidget userId={_id} picturePath={picturePath} userName={userName} />
//         </Box>
        
//         <Box flexBasis={isNonMobileScreen ? "26%" : undefined} mt={isNonMobileScreen ? undefined : "2rem"}>
//         <VolunteerPost picturePath={picturePath} role={role} />
//         <PostsWidget userId={_id} />
//         </Box>

//         <Box flexBasis="26%" maxHeight="80vh" overflow="auto">
//           <EventVolunteer />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default VolunteerPage;
