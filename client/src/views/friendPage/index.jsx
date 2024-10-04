import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import FriendPageWidget from "views/widgets/friendpagewidget"; // This is your SavedPosts component
import { useNavigate } from "react-router-dom";

const FriendPage = () => {
    const { _id, picturePath, userName } = useSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <Box>
            <Navbar />
            <Box 
                display="flex" 
                justifyContent="space-between" 
                marginTop="2.8rem" // Adjust for fixed navbar height
            >
                {/* Fixed Left Section: UserWidget */}
                <Box 
                    flexBasis="300px" // Fixed width for the UserWidget
                    position="fixed"
                    left="0"
                    top="90px" // Adjust this according to your Navbar height
                    height="100%" 
                    padding="1rem" 
                    zIndex={1000} // Ensure it stays on top
                    boxShadow="2px 0 5px rgba(0, 0, 0, 0.1)" // Optional: Shadow for better visibility
                >
                    <UserWidget userId={_id} picturePath={picturePath} userName={userName} />
                </Box>

                {/* Main Content: SavedPosts */}
                <Box 
                    flex="1" 
                    marginLeft="330px" // Leave space for the fixed UserWidget
                    padding="2rem"
                    overflow="auto" // Ensure SavedPosts content scrolls if too long
                >
                    {/* Breadcrumbs for navigation */}
                    <Breadcrumbs aria-label="breadcrumb"  marginLeft="30px" marginTop="28px"  sx={{ marginBottom: "" }}>
                        <Link 
                            underline="hover" 
                            color="inherit" 
                            onClick={() => navigate('/Home')} // Navigate to HomePage
                            sx={{ cursor: "pointer" }}
                        >
                            Home
                        </Link>
                        <Typography color="textPrimary">Friends</Typography>
                    </Breadcrumbs>

                    {/* Render SavedPosts component */}
                    <FriendPageWidget />
                </Box>
            </Box>
        </Box>
    );
};

export default FriendPage;
