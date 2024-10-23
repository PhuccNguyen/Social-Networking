import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, CircularProgress } from "@mui/material";
import ManageCampaign from "./ManageCampaign";

const ManageCampaignWidget = () => {
  const token = useSelector((state) => state.token);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchManagedCampaigns = async () => {
    try {
      const response = await fetch("http://localhost:3001/volunteer/manage", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagedCampaigns();
  }, [token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        You haven't posted any campaigns yet.
      </Typography>
    );
  }

  return (
    <Box>
      {campaigns.map((campaign) => (
        <ManageCampaign
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
          imageCampaing={campaign.imageCampaing}
          createdBy={campaign.createdBy}
        />
      ))}
    </Box>
  );
};

export default ManageCampaignWidget;
