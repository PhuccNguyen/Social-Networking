import { Box, Typography, Breadcrumbs, Link} from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';
import UserWidget from 'views/widgets/UserWidget';
import { useNavigate } from "react-router-dom";
import SavedPosts from "views/savepost"; 

const SavedPost = () => {
    const { _id, picturePath, userName, role } = useSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <Box>
            <Navbar />
            <Box display="flex" justifyContent="space-between" marginTop="2.8rem" padding="1rem">
                {/* Fixed Left Section: UserWidget */}
                <Box>
                    <UserWidget userId={_id} picturePath={picturePath} userName={userName}  role={role} />
                </Box>

                {/* Main Content: Saved Posts */}
                <Box
                    flex="1"
                    marginLeft="320px"
                    padding="1.5rem"
                    overflow="hidden"  // Ensure main box doesn’t overflow
                    minHeight="80vh"
                >
                    {/* Fixed Breadcrumbs for navigation */}
                    <Box
                        position="fixed"
                        top="93px"
                        left="390px"
                        right="1rem"
                        padding="0.5rem"
                        zIndex={1000}
                        boxShadow="0px 2px 0px 0px rgba(0, 0, 0, 0.1)"
                    >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                underline="hover"
                                color="inherit"
                                onClick={() => navigate('/Home')}
                                sx={{ cursor: "pointer" }}
                            >
                                Home
                            </Link>
                            <Typography color="textPrimary"> Saved</Typography>
                        </Breadcrumbs>
                    </Box>

                    {/* Scrollable Saved Posts */}
                    <Box
                        position="relative"
                        top="50px"
                        left="28px"
                        right="0"
                        // padding="1rem"
                        height="calc(100vh - 140px)"
                        overflow="auto"  // Enable scrolling within this box
                    >
                        <SavedPosts />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SavedPost;
