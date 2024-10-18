import { Box, useMediaQuery } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import AdminWidget from 'views/widgets/AdminWidget';
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
        <Box flexBasis={isNonMobileScreen ? "100%" : undefined}>
          <AdminWidget userId={_id} picturePath={picturePath} userName={userName}  role={role}/>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminControll;
