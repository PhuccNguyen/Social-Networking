import { useState } from "react";
import { Box, IconButton, InputBase, Typography, Select, MenuItem, FormControl, useTheme, useMediaQuery } from "@mui/material";
import { Search, Message, DarkMode, LightMode, Notifications, Menu, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/Adjustment";
import Textnavbar from "components/Textnavbar";
import SetMode from "components/SetMode";
import ButtonNavbar from "CSS/ButtonNavbar";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Get user info from state
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;
  const userId = user._id; 
  const userRole = user.role; 

  return (
    <Box
      position="fixed"
      top="0"
      width="100%"
      zIndex="1000"
      backgroundColor={alt}
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
    >
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        {/* Logo and Search */}
        <FlexBetween gap="1.75rem">
          <Typography
            variant="h5"
            color={dark}
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            sx={{
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

          {isNonMobileScreens && (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="5px"
              padding="0.1rem 1.5rem"
              gap="1rem"
              sx={{
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <InputBase placeholder="Search..." sx={{ width: "100%" }} />
              <IconButton>
                <Search />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        {/* Buttons Section */}
        <Textnavbar gap="1.5rem">
          <ButtonNavbar label="Profile" path={`/profile/${userId}`} /> {/* Profile button with dynamic userId */}
          <ButtonNavbar label="Home" path="/home" />
          <ButtonNavbar label="Volunteer" path="/volunteer" />

          {/* Hiển thị nút Admin nếu role là admin */}
          {userRole === "user" && (
            <ButtonNavbar label="Admin" path="/admin" />
          )}
        </Textnavbar>

        {/* Desktop Icons and Profile */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
             <SetMode /> {/* Thay thế IconButton thành Switch SetMode */}


            <Notifications sx={{ fontSize: "25px" }} />
            
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
            <Menu />
          </IconButton>
        )}

        {/* Mobile Menu */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="300px"
            minWidth="200px"
            backgroundColor={background}
          >
            
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                <Close />
              </IconButton>
            </Box>

            <FlexBetween display="flex" flexDirection="column" alignItems="center" gap="2rem" padding="2rem">
              <ButtonNavbar label="Profile" path={`/profile/${userId}`} /> {/* Mobile Profile button */}
              <ButtonNavbar label="Home" path="/home" />
              <ButtonNavbar label="Volunteer" path="/volunteer" />

              {/* display button if admin*/}
              {userRole === "user" && (
                <ButtonNavbar label="Admin" path="/admin" />
              )}

              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
              </IconButton>
              
              <Notifications sx={{ fontSize: "25px" }} />
              

              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
    </Box>
  );
};

export default Navbar;
