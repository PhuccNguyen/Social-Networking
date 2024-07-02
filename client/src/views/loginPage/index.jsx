import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import Form from "./Form";  // Ensure this path is correct
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          onClick={() => navigate("/home")}
          sx={{
            color: theme.palette.mode === "dark" ? "white" : "black",
            "&:hover": {
              WebkitTextFillColor: "transparent",
              background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
              WebkitBackgroundClip: "text",
              cursor: "pointer",
            },
          }}
        >
          FX
        </Typography>        
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to FX, the Social Media for Volunteer!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
