// src/views/JoinedCampaignsPage.jsx

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import JoinedCampaigns from "./JoinedCampaigns"; // Custom card component for campaigns
import { useSelector } from "react-redux";


const JoinedCampaignsPage = () => {
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.token);
  const { _id: userId } = useSelector((state) => state.user);
  console.log("Token being sent:", token);

  const fetchJoinedCampaigns = async () => {
    console.log("Token:", token);
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:3001/users/${userId}/joinedcampaigns`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
      if (!response.ok) throw new Error("Failed to fetch joined campaigns");

      const data = await response.json();
      setJoinedCampaigns(data);
    } catch (error) {
      console.error("Error fetching joined campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedCampaigns();
  }, [userId, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (joinedCampaigns.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        No campaigns found.......
      </Typography>
    );
  }

  return (
    <Box
    sx={{
      maxHeight: "80vh",         // Set max height for the scrollable container
      overflowY: "auto",         // Enable vertical scrolling
      padding: "1rem",           // Padding for better readability
      margin: "auto",            // Center the container if needed
      width: "100%",             // Full-width layout
      boxSizing: "border-box",   // Ensure padding doesn’t add to width
    }}>
      {joinedCampaigns.map((campaign) => (
  <JoinedCampaigns key={campaign._id} {...campaign} />
))}
    </Box>
  );
};

export default JoinedCampaignsPage;
