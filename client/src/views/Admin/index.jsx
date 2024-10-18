import { Box, useMediaQuery } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import AdminWidget from 'views/widgets/AdminWidget';

const AdminControll = () => {
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, userName, role } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar  />
      <Box
        width="100%"
        padding="0" // Set padding to zero to make sections reach the edge
        display="flex"
        justifyContent="space-between"
        marginTop="70px"
      >
        <Box
          sx={{
            width: isNonMobileScreen ? "100%" : "100%",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <AdminWidget userId={_id} picturePath={picturePath} userName={userName} role={role} />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminControll;
