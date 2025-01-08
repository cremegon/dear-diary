import React, { useEffect } from "react";
import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup.tsx";
import { AuthProvider } from "./util/contextProvider.tsx";
import { Homepage } from "./pages/Homepage.tsx";
import { Login } from "./pages/Login.tsx";
import { ProtectedRoute, PublicRoute } from "./util/RouteAuth.tsx";

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
            <Route path="/" element={<Homepage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
