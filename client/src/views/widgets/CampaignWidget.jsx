import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCampaigns } from "state";
import CampaignUserWidget from "./CampaignUserWidget.jsx";
import Loader from "components/Loader";
import { Box, Typography } from "@mui/material";

const CampaignWidget = () => {
  const dispatch = useDispatch();
  const { upcoming, ongoing, past } = useSelector((state) => state.campaigns);
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(true);

  const getCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/volunteer/campaigns", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch campaigns");

      const data = await response.json();
      dispatch(setCampaigns({ campaigns: data }));
    } catch (error) {
      console.error("Error fetching campaigns:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCampaigns();
  }, [token, dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Loader />
      </Box>
    );
  }

  return (
    <Box>
      {/* Ongoing Campaigns */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Ongoing Campaigns</Typography>
      {ongoing && ongoing.length > 0 ? (
        ongoing.map((campaign) => (
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
        <Typography color="textSecondary">No ongoing campaigns</Typography>
      )}

      {/* Upcoming Campaigns */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Upcoming Campaigns</Typography>
      {upcoming && upcoming.length > 0 ? (
        upcoming.map((campaign) => (
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
        <Typography color="textSecondary">No upcoming campaigns</Typography>
      )}

      {/* Past Campaigns */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Past Campaigns</Typography>
      {past && past.length > 0 ? (
        past.map((campaign) => (
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
        <Typography color="textSecondary">No past campaigns</Typography>
      )}
    </Box>
  );
};

export default CampaignWidget;
