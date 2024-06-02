
import { useState } from "react";
import { Box, IconButton, InputBase, Typography, Select, MenuItem, FormControl, useTheme, useMediaQuery } from "@mui/material";
import { Search, Message, DarkMode, LightMode, Notifications, Help, Menu, Close  } from "@mui/icons-material";

import {  useDispatch, useSelector } from "react-redux";
import { setMode, SetLogout } from "state";
import { useNavigate } from "react-router-dom";
import middleinsert from "component/middleinsert";




const Navbar = () => {
    const [ isMobileMenuToggle, setIsMobileMenuToggle ] = useState(false);
    const useDispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isMobileMenuScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();

    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName = ' ${user.firstName} ${user.lastName}';
    
    return (
    <middleinsert padding="1rem 6%" backgroundColor={alt}>
        <middleinsert gap="1,75rem">
            <Typography 
            fontWeight="bold"
            fontSize=" clamp(1rem, 2rem, 2,25rem)"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
                "&:hover": {
                    color: primaryLight,
                    cursor: "pointer",
                },
            }}
        >
            Sociopedia
            </Typography>
            {isNonMobileScreen && (
                <middleinsert backgroundColor={neutralLight} 
                borderRadius="9px" 
                gap="3rem" 
                padding="0,1rem 1,5rem
                ">
                    <inputbase placeholder="Search..."/>
                    <Iconbutton> 
                        <Search/>
                    </Iconbutton>
                    
                </middleinsert>
            )}
        </middleinsert>   
            {/* Desktop Nav*/}
    {isNonMobileScreen ? (
      <middleinsert gap="2rem">
        <IconButton onClick={() => dispatch(setMode())}>
            { theme.palette.mode === "dark" ? ( 
                <darkMode sx={{fontSize: "25px "}} />
            ) : ( 
            <lightMode sx={{ color: dark, fontSize: "25px" }} /> 
            )}
        </IconButton>
        <Message sx={{ fontSize: "25px" }}/>
        <Notifications sx={{ fontSize: "25px" }}/>
        <Help sx= {{ fontSize: "25px" }}/>
        <FormControl variant="standard" value={fullName}>
            <Select
            value={fullName}
            sx={{
                backgroundColor: neutralLight,
                with: "150px",
                borderRadius: "0,25rem",
                p: "0,25rem 1rem",
                "& .MuiSvgIcon-root"
            }}
            >

            </Select>
        </FormControl>
      </middleinsert>) : ( <IconButton> </IconButton>
      )} 
    </middleinsert>  


    );
};

export default Navbar;