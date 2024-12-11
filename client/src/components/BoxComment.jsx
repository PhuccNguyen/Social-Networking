import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";
import { useSelector } from "react-redux";

const BoxComment = ({ friendId, firstName, lastName, subtitle, userPicturePath }) => {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.mode === "dark");
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const main = palette.primary.main;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="0.45rem"
      sx={{
        cursor: "pointer",
        padding: "0.1rem 0.1rem",
        backgroundColor: isDarkMode ? palette.background.default : "#f9f9f9", // Light or dark background
        borderRadius: "8px",
      }}
      onClick={() => {
        navigate(`/profile/${friendId}`);
        navigate(0);
      }}
    >
      <UserImage image={userPicturePath} size="35px" />
      <Box>
        <Typography
          variant="body2"
          fontWeight="500"
          sx={{
            lineHeight: 1.2,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span>{firstName} {lastName}</span>
          <span style={{ fontSize: "0.75rem", color: medium, marginLeft: "5px" }}>
            {subtitle}
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default BoxComment;
