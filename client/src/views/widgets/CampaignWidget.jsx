import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCampaigns } from "state";
import CampaignUserWidget from "./CampaignUserWidget.jsx";
import Loader from "components/Loader";
import { Box, Typography } from "@mui/material";

const CampaignWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const campaigns = useSelector((state) => state.campaigns); // State to hold campaign data
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(true);

  // Fetch campaigns from backend
  const getCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/volunteer/campaigns", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch campaigns");
  
      const data = await response.json();
      console.log(data); // Log the full response to check if createdBy is populated
      dispatch(setCampaigns({ campaigns: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => { 
    getCampaigns();
  }, [token, dispatch]);

  const renderedCampaigns = useMemo(
    () =>
      Array.isArray(campaigns)
        ? campaigns.map((campaign) => (
            <CampaignUserWidget
              key={campaign._id}
              campaignId={campaign._id}
              title={campaign.title}
              description={campaign.description}
              location={campaign.location}
              campaignStartDate={campaign.campaignStartDate}
              campaignStartTime={campaign.campaignStartTime} // Include the missing fields
              campaignEndDate={campaign.campaignEndDate}
              campaignEndTime={campaign.campaignEndTime} // Include the missing fields
              registrationStartDate={campaign.registrationStartDate} // Include the missing fields
              registrationEndDate={campaign.registrationEndDate} // Include the missing fields
              maxVolunteers={campaign.maxVolunteers}
              createdBy={campaign.createdBy} // Assistant admin details
              imageCampaing={campaign.imageCampaing} // Reference correct field
              />
          ))
        : [],
    [campaigns]
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Loader /> {/* Custom Loader component */}
      </Box>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        No campaigns available
      </Typography>
    );
  }

  return <Box>{renderedCampaigns}</Box>;
};

export default CampaignWidget;
