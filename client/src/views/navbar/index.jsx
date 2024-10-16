import React, { useState } from "react";
import { Box, IconButton, InputBase, Typography, MenuItem, Menu } from "@mui/material";
import { Search, Message, Notifications, Menu as MenuIcon, Close, Logout, DarkMode, LightMode } from "@mui/icons-material"; 
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import FlexBetween from "components/Adjustment";
import Textnavbar from "components/Textnavbar";
import UserImage from "components/UserImage"; // Import UserImage component
import SetMode from "components/SetMode";
import Bell from "components/BellNavbar";
import ButtonNavbar from "CSS/ButtonNavbar";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false); 
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Get user info from state
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  
  console.log(user.picturePath);

  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;
  const userId = user._id;
  const userRole = user.role;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
  {/* Logo cải tiến */}
  <Typography
    variant="h5"
    color={dark}
    fontWeight="bold"
    fontSize="clamp(1.5rem, 2rem, 2.25rem)" // Tăng kích thước logo một chút
    sx={{
      "&:hover": {
        WebkitTextFillColor: "transparent",
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", // Cải thiện gradient
        WebkitBackgroundClip: "text",
        cursor: "pointer",
      },
      transition: "all 0.3s ease", // Thêm hiệu ứng chuyển động mềm
    }}
  >
    EX
  </Typography>

  {/* Search Box cải tiến */}
  {isNonMobileScreens && (
    <FlexBetween
      backgroundColor={neutralLight}
      borderRadius="30px" // Bo góc mạnh hơn để tạo sự mềm mại
      padding="0.3rem 1.5rem" // Thêm padding để tăng khoảng cách
      gap="0.5rem"
      sx={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Tăng độ sâu của bóng đổ
        transition: "box-shadow 0.3s ease", // Hiệu ứng chuyển động bóng đổ
        "&:hover": {
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)", // Thêm bóng khi hover
        },
      }}
    >
      <InputBase
        placeholder="Search..."
        sx={{
          width: "100%",
          fontSize: "1rem", // Tăng kích thước chữ tìm kiếm
          color: dark,
        }}
      />
      <IconButton
        sx={{
          padding: "0.3rem",
          backgroundColor: "rgba(0, 0, 0, 0.05)", // Màu nền nhẹ cho nút tìm kiếm
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)", // Tăng màu nền khi hover
          },
          transition: "background-color 0.3s ease",
        }}
      >
        <Search sx={{ color: dark }} /> {/* Màu sắc biểu tượng tìm kiếm */}
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
          {userRole === "admin" && (
            <ButtonNavbar label="Admin" path="/admin" />
          )}
        </Textnavbar>

        {/* Desktop Icons and Profile */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <SetMode /> 

            <Bell />

            <IconButton 
  onClick={handleMenuOpen}
  sx={{ 
    border: "1px solid", // Thêm viền solid
    borderColor: theme.palette.neutral.main, // Màu viền dựa trên theme
    borderRadius: "50%", // Đảm bảo border tròn
    padding: "3px" // Tạo khoảng cách bên trong giữa hình ảnh và viền
  }}
>
  <UserImage image={user.picturePath} size="35px" />
</IconButton>


            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  mt: 1.5,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>
                <Logout fontSize="small" />
                Log Out
              </MenuItem>
            </Menu>
          </FlexBetween>
        ) : (
          <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
            <MenuIcon />
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
              <ButtonNavbar label="Profile" path={`/profile/${userId}`} />
              <ButtonNavbar label="Home" path="/home" />
              <ButtonNavbar label="Volunteer" path="/volunteer" />

              {userRole === "admin" && <ButtonNavbar label="Admin" path="/admin" />}

              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
              </IconButton>

              <Notifications sx={{ fontSize: "25px" }} />

              <IconButton onClick={handleMenuOpen}>
                <UserImage image={user.picturePath} size="35px" /> {/* Sử dụng component UserImage */}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  <Logout fontSize="small" />
                  Log Out
                </MenuItem>
              </Menu>
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
    </Box>
  );
};

export default Navbar;
