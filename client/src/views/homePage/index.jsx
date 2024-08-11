import { Box, useMediaQuery } from '@mui/material';
import Navbar from "views/navbar"
import { useSelector  } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import MyPostWidget from "views/widgets/MyPostWidget";


const HomePage = () => {
    const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath, userName } = useSelector((state) => state.user);
    console.log("User Data:", { _id, picturePath, userName }); 

        return (
            <Box>
                <Navbar />
                <Box
                  width="100%"
                  padding="2rem 6%"
                  display={isNonMobileScreen ? "flex" : "block"}
                  gap="0.5rem"
                  
                  justifyContent="space-between"
                >
                    <Box flexBasis={ isNonMobileScreen ? "26%" : undefined }>
                        <UserWidget userId={ _id } picturePath={ picturePath } userName={ userName }/>                                                
                    </Box>
                    <Box 
                    flexBasis={ isNonMobileScreen ? "26%" : undefined }
                    mt={isNonMobileScreen ? undefined : "2rem"}
                    > 
                    <MyPostWidget picturePath={picturePath} />
                    </Box>              
                    {isNonMobileScreen && <Box flexBasis="26%"></Box>}
                </Box>
            </Box>
        );
    };

    export default HomePage;