
// import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { useRouter } from "next/router";
import HomePage from './app/homePage/page';
import LoginPage from './app/loginPage';
import ProfilePage from './app/profilePage/page';
import {  useMemo } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme }  from "@mui/material/styles";
import { themeSettings } from './theme';


function App() {
  // const router = useRouter();
  const mode = useSelector ((state) => state.mode);
  const theme = useMemo (() => createTheme(themeSettings(mode)), [mode]);



    return <div className="app">
        <BrowserRouter>
         <ThemeProvider theme={theme}>
          <CssBaseline />
           <Routes>
             <Route path="/" element = { < LoginPage /> } />
             <Route path="/home" element = { < HomePage /> } />
             <Route path="/profile/:userId" element = { < ProfilePage /> } />
           </Routes>
          </ThemeProvider>
        </BrowserRouter>
    </div>
}

export default App;