import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Divider,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const UserProfileWithAchievements = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const token = useSelector((state) => state.token);
  const isDarkMode = useSelector((state) => state.mode === "dark");
  const loggedInUserId = useSelector((state) => state.user._id); // ID of logged-in user
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.primary.main;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/profileWithAchievements`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile with achievements:", error);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: 3,
        bgcolor: isDarkMode ? palette.background.alt : "#f5f5f5",
      }}
    >
      {/* User Profile Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={`http://localhost:3001/assets/${profile.picturePath}`}
          alt={profile.firstName}
          sx={{
            width: 80,
            height: 80,
            border: `2px solid ${palette.neutral.main}`,
          }}
        />
        <Box ml={2}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color={palette.neutral.main}
          >
            {profile.firstName} {profile.lastName}
          </Typography>

          <Typography
            variant="subtitle1"
            color={palette.neutral.medium}
            display="flex"
            alignItems="center"
            marginTop="7px"
          >
            <Box
              component="img"
              src="/assets/quality.png"
              alt="Status Icon"
              sx={{
                width: "24px",
                height: "24px",
                objectFit: "cover",
                borderRadius: "50%", // Optional for rounded icons
                mr: 1,
              }}
            />
            Achievement Level: {profile.achievementLevel}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: palette.neutral.main }} />

      {/* Achievements Section */}
      <Box mt={2} sx={{ padding: 0, borderRadius: 2 }}>
        <Typography
          variant="h6"
          color={dark}
          display="flex"
          alignItems="center"
          sx={{
            "&:hover": {
              WebkitTextFillColor: "transparent",
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              WebkitBackgroundClip: "text",
              cursor: "pointer",
            },
            fontWeight: "bold",
            letterSpacing: 1.2,
          }}
        >
          <Box
            component="img"
            src="/assets/premium.png"
            marginLeft="7px"
            alt="Status Icon"
            sx={{
              width: "24px",
              height: "24px",
              objectFit: "cover",
              borderRadius: "50%",
              mr: 1,
            }}
          />
          Achievements
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
          {profile.badges && profile.badges.length > 0 ? (
            profile.badges.map((badge, index) => (
              <Tooltip key={index} title={badge} placement="top">
                <Chip
                  label={badge.replace("_", " ")}
                  color="primary"
                  icon={<StarIcon />}
                  variant="filled"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "20px",
                    padding: "6px 12px",
                    backgroundColor: "#7928CA",
                    color: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      backgroundColor: "#FF0080",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                />
              </Tooltip>
            ))
          ) : (
            <Typography
              color="textSecondary"
              sx={{ fontStyle: "italic", mt: 1 }}
            >
              No badges earned yet.
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: palette.neutral.main }} />

      {/* Campaign Participation Summary */}
      <Box mt={2}>
        <Typography
          variant="h6"
          color={dark}
          display="flex"
          alignItems="center"
          sx={{
            "&:hover": {
              WebkitTextFillColor: "transparent",
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              WebkitBackgroundClip: "text",
              cursor: "pointer",
            },
          }}
        >
          <EventIcon sx={{ mr: 1 }} /> Campaign Participation
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", my: 1 }}
          color={palette.neutral.medium}
        >
          Total Campaigns Joined: {profile.campaignCount}
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: palette.neutral.main }} />

      {/* Detailed List of Joined Campaigns */}
      <Box mt={2}>
        <Typography
          variant="h6"
          color={dark}
          display="flex"
          alignItems="center"
          sx={{
            "&:hover": {
              WebkitTextFillColor: "transparent",
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              WebkitBackgroundClip: "text",
              cursor: "pointer",
            },
          }}
        >
          <EventIcon sx={{ mr: 1 }} /> Joined Campaigns
        </Typography>
        {profile.joinedCampaigns.length > 0 ? (
          profile.joinedCampaigns.map((campaign) => (
            <Box
              key={campaign._id}
              mt={2}
              p={1.5}
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="10px"
              display="flex"
              flexDirection="column"
              boxShadow={2}
              bgcolor={isDarkMode ? palette.background.alt : "#ffffff"}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color={palette.neutral.main}
              >
                {campaign.title}
              </Typography>
              <Typography variant="body2" color={palette.neutral.medium}>
                {new Date(campaign.campaignStartDate).toLocaleDateString()} -{" "}
                {new Date(campaign.campaignEndDate).toLocaleDateString()}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={`Location: ${campaign.location}`}
                  color="default"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, borderColor: palette.neutral.medium }}
                />
                <Chip
                  label={`Max Volunteers: ${campaign.maxVolunteers}`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          ))
        ) : (
          <Typography color="textSecondary">
            No campaigns joined yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserProfileWithAchievements;
