
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";  // Add this line
import CampaignUserWidget from "./CampaignUserWidget";
import Loader from "components/Loader";
import { Box, Typography } from "@mui/material";

const CampaignWidget = ({ status }) => {
  const token = useSelector((state) => state.token);  // Now `useSelector` is defined
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/volunteer/campaigns-by-status-user?status=${status}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch campaigns");

        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [status, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Loader />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
        {status.charAt(0).toUpperCase() + status.slice(1)} Campaigns
      </Typography>
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <CampaignUserWidget
            key={campaign._id}
            campaignId={campaign._id}
            title={campaign.title}
            description={campaign.description}
            location={campaign.location}
            campaignStartDate={campaign.campaignStartDate}
            campaignStartTime={campaign.campaignStartTime}
            campaignEndDate={campaign.campaignEndDate}
            campaignEndTime={campaign.campaignEndTime}
            registrationStartDate={campaign.registrationStartDate}
            registrationEndDate={campaign.registrationEndDate}
            maxVolunteers={campaign.maxVolunteers}
            createdBy={campaign.createdBy}
            imageCampaing={campaign.imageCampaing}
          />
        ))
      ) : (
        <Typography color="textSecondary">No {status} Campaigns</Typography>
      )}
    </Box>
  );
};

export default CampaignWidget;
