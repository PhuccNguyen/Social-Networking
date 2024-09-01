// components/UserImage.js
import React from 'react';
import { Box } from "@mui/material";

const UserImage = ({ image, size = "50px" }) => {
  const handleError = (e) => {
    e.target.onerror = null; // Prevent looping
    e.target.src = "/path/to/default/avatar.jpg"; // Fallback image
  };

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`} // Ensure this path is correct
        onError={handleError}
      />
    </Box>
  );
};

export default UserImage;
