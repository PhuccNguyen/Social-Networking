import React from "react";
import { Button, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ButtonNavbar = ({ label, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isActive = location.pathname === path;

  return (
    <Button
      onClick={() => navigate(path)}
      sx={{
        fontSize: "12px",
        width: "130px", // Ensures all buttons have the same width
        height: "47px", // Ensures all buttons have the same height
        background: isActive
          ? "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)"
          : "transparent",
        border: "none",
        padding: "1em 1.5em",
        color: isActive
          ? "#ffffff"
          : theme.palette.mode === "dark"
          ? "#ffffff"
          : "#000000",
        textTransform: "uppercase",
        position: "relative",
        transition: "0.5s ease",
        cursor: "pointer",
        boxShadow: theme.palette.mode === "light" ? "0px 4px 10px rgba(0, 0, 0, 0.1)" : "none", // Shadow in light mode only
        // borderRadius: "10px", // Smooth rounded edges
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          height: "2px",
          backgroundColor: theme.palette.mode === "dark" ? "#ffffff" : "#000000", // Adjust line color based on theme
          width: "0%",
          transition: "0.5s ease",
        },
        "&:hover": {
          // background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
          // color: "black",
          // boxShadow: theme.palette.mode === "light" ? "0px 6px 15px rgba(0, 0, 0, 0.2)" : "none", // More pronounced shadow on hover
        },
        "&:hover::before": {
          width: "100%",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "transparent",
        },
        "&:hover::after": {
          height: "100%",
        },
        "&:active": {
          background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
          color: "#ffffff",
        },
      }}
    >
      {label}
    </Button>
  );
};

export default ButtonNavbar;
