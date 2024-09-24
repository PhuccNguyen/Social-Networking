import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";

const BoxComment = ({ friendId, firstName, lastName, subtitle, userPicturePath }) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="0.75rem"
      sx={{
        cursor: "pointer",
        padding: "0.5rem 0",
        "&:hover": {
          backgroundColor: palette.action.hover,
          borderRadius: "0.5rem",
        },
      }}
      onClick={() => {
        navigate(`/profile/${friendId}`);
        navigate(0);
      }}
    >
      <UserImage image={userPicturePath} size="35px" />
      <Box>
        <Typography
          color={main}
          variant="body2"
          fontWeight="500"
          sx={{ lineHeight: 1.2 }}
        >
                    {firstName}
                    {lastName}

        </Typography>
        
        <Typography color={medium} fontSize="0.75rem">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default BoxComment;
