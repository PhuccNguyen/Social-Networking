import {
    ManageAccountsOutined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlinedOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material"
import Imageuser from "components/imageuser";
import AdjustContent from "components/adjustcontent";
import widgetwrapper from "components/widgetwrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
    const [ user, setUser ] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
}
