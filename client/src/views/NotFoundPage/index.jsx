import React from 'react';
import { Box, Typography } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
    >
      <Typography variant="h1" color="error">
        404
      </Typography>
      <Typography variant="h4" color="textSecondary">
        Oops! The page you're looking for doesn't exist.
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
