// src/components/CampaignCard.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map"; // Icon for location
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Icon for date reminder

const CampaignCard = ({ 
  title, 
  description, 
  location, 
  campaignStartDate, 
  campaignEndDate, 
  campaignStartTime,
  campaignEndTime,
  imageCampaing 
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card sx={{ marginBottom: "1rem", boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)" }}>
        {imageCampaing && (
          <CardMedia
            component="img"
            height="380"
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
          <Box textAlign="center" mt={2}>
  <Button
    variant="contained"
    onClick={handleOpen}
    sx={{
      background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
      color: "#fff",
      fontWeight: "bold",
      padding: "0.5em 2em",
      width: "100%",
      borderRadius: "4px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      "&:hover": {
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", // Ensures gradient stays on hover
        opacity: 0.9, // Subtle hover effect
      },
    }}
  >
    View Details
  </Button>
</Box>

        </CardContent>
      </Card>

      {/* Modal for More Details */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom display="flex" alignItems="center" gap={1} >
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48"><g fill="none" stroke-width="4">
               <path fill="#2f88ff" stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="M10 44H38C39.1046 44 40 43.1046 40
               42V14H30V4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z"/><path stroke="#000" stroke-linecap="round"
               stroke-linejoin="round" d="M30 4L40 14"/><circle cx="24" cy="28" r="8" fill="#43ccf8" 
               stroke="#fff"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" d="M23 25V29H27"/></g>
          </svg>
            <strong>Date & Time:</strong> {new Date(campaignStartDate).toLocaleDateString()} at {campaignStartTime} - {new Date(campaignEndDate).toLocaleDateString()} at {campaignEndTime}
          </Typography>
          <Typography variant="body1" gutterBottom display="flex" alignItems="center" gap={1}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512"><path
             fill="#4629d6" d="M264 0C157.3 0 72 85.3 72 192c0 36.9 11 65.4 30.1 94.3l141.7 215c4.3 6.5 
             11.7 10.7 20.2 10.7s16-4.3 20.2-10.7l141.7-215C445 257.4 456 228.9 456 192C456 85.3 370.7 0
             264 0m0 341.2c-82.5 0-149.3-66.9-149.3-149.5c0-82.5 66.9-149.5 149.3-149.5c82.5 0 149.3 66.9
             149.3 149.5S346.5 341.2 264 341.2m64-170.5h-42.7v-64c0-11.8-9.5-21.3-21.3-21.3s-21.3 9.5-21.3
             21.3V192c0 11.8 9.6 21.3 21.3 21.3h64c11.8 0 21.3-9.5 21.3-21.3s-9.5-21.3-21.3-21.3"/>
           </svg>    
                   <strong>Location:</strong> {location}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <strong>Instructions:</strong> Please arrive 15 minutes early to check in. Remember to bring any necessary supplies, and be ready to actively participate.
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <strong>Tips:</strong> Dress comfortably, stay hydrated, and prepare for any weather conditions.
          </Typography>
        </DialogContent>
        <DialogActions>
  <Button
    onClick={handleClose}
    sx={{
      color: "#fff",
      background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
      fontWeight: "bold",
      padding: "0.5em 1.5em",
      borderRadius: "4px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      "&:hover": {
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
        opacity: 0.9,
      },
    }}
  >
    Close
  </Button>
  <Button
    variant="contained"
    target="_blank"
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
    sx={{
      color: "#fff",
      background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
      fontWeight: "bold",
      padding: "0.5em 1.5em",
      borderRadius: "4px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      "&:hover": {
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
        opacity: 0.9,
      },
    }}
  >
    Get Directions
  </Button>
</DialogActions>

      </Dialog>
    </>
  );
};

export default CampaignCard;
