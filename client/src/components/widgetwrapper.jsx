import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.2rem 1.5rem 1.2rem 1.5rem",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.4rem",
}));

export default WidgetWrapper;