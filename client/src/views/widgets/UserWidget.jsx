import {ManageAccountsOutlined, EditOutlined,} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import React from 'react';
import UserImage from "components/UserImage";
import AdjustContent from "components/Adjustment";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
          const data = await response.json();
          console.log("Fetched User Data Successful From UW:", data); //check
          setUser(data);
      } else {
          console.error("Failed to fetch user data - UserWidget:");
      }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  if (!user) {
    return null;
  }

  const {
    firstName,
    status,
    email,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper position="fixed" margin="-0.5rem 1rem 1rem 1rem" top="14.5%" zIndex={1000} right="74%" width="370px" >
       {/******** One *******/}
       <AdjustContent
        gap="0.5rem"
        mb="0.4rem"
        onClick={() => navigate (`/profile/${userId}`)}>
        <AdjustContent gap="1.5rem">
        <UserImage image={picturePath} />  
         <Box>
            <Typography
            variant="h5"
            color={dark}
            fontWeight="500"
            sx = {{ "&:hover": 
               {
                WebkitTextFillColor: "transparent",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                WebkitBackgroundClip: "text",             
                cursor: "pointer",
               },
            }}>
              {firstName} {lastName}
            </Typography>
         </Box>
        </AdjustContent>
        <ManageAccountsOutlined/>
       </AdjustContent>
       <Divider />

       {/******** Two *******/}
       <Box gap="1.5rem" p="1rem 0" >

       <Typography fontSize="1rem" color={main} fontWeight="500" mb="0.6rem">
          Social Profiles
        </Typography>

       <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem" >
       <svg xmlns="http://www.w3.org/2000/svg" fontSize="2rem" width="1em" height="1em" viewBox="0 0 512 512"><path fill="#d62931" d="M240.3 396.8c3.3 5.1 9.1 8.5 15.7 8.5s12.4-3.4 15.8-8.5L382 226.6c14.8-22.9 23.4-48.1 23.4-77.3C405.3 64.9 339 0 256 0S106.7 64.9 106.7 149.3c0 29.2 8.6 54.4 23.4 77.3zM256 64c47.1 0 85.3 38.2 85.3 85.3s-38.2 85.3-85.3 85.3s-85.3-38.2-85.3-85.3S208.9 64 256 64m109.4 259.5L256 469.3L146.6 323.5c-37.4 19.6-61.3 48.9-61.3 81.8C85.3 464.2 161.7 512 256 512s170.7-47.8 170.7-106.7c0-32.9-23.9-62.2-61.3-81.8"/></svg>
          <Typography   variant="h5" fontWeight="100" color={dark} 
          sx = {{ "&:hover": 
               {
                WebkitTextFillColor: "transparent",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                WebkitBackgroundClip: "text",       
                cursor: "pointer",
               },
            }}>{location}</Typography>  
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <svg xmlns="http://www.w3.org/2000/svg" fontSize="1.5rem" sx= {{ color: main}} width="1em" height="1em" 
          viewBox="0 0 512 512"><path fill="#96a9b2" d="M511.824 425.007c1.941-5.245-220.916-173.519-220.916-173.519c-27.9-20.589-42.574-20.913-70.164 0c0 0-222.532 168.138-220.659 173.311l-.045.038c.023.045.06.076.091.117a48.482 48.482 0 0 0 8.119 14.157c1.473 1.786 3.248 3.282 4.955 4.837l-.083.064c.136.121.317.177.453.298c7.235 6.454 16.359 10.634 26.495 11.827c.159.019.287.102.446.121h.612c1.541.147 3.006.517 4.584.517h420.721c20.717 0 38.269-13.028 45.241-31.291c.083-.136.211-.234.287-.374z"/><path fill="#b9c5c6" d="M256.133 232.176L1.216 423.364V152.515c0-26.4 21.397-47.797 47.797-47.797h414.24c26.4 0 47.797 21.397 47.797 47.797v270.849z"/><path fill="#edece6" d="m4.189 135.896l217.645 170.949c27.47 20.271 41.918 20.591 69.083 0L508.22 136.167c-3.77-6.834-9.414-12.233-15.869-16.538l2.989-2.342c-7.295-6.641-16.62-10.946-26.971-12.058l-424.455.015c-10.322 1.097-19.662 5.417-26.942 12.043l2.967 2.313c-6.38 4.245-11.972 9.551-15.75 16.296"/><path fill="#dce2e2" d="M4.118 136.254C2.207 141.419 221.63 307.099 221.63 307.099c27.47 20.271 41.918 20.591 69.083 0c0 0 219.103-165.546 217.258-170.64l.045-.037c-.022-.045-.059-.074-.089-.115a47.732 47.732 0 0 0-7.994-13.939c-1.45-1.759-3.198-3.231-4.878-4.763l.082-.063c-.134-.119-.312-.175-.446-.294c-7.124-6.354-16.107-10.47-26.086-11.645c-.156-.019-.283-.1-.439-.119h-.602c-1.517-.145-2.96-.509-4.514-.509H48.81c-20.398 0-37.68 12.828-44.543 30.809c-.082.134-.208.231-.283.368z"/><path fill="#597b91" d="M291.401 154.645h-38.632a6.155 6.155 0 0 0-6.155 6.155v21.722a6.155 6.155 0 0 0 6.155 6.155h31.415a6.155 6.155 0 0 1 6.155 6.155v11.616a6.155 6.155 0 0 1-6.155 6.155h-31.415a6.155 6.155 0 0 0-6.155 6.155v23.578a6.155 6.155 0 0 0 6.155 6.155h41.316a6.155 6.155 0 0 1 6.155 6.155v12.441a6.155 6.155 0 0 1-6.155 6.155h-75.76a6.155 6.155 0 0 1-6.155-6.155V136.461a6.155 6.155 0 0 1 6.155-6.155h74.81c3.749 0 6.627 3.322 6.092 7.033l-1.733 12.028a6.156 6.156 0 0 1-6.093 5.278"/></svg>         
           <Typography variant="h5" fontWeight="100" color={dark} sx = {{ "&:hover": 
               {
                WebkitTextFillColor: "transparent",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                WebkitBackgroundClip: "text",                 cursor: "pointer",
               },
            }}> {email} </Typography>
          </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
        <svg xmlns="http://www.w3.org/2000/svg" fontSize="1.5rem" sx= {{ color: main}} width="1em" height="1em" viewBox="0 0 50 50"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke="#306cfe" d="M33.333 8.333A2.083 2.083 0 0 0 31.25 6.25h-12.5a2.083 2.083 0 0 0-2.083 2.083v6.25h16.666zM43.75 41.667v-25a2.083 2.083 0 0 0-2.083-2.084H8.333a2.083 2.083 0 0 0-2.083 2.084v25a2.083 2.083 0 0 0 2.083 2.083h33.334a2.083 2.083 0 0 0 2.083-2.083"/><path stroke="#344054" d="M22.917 29.167H18a8.33 8.33 0 0 1-7.583-5.042l-3.792-8.646a2.08 2.08 0 0 1 1.708-.896h33.334a2.08 2.08 0 0 1 1.708.896l-3.792 8.646A8.33 8.33 0 0 1 32 29.167h-4.917"/><path stroke="#306cfe" d="M27.083 27.083h-4.166v4.167h4.166z"/></g></svg>          
        <Typography variant="h5" fontWeight="100"  color={dark} 
        sx = {{ "&:hover": 
               {
                WebkitTextFillColor: "transparent",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                WebkitBackgroundClip: "text",                 cursor: "pointer",
               },
            }}> {occupation} </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="0.5rem" mb="0.5rem" >

        <svg xmlns="http://www.w3.org/2000/svg" fontSize="1.3rem" sx= {{ color: main}} width="1.25em" height="1em" viewBox="0 0 640 512"><path fill="#765dee" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112m76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2M480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96m48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48c0-61.9-50.1-112-112-112"/></svg>        

        <Typography variant="h5" fontWeight="100" marginLeft="0.2rem" color={dark} sx = {{ "&:hover": 
               {
                WebkitTextFillColor: "transparent",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                WebkitBackgroundClip: "text",                 cursor: "pointer",
               },
            }}>{friends.length} Friends </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
        <svg xmlns="http://www.w3.org/2000/svg" fontSize="1.5rem" sx= {{ color: main}} width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#29d646" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#29d646"><path d="M13 21.95q-.493.05-1 .05C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10q0 .507-.05 1"/><path d="M7.5 17c1.402-1.469 3.521-2.096 5.5-1.806M14.495 9.5c0 1.38-1.12 2.5-2.503 2.5a2.5 2.5 0 0 1-2.504-2.5c0-1.38 1.12-2.5 2.504-2.5a2.5 2.5 0 0 1 2.503 2.5"/><circle cx="18.5" cy="18.5" r="3.5"/></g></svg>      
          <Typography variant="h5" fontWeight="100" color={dark} sx = {{ "&:hover": 
               {
                WebkitTextFillColor: "transparent",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                WebkitBackgroundClip: "text",                 cursor: "pointer",
               },
            }}>   {status} 
            </Typography>
        </Box>
        
       </Box>
        <Divider />

       
             {/******** Four *******/}
             <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <AdjustContent gap="1rem" mb="0.5rem">
          <AdjustContent gap="1rem">
          <svg xmlns="http://www.w3.org/2000/svg" fontSize="1.3rem" sx= {{ color: main}} width="1.25em" height="1em" viewBox="0 0 640 512"><path fill="#765dee" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112m76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2M480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96m48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48c0-61.9-50.1-112-112-112"/></svg>        
           <Box>

              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </AdjustContent>
          <EditOutlined sx={{ color: main }} />
        </AdjustContent>

        <AdjustContent gap="1rem" mb="0.5rem">
          <AdjustContent gap="1rem">
          <svg xmlns="http://www.w3.org/2000/svg" fontSize="30px"   width="0.89em" height="1em" viewBox="0 0 256 290"><path fill="#ff004f" d="M189.72 104.421c18.678 13.345 41.56 21.197 66.273 21.197v-47.53a67 67 0 0 1-13.918-1.456v37.413c-24.711 0-47.59-7.851-66.272-21.195v96.996c0 48.523-39.356 87.855-87.9 87.855c-18.113 0-34.949-5.473-48.934-14.86c15.962 16.313 38.222 26.432 62.848 26.432c48.548 0 87.905-39.332 87.905-87.857v-96.995zm17.17-47.952c-9.546-10.423-15.814-23.893-17.17-38.785v-6.113h-13.189c3.32 18.927 14.644 35.097 30.358 44.898M69.673 225.607a40 40 0 0 1-8.203-24.33c0-22.192 18.001-40.186 40.21-40.186a40.3 40.3 0 0 1 12.197 1.883v-48.593c-4.61-.631-9.262-.9-13.912-.801v37.822a40.3 40.3 0 0 0-12.203-1.882c-22.208 0-40.208 17.992-40.208 40.187c0 15.694 8.997 29.281 22.119 35.9"/><path d="M175.803 92.849c18.683 13.344 41.56 21.195 66.272 21.195V76.631c-13.794-2.937-26.005-10.141-35.186-20.162c-15.715-9.802-27.038-25.972-30.358-44.898h-34.643v189.843c-.079 22.132-18.049 40.052-40.21 40.052c-13.058 0-24.66-6.221-32.007-15.86c-13.12-6.618-22.118-20.206-22.118-35.898c0-22.193 18-40.187 40.208-40.187c4.255 0 8.356.662 12.203 1.882v-37.822c-47.692.985-86.047 39.933-86.047 87.834c0 23.912 9.551 45.589 25.053 61.428c13.985 9.385 30.82 14.86 48.934 14.86c48.545 0 87.9-39.335 87.9-87.857z"/><path fill="#00f2ea" d="M242.075 76.63V66.516a66.3 66.3 0 0 1-35.186-10.047a66.47 66.47 0 0 0 35.186 20.163M176.53 11.57a68 68 0 0 1-.728-5.457V0h-47.834v189.845c-.076 22.13-18.046 40.05-40.208 40.05a40.06 40.06 0 0 1-18.09-4.287c7.347 9.637 18.949 15.857 32.007 15.857c22.16 0 40.132-17.918 40.21-40.05V11.571zM99.966 113.58v-10.769a89 89 0 0 0-12.061-.818C39.355 101.993 0 141.327 0 189.845c0 30.419 15.467 57.227 38.971 72.996c-15.502-15.838-25.053-37.516-25.053-61.427c0-47.9 38.354-86.848 86.048-87.833"/></svg>            <Box>
              <Typography color={main} fontWeight="500">
                TikTok
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </AdjustContent>
          <EditOutlined sx={{ color: main }} />
        </AdjustContent>

        <AdjustContent mb="0.5rem" >
          <Typography color={medium}>Who's   viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </AdjustContent>

        <AdjustContent >
          <Typography color={medium}>Interaction of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </AdjustContent>

      </Box>


    </WidgetWrapper>
  )

};

export default UserWidget;
