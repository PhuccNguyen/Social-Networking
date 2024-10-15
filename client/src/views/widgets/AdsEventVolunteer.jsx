import { Typography, useTheme, Box, Divider } from "@mui/material";
import FlexBetween from "components/Adjustment";
import WidgetWrapper from "components/WidgetWrapper";
import FriendListWidget from 'views/widgets/FriendList';  // Assuming this is your custom widget
import { useSelector } from 'react-redux';

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // Pulling user data from Redux state
  const { _id, picturePath, userName } = useSelector((state) => state.user);

  return (
    <WidgetWrapper
      position="fixed"
      margin="-0.5rem 1rem 1rem 1rem"
      boxShadow= "0px 6px 13px 3px rgba(0, 0, 0, 0.1)"
      top="14.5%"
      zIndex={1000}
      left="74%"
      sx={{
        overflowY: 'auto', // Allow scrolling when content exceeds available space
        maxHeight: '85vh', // Set a maximum height to the widget to restrict its height
        "&::-webkit-scrollbar": { width: "6px" },  // Optional: Customize scrollbar
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#888" },  // Scrollbar color
        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" }  // Scrollbar hover effect
      }}
    >
      {/* Header */}
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>

      {/* Advert Image */}
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/335424252_218593214161770_7240714562060576690_n.png"  // Update URL based on your image hosting
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />

      {/* Location and Registration Info */}
      <FlexBetween>
        <Typography color={main}>Thanh Pho Ho Chi Minh</Typography>
        <Typography color={medium}>10 Register</Typography>
      </FlexBetween>

      {/* Volunteer Quote */}
      <Typography color={medium} m="0.5rem 0">
        "Engaging in volunteer work has made me realize how much 
        I've grown, how fortunate I am, and how important it is to live with a sense of responsibility."
      </Typography>

      <Divider />

      <Box
       margin=" 10px 0px 0px 0px "
        maxHeight="300px"  // Limit the height of the friend list
        overflowY="auto"   // Enable vertical scrolling if content exceeds maxHeight
        sx={{
          "&::-webkit-scrollbar": { width: "6px" },  // Optional scrollbar styling
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#888" },
          "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" }
        }}
      >
        {/* Friend List - passing the userId to fetch friend's data */}
        <FriendListWidget userId={_id} />
      </Box>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
