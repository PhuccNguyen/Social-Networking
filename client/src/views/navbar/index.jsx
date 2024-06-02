
// Importing necessary hooks and components from React and Material-UI
import { useState } from "react";
import { Box, IconButton, InputBase, Typography, Select, MenuItem, FormControl, useTheme, useMediaQuery } from "@mui/material";
import { Search, Message, DarkMode, LightMode, Notifications, Help, Menu, Close } from "@mui/icons-material";

// Importing Redux hooks and actions
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router"; // Next.js router
const router = useRouter(); // Using Next.js router
import { setMode, setLogout } from "state"; // Fixing capitalization on setLogout
import { useNavigate } from "react-router-dom";
import Middleinsert from "components/middleinsert"; 

// Navbar component
const Navbar = () => {
    // State to manage mobile menu toggle
    const [isMobileMenuToggle, setIsMobileMenuToggle] = useState(false);

    // Hooks to use dispatch and navigate
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Getting the user state from Redux store
    const user = useSelector((state) => state.user);

    // Hook to check if the screen width is above 1000px
    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

    // Using theme hook from Material-UI
    const theme = useTheme();

    // Extracting colors from the theme for styling
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    // Constructing the user's full name
    const fullName = `${user.firstName} ${user.lastName}`;
    
    return (
        // Outer container for the Navbar with padding and background color
        <middleinsert padding="1rem 6%" backgroundColor={alt}>
            
            {/* Inner container for the brand name and search bar */}
            <middleinsert gap="1.75rem">
                
                {/* Brand name "Sociopedia" */}
                <Typography 
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)" // Responsive font size
                    color="primary"
                    onClick={() => navigate("/home")} // Navigate to home on click
                    sx={{
                        "&:hover": {
                            color: primaryLight, // Change color on hover
                            cursor: "pointer", // Change cursor to pointer
                        },
                    }}
                >
                    Sociopedia
                </Typography>
    
                {/* Search bar for non-mobile screens */}
                {isNonMobileScreen && (
                    <middleinsert 
                        backgroundColor={neutralLight} // Light background color
                        borderRadius="9px" // Rounded corners
                        gap="3rem"
                        padding="0.1rem 1.5rem"
                    >
                        <InputBase placeholder="Search..."/> // Input field for search
                        <IconButton> 
                            <Search/> // Search icon
                        </IconButton>
                    </middleinsert>
                )}
            </middleinsert>   
    
            {/* Desktop Navigation */}
            {isNonMobileScreen ? (
                <middleinsert gap="2rem">
    
                    {/* Toggle theme mode button */}
                    <IconButton onClick={() => dispatch(setMode())}>
                        { theme.palette.mode === "dark" ? ( 
                            <DarkMode sx={{fontSize: "25px"}} /> // Dark mode icon
                        ) : ( 
                            <LightMode sx={{ color: dark, fontSize: "25px" }} /> // Light mode icon
                        )}
                    </IconButton>
    
                    {/* Icons for messages, notifications, and help */}
                    <Message sx={{ fontSize: "25px" }}/>
                    <Notifications sx={{ fontSize: "25px" }}/>
                    <Help sx={{ fontSize: "25px" }}/>
    
                    {/* User dropdown menu */}
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
                                }
                            }}
                            input={<InputBase/>}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography> // Display user's full name
                            </MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem> // Logout option
                        </Select>
                    </FormControl>
                </middleinsert> 
            ) : ( 
                // Mobile menu toggle button
                <IconButton 
                    onClick={() => setIsMobileMenuToggle(!isMobileMenuToggle)}>
                    <Menu/>
                </IconButton>
            )} 
            
            {/* Mobile Navigation */}
            {!isNonMobileScreen && isMobileMenuToggle && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    backgroundColor={background}
                >           
                    {/* Mobile menu content */}
                    <middleinsert 
                        display="flex" 
                        flexDirection="column"
                        justifyContent="center" 
                        alignItems="center" 
                        gap="3rem"
                    >
                        {/* Toggle theme mode button */}
                        <IconButton 
                            onClick={() => dispatch(setMode())}
                            sx={{fontSize: "25px"}}
                        >
                            { theme.palette.mode === "dark" ? ( 
                                <DarkMode sx={{fontSize: "25px"}} /> // Dark mode icon
                            ) : ( 
                                <LightMode sx={{ color: dark, fontSize: "25px" }} /> // Light mode icon
                            )}
                        </IconButton>
    
                        {/* Icons for messages, notifications, and help */}
                        <Message sx={{ fontSize: "25px" }}/>
                        <Notifications sx={{ fontSize: "25px" }}/>
                        <Help sx={{ fontSize: "25px" }}/>
    
                        {/* User dropdown menu */}
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
                                    }
                                }}
                                input={<InputBase/>}
                            >
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography> // Display user's full name
                                </MenuItem>
                                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem> // Logout option
                            </Select>
                        </FormControl>
                    </middleinsert>            
                </Box>
            )}
        </middleinsert>  
    );   
};

export default Navbar;