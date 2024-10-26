// src/views/JoinedCampaignsPage.jsx

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import JoinedCampaigns from "./JoinedCampaigns"; // Custom card component for campaigns
import { useSelector } from "react-redux";

const JoinedCampaignsPage = () => {
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { _id: userId, token } = useSelector((state) => state.user);

  const fetchJoinedCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}/joined-campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
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
        No campaigns found.
      </Typography>
    );
  }

  return (
    <Box>
      {joinedCampaigns.map((campaign) => (
        <JoinedCampaigns key={campaign._id} {...campaign} />
      ))}
    </Box>
  );
};

export default JoinedCampaignsPage;
