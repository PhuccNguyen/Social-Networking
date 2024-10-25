// ManageCampaignWidget.js

import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ManageCampaign from "./ManageCampaign";
import { useSelector } from "react-redux";

const ManageCampaignWidget = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.token);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/volunteer/manage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (campaignId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/volunteer/edit/${campaignId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Failed to edit campaign");
      const updatedCampaign = await response.json();
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign._id === campaignId ? updatedCampaign : campaign))
      );
    } catch (error) {
      console.error("Error editing campaign:", error);
    }
  };

  const handleDelete = async (campaignId) => {
    try {
      const response = await fetch(`http://localhost:3001/volunteer/delete/${campaignId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete campaign");
      setCampaigns((prev) => prev.filter((campaign) => campaign._id !== campaignId));
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <ManageCampaign
            key={campaign._id}
            {...campaign}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))
      ) : (
        <Typography variant="h6" align="center" color="textSecondary">
          No campaigns found.
        </Typography>
      )}
    </Box>
  );
};

export default ManageCampaignWidget;
