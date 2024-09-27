import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "views/homePage";
import LoginPage from "views/loginPage";
import ProfilePage from "views/ProfilePage";
import SavePost from "views/savepost";
import VolunteerPage from "views/VolunteerPage";
import SavedPostsPage from "views/SavedPostsPage";
import NotFoundPage from "views/NotFoundPage"; // Import the new NotFoundPage
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/volunteer" element={isAuth ? <VolunteerPage /> : <Navigate to="/" />} />
            <Route path="/SavedPostsPage" element={isAuth ? <SavedPostsPage /> : <Navigate to="/" />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/savepost/:userId" element={isAuth ? <SavePost /> : <Navigate to="/" />} />
            {/* Wildcard route for 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
