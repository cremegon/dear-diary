import React, { useEffect } from "react";
import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/auth/Signup.tsx";
import { AuthProvider } from "./context/contextProvider.tsx";
import { Homepage } from "./pages/Homepage.tsx";
import { Login } from "./pages/auth/Login.tsx";
import { ProtectedRoute, PublicRoute } from "./context/RouteAuth.tsx";
import HomePageLayout from "./pages/layouts/HomeLayout.tsx";
import { ProfilePage } from "./pages/Profile.tsx";
import SettingsPage from "./pages/Settings.tsx";
import AboutPage from "./pages/About.tsx";
import Drawing from "./pages/diary/DrawCanvas.tsx";
import Editor from "./pages/diary/TextEditor.tsx";
import DiaryPage from "./pages/diary/HomeDiary.tsx";
import ChapterPage from "./pages/diary/HomeChapter.tsx";
import EditorPageLayout from "./pages/layouts/EditorLayout.tsx";
import ArchivePage from "./pages/archive/HomeArchive.tsx";
import ArchiveChapterPage from "./pages/archive/ArchiveChapter.tsx";
import Reader from "./pages/archive/Reader.tsx";
import { EntrusteePage } from "./pages/trustees/Trustees.tsx";
import { TrusteeHome } from "./pages/trustees/TrusteeList.tsx";
import { ArchiveEntrusteePage } from "./pages/archive/ArchiveTrustees.tsx";

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
            <Route path="/login" element={<Login />} />
            <Route index path="/signup" element={<Signup />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<HomePageLayout />}>
              <Route path="diary" element={<DiaryPage />} />
              <Route path="diary/:diaryId/draw" element={<Drawing />} />
              <Route path="diary/:diaryId/chapter" element={<ChapterPage />} />
              <Route
                path="/diary/:diaryId/entrustees"
                element={<EntrusteePage />}
              />

              <Route index path="/" element={<Homepage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="trustees" element={<TrusteeHome />} />
              <Route path="archive" element={<ArchivePage />} />

              <Route
                path="archive/:archiveDiaryId/chapter"
                element={<ArchiveChapterPage />}
              />
              <Route
                path="archive/:archiveDiaryId/chapter/:archiveChapterId"
                element={<Reader />}
              />

              <Route
                path="archive/:diaryId/entrustees"
                element={<ArchiveEntrusteePage />}
              />

              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route
              path="diary/:diaryId/chapter/:chapterId/"
              element={<EditorPageLayout />}
            >
              <Route path="write-session" element={<Editor />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
