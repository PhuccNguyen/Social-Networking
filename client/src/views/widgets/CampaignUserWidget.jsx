import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import { styled, useTheme } from "@mui/system"; // Import useTheme

// Custom styled components for a more modern look
const StyledCard = styled(Card)(({ theme }) => ({
  width: "95%",
  margin: "1rem auto",
  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)", // Slightly deeper shadow
  borderRadius: "15px", // Rounded corners for a modern look
  backgroundColor: theme.palette.background.paper, // Use theme background color
  padding: "0.5rem", // Tighter padding for a compact design
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)", // Subtle lift effect
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
  color: theme.palette.neutral.light, // Use theme color
  fontWeight: "bold",
  padding: "9px 30px", // Bigger, more noticeable button
  fontSize: "1rem", // Increase font size for better readability
  borderRadius: "7px",
  textTransform: "uppercase",
  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
  marginTop: "1rem",
  transition: "all 0.3s ease",
  width: "100%", // Make the button wide for emphasis
  "&:hover": {
    background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
    transform: "translateY(-3px)", // Lift the button on hover
  },
}));

const CampaignUserWidget = ({
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
  createdBy,
  imageCampaing,
}) => {
  const { palette } = useTheme(); // Use the theme palette
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  return (
    <StyledCard>
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
            border: `1px solid ${medium}`, // Use medium color for border
          }}
        />
      ) : (
        <Box
          sx={{
            backgroundColor: palette.neutral.light, // Use theme color
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
        <Typography variant="h5" fontWeight="bold" gutterBottom color={dark}>
          {title}
        </Typography>

        <Typography
          variant="body1"
          color={medium}
          sx={{ marginBottom: "0.5rem", fontSize: "0.95rem", lineHeight: 1.4 }}
        >
          {description}
        </Typography>

        <Divider sx={{ marginBottom: "0.5rem" }} />

        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight="bold" color={main}>
              Details
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>Location:</strong> {location}
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>Start:</strong> {new Date(campaignStartDate).toLocaleDateString()} at {campaignStartTime}
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>End:</strong> {new Date(campaignEndDate).toLocaleDateString()} at {campaignEndTime}
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
              <strong>Start:</strong> {registrationStartDate ? new Date(registrationStartDate).toLocaleDateString() : "N/A"}
            </Typography>
            <Typography variant="body2" color={medium}>
              <strong>End:</strong> {registrationEndDate ? new Date(registrationEndDate).toLocaleDateString() : "N/A"}
            </Typography>
          </Box>

        </Box>

        <Divider sx={{ marginY: "0.5rem" }} />

        <Box display="flex" alignItems="center" marginTop={1}>
          <Avatar
            src={`http://localhost:3001/assets/${createdBy?.picturePath || ""}`}
            alt={createdBy?.firstName || "Admin"}
            sx={{ width: 46, height: 46, borderRadius: "50%", border: `1px solid ${medium}` }}
          />
          <Box marginLeft={2}>
            <Typography variant="body1" fontWeight="bold" color={dark}>
              Posted by: {createdBy?.firstName} {createdBy?.lastName}
            </Typography>
          </Box>
        </Box>

        <StyledButton onClick={() => console.log(`Register for campaign ${campaignId}`)}>
          Register Now
        </StyledButton>
      </CardContent>
    </StyledCard>
  );
};

export default CampaignUserWidget;