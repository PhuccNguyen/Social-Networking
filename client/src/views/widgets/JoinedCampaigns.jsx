// src/components/CampaignCard.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";

const CampaignCard = ({ title, description, location, campaignStartDate, campaignEndDate, imageCampaing }) => {
  return (
    <Card sx={{ marginBottom: "1rem", boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)" }}>
      {imageCampaing && (
        <CardMedia
          component="img"
          height="180"
          image={`http://localhost:3001/assets/${imageCampaing}`}
          alt={title}
        />
      )}
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "0.5rem" }}>
          {description}
        </Typography>
        <Divider sx={{ marginBottom: "0.5rem" }} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            <strong>Location:</strong> {location}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Start Date:</strong> {new Date(campaignStartDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>End Date:</strong> {new Date(campaignEndDate).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
