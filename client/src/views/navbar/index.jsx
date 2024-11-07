import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  MenuItem,
  Menu,
  Alert,
  Paper, List, ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import {
  Search,
  Message,
  Notifications,
  Menu as MenuIcon,
  Close,
  Logout,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ users: [], posts: [], campaigns: [] });
  const [alertMessage, setAlertMessage] = useState("");
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();

  console.log(user.picturePath);

  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;
  const token = useSelector((state) => state.token);  // Now `useSelector` is defined

  const fullName = `${user.firstName} ${user.lastName}`;
  const userId = user._id;
  const userRole = user.role;



  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSearchResults({
        users: data.users || [],
        posts: data.posts || [],
        campaigns: data.campaigns || [],
      });
    } catch (error) {
      console.error("Error searching:", error);
      setAlertMessage("Failed to fetch search results");
    }
  };

  const handleRowClick = (type, id) => {
    if (type === "user") {
      navigate(`/profile/${id}`);
    } else if (type === "post") {
      navigate(`/posts/${id}`);
    } else if (type === "campaign") {
      navigate(`/campaigns/${id}`);
    }
  };


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

          <div style={{ position: "relative", zIndex: 1000 }}>
      {/* Search Bar */}
      <FlexBetween
        backgroundColor="#f0f0f0"
        borderRadius="30px"
        padding="0.3rem 1.5rem"
        gap="0.5rem"
        sx={{
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <InputBase
          placeholder="Search by username, post, or campaign..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "100%",
            fontSize: "0.85rem",
          }}
        />
        <IconButton onClick={handleSearch} sx={{ padding: "0.3rem" }}>
          <Search />
        </IconButton>
      </FlexBetween>

      {/* Alert Notification */}
      {alertMessage && (
        <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
          <Alert severity="error" onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        </div>
      )}

      {/* Search Results Table */}
      {(searchResults.users.length > 0 || searchResults.posts.length > 0 || searchResults.campaigns.length > 0) && (
      <TableContainer
      component={Paper}
      sx={{
        position: "fixed", // Change to fixed positioning
        top: "75px",       // Position it based on viewport
        left: "40%",       // Center horizontally relative to viewport
        transform: "translateX(-50%)", // Center alignment
        width: "90%",      // Set to almost full width, adjust as necessary
        maxWidth: "600px", // Maximum width to keep it compact
        maxHeight: "200px", // Enable scrolling if content overflows
        overflowY: "auto",
        zIndex: "9999",    // High z-index to stay above other elements
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Table size="small" aria-label="search results">
        <TableBody>
          {searchResults.users.map((user) => (
            <TableRow
              key={user._id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => handleRowClick("user", user._id)}
            >
              <TableCell>User</TableCell>
              <TableCell>{user.userName}</TableCell>
            </TableRow>
          ))}
          {searchResults.posts.map((post) => (
            <TableRow
              key={post._id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => handleRowClick("post", post._id)}
            >
              <TableCell>Post</TableCell>
              <TableCell>{post.description}</TableCell>
            </TableRow>
          ))}
          {searchResults.campaigns.map((campaign) => (
            <TableRow
              key={campaign._id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => handleRowClick("campaign", campaign._id)}
            >
              <TableCell>Campaign</TableCell>
              <TableCell>{campaign.title} - {campaign.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
      )}
    </div>
        </FlexBetween>

        {/* Buttons Section */}
        <Textnavbar gap="1.5rem">
          <ButtonNavbar label="Profile" path={`/profile/${userId}`} />{" "}
          {/* Profile button with dynamic userId */}
          <ButtonNavbar label="Home" path="/home" />
          <ButtonNavbar label="Volunteer" path="/volunteer" />
          {/* Hiển thị nút Admin nếu role là admin */}
          {userRole === "admin" && <ButtonNavbar label="Admin" path="/admin" />}
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
                padding: "3px", // Tạo khoảng cách bên trong giữa hình ảnh và viền
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
                  overflow: "visible",
                  mt: 1.5,
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
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
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
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
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            <FlexBetween
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="2rem"
              padding="2rem"
            >
              <ButtonNavbar label="Profile" path={`/profile/${userId}`} />
              <ButtonNavbar label="Home" path="/home" />
              <ButtonNavbar label="Volunteer" path="/volunteer" />

              {userRole === "admin" && (
                <ButtonNavbar label="Admin" path="/admin" />
              )}

              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
              </IconButton>

              <Notifications sx={{ fontSize: "25px" }} />

              <IconButton onClick={handleMenuOpen}>
                <UserImage image={user.picturePath} size="35px" />{" "}
                {/* Sử dụng component UserImage */}
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
