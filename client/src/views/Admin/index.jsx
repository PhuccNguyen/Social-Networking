import { Box, useMediaQuery } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import AdminManager from "views/widgets/AdminManager';";
import PostsWidget from "views/widgets/PostsWidget";
import EventVolunteer from "views/widgets/VolunteerAdsEvent";

const AdminControll = () => {
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, userName, role } = useSelector((state) => state.user); // Ensure 'role' is in state

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        marginTop="70px"
      >
        {/* flexBasis="26%" maxHeight="80vh" overflow="auto" */}
        <Box flexBasis={isNonMobileScreen ? "26%" : undefined} mt={isNonMobileScreen ? undefined : "2rem"}>
        <PostsWidget userId={_id} />
        </Box>
        {/* <Box >
          <AdminManager picturePath={picturePath} role={role}/>
        </Box> */}
      </Box>
    </Box>
  );
};

export default AdminControll;
