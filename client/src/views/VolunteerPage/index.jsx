// src/views/VolunteerPage.js
import { Box, Typography } from '@mui/material';
import Navbar from "views/navbar";
import { useSelector } from 'react-redux';

const VolunteerPage = () => {
    const { _id, picturePath, userName } = useSelector((state) => state.user);

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginTop="4rem" // Adjust for fixed navbar height
            >
                <Typography variant="h4" gutterBottom>
                    Volunteer Opportunities
                </Typography>
                {/* Add content for volunteer opportunities here */}
            </Box>
        </Box>
    );
};

export default VolunteerPage;
