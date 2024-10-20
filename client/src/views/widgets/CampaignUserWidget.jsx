import { Box, Typography, Button, Card, CardMedia, CardContent, Avatar, Divider } from "@mui/material";
import { styled } from "@mui/system";

// Custom styled components for a more modern look
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "2rem",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  overflow: "hidden",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
  color: "#fff",
  "&:hover": {
    background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
  },
  marginTop: "20px",
  borderRadius: "8px",
  textTransform: "uppercase",
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
  image,
}) => {
  return (
    <StyledCard>
      {image ? (
        <CardMedia
          component="img"
          height="250"
          image={`http://localhost:3001/assets/${image}`} // Path to campaign image
          alt={title}
          sx={{
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            height: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No Image Available
          </Typography>
        </Box>
      )}

      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body1" color="textSecondary" paragraph>
          {description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight="bold">
          Campaign Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Location:</strong> {location}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Start Date:</strong> {new Date(campaignStartDate).toLocaleDateString()} at{" "}
          {campaignStartTime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>End Date:</strong> {new Date(campaignEndDate).toLocaleDateString()} at {campaignEndTime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Max Volunteers:</strong> {maxVolunteers}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight="bold">
          Registration
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Registration Start Date:</strong>{" "}
          {registrationStartDate ? new Date(registrationStartDate).toLocaleDateString() : "N/A"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Registration End Date:</strong>{" "}
          {registrationEndDate ? new Date(registrationEndDate).toLocaleDateString() : "N/A"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" marginTop={2}>
          <Avatar
            src={`http://localhost:3001/assets/${createdBy?.picturePath || ""}`}
            alt={createdBy?.firstName || "Admin"}
            sx={{ width: 48, height: 48 }}
          />
          <Box marginLeft={2}>
            <Typography variant="body2" fontWeight="bold">
              Posted by: {createdBy?.firstName} {createdBy?.lastName}
            </Typography>
          </Box>
        </Box>

        <StyledButton onClick={() => console.log(`Register for campaign ${campaignId}`)}>
          Register
        </StyledButton>
      </CardContent>
    </StyledCard>
  );
};

export default CampaignUserWidget;
