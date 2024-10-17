import { Box, useMediaQuery } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import AdminManager from "views/widgets/AdminManager";


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
        <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} userName={userName}  role={role}/>
        </Box>
        <Box >
          <AdminManager picturePath={picturePath} role={role} userId={_id} userName={userName}/>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminControll;
