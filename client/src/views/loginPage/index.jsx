import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Form from "./Form"; // Ensure this path is correct
import { VolunteerActivism as VolunteerIcon } from "@mui/icons-material"; // Import an icon to enhance the welcome message

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      >
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          onClick={() => navigate("/home")}
          sx={{
            color: theme.palette.mode === "dark" ? "white" : "black",
            display: "inline-block",
            "&:hover": {
              WebkitTextFillColor: "transparent",
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              WebkitBackgroundClip: "text",
              cursor: "pointer",
            },
          }}
        >
          EX
        </Typography>
      </Box>

      {/* Welcome Box */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.15)"
      >
        <Typography
          variant="h5"
          fontWeight="500"
          sx={{
            mb: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <VolunteerIcon fontSize="large" />
          Welcome to EX, the Social Media for Volunteers!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
