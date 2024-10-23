import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Custom styled components for a more modern look
const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  backgroundColor: theme.palette.background.paper,
  padding: "1.5rem",
  margin:"0rem 0rem 0rem 0rem",
  "&:hover": {
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
  },
}));

const ManageCampaign = ({
  campaignId,
  title,
  description,
  location,
  campaignStartDate,
  campaignStartTime,
  campaignEndDate,
  campaignEndTime,
  registrationStartDate,
  registrationEndDate,
  maxVolunteers,
  imageCampaing,
  createdBy,
  handleDelete,
  handleEdit,
}) => {
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  return (
    <StyledCard > 
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" fontWeight="bold" color={main}>
          {title}
        </Typography>
        <Box>
          <IconButton onClick={() => handleEdit(campaignId)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(campaignId)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      </Box>

      {imageCampaing ? (
        <CardMedia
          component="img"
          height="220"
          image={`http://localhost:3001/assets/${imageCampaing}`}
          alt={title}
          sx={{
            borderRadius: "8px",
            objectFit: "cover",
            marginBottom: "0.3rem",
            border: `1px solid ${medium}`,
          }}
        />
      ) : (
        <Box
          sx={{
            backgroundColor: palette.neutral.light,
            height: "220px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            marginBottom: "0.75rem",
          }}
        >
          <Typography variant="h6" color={medium}>
            No Image Available
          </Typography>
        </Box>
      )}

      <CardContent>

        <Typography variant="body1" color={medium} sx={{ marginBottom: "0.5rem" }}>
          {description}
        </Typography>

        <Divider sx={{ marginBottom: "0.5rem" }} />

        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight="bold" color={main}>
              Campaign Details
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>Location:</strong> {location}
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>Start:</strong>{" "}
              {new Date(campaignStartDate).toLocaleDateString()} at {campaignStartTime}
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>End:</strong>{" "}
              {new Date(campaignEndDate).toLocaleDateString()} at {campaignEndTime}
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>Max Volunteers:</strong> {maxVolunteers}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" color={main}>
              Registration
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>Start:</strong>{" "}
              {registrationStartDate
                ? new Date(registrationStartDate).toLocaleDateString()
                : "N/A"}
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>End:</strong>{" "}
              {registrationEndDate
                ? new Date(registrationEndDate).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Box>
          </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ManageCampaign;
     
