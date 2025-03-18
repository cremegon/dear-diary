import React, { useEffect } from "react";
import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup.tsx";
import { AuthProvider } from "./util/contextProvider.tsx";
import { Homepage } from "./pages/Homepage.tsx";
import { Login } from "./pages/Login.tsx";
import { ProtectedRoute, PublicRoute } from "./util/RouteAuth.tsx";
import HomePageLayout from "./pages/HomeLayout.tsx";
import { ProfilePage } from "./pages/Profile.tsx";
import SettingsPage from "./pages/Settings.tsx";
import AboutPage from "./pages/About.tsx";
import Drawing from "./pages/DrawCanvas.tsx";
import Editor from "./pages/Write2.tsx";
import DiaryPage from "./pages/HomeDiary.tsx";
import ChapterPage from "./pages/HomeChapter.tsx";
import EditorPageLayout from "./pages/EditorLayout.tsx";

function App() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      const user: {
        isAuthenticated: boolean;
        loggedIn: boolean;
        theme: string;
        username: string;
      } = {
        isAuthenticated: false,
        loggedIn: false,
        theme: "light",
        username: "",
      };
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthProvider />}>
          <Route element={<PublicRoute />}>
            <Route path="/draw" element={<Drawing />} />
            <Route path="/login" element={<Login />} />
            <Route index path="/signup" element={<Signup />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<HomePageLayout />}>
              <Route path="diary" element={<DiaryPage />} />
              <Route path="diary/:diaryId/chapter" element={<ChapterPage />} />

              <Route index path="/" element={<Homepage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route element={<EditorPageLayout />}>
              <Route
                path="diary/:diaryId/chapter/:chapterId/write-session"
                element={<Editor />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
