import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Tabs,
  Tab,
  useTheme,
  Tooltip,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import Navbar from "views/navbar";
import { useSelector } from "react-redux";
import UserWidget from "views/widgets/UserWidget";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MakeFriendPost from "views/widgets/MakeFriendPost";
import FriendRequests from "views/widgets/FriendRequests";
import FriendSuggestions from "views/widgets/FriendSuggestions";
import FriendRequestsSent from "views/widgets/FriendRequestsSent";

const FriendPage = () => {
  const { _id, picturePath, userName, role } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Navbar />
      <Box
        display="flex"
        justifyContent="space-between"
        marginTop="2.8rem"
        padding="1rem"
      >
        {/* Fixed Left Section: UserWidget */}
        <Box>
          <UserWidget
            userId={_id}
            picturePath={picturePath}
            userName={userName}
            role={role}
          />
        </Box>

        {/* Main Content: Friends Management */}
        <Box
          flex="1"
          marginLeft="320px"
          padding="1.5rem"
          overflow="auto"
          minHeight="80vh"
        >
          <Box
            position="fixed"
            top="90px"
            left="390px"
            right="1rem"
            padding="0.75rem 1rem"
            zIndex={100}
            borderRadius="8px"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color={isDarkMode ? "text.secondary" : "text.primary"}
                onClick={() => navigate("/Home")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                }}
              >
                <HomeIcon fontSize="small" sx={{ marginRight: "0.3rem" }} />
                Home
              </Link>

              <Typography
                color={isDarkMode ? "text.secondary" : "text.primary"}
                fontSize="1.1rem"
                fontWeight={500}
              >
                Friends
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Content starts below the fixed breadcrumbs */}
          <Box
            position="fixed"
            top="140px"
            left="390px"
            right="1rem"
            zIndex={999}
            Width="calc(100% - 420px)"
          >
            <Paper
              elevation={4}
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "1.5rem",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                aria-label="friend management tabs"
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "white",
                  "& .MuiTab-root": {
                    fontWeight: 500,
                    fontSize: "1rem",
                    textTransform: "none",
                    padding: "0.5rem 1rem",
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  },
                  "& .Mui-selected": {
                    background:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)"
                        : "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                    borderRadius: "4px",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "transparent",
                  },
                }}
              >
  <Tooltip title="View requests others have sent to you" arrow>
    <Tab
      icon={
        <Box display="flex" alignItems="center" gap="0.2rem">
          <Box
            component="img"
            src="/assets/emailaa.png"
            alt="Received"
            sx={{ width: "34px", height: "34px" }}
          />
        </Box>
      }
      label="Requests Received"
    />
  </Tooltip>


                <Tooltip title="Check the requests you have sent" arrow>
                  <Tab icon={<PersonAddIcon />} label="Requests Sent" />
                </Tooltip>

                <Tooltip title="See suggestions for people you may know" arrow>
                  <Tab icon={<PeopleIcon />} label="Suggestions" />
                </Tooltip>

                <Tooltip title="View and manage your current friends" arrow>
                  <Tab icon={<GroupIcon />} label="Friends" />
                </Tooltip>
              </Tabs>
            </Paper>

            {/* Content for each tab */}
            <Paper
              elevation={3}
              sx={{ borderRadius: "4px", padding: "1rem", minHeight: "470px" }}
            >
              {tabValue === 0 && <FriendRequests userId={_id} />}
              {tabValue === 1 && <FriendRequestsSent userId={_id} />}
              {tabValue === 2 && <FriendSuggestions userId={_id} />}
              {tabValue === 3 && <MakeFriendPost userId={_id} />}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FriendPage;
