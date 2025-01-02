import React, { createContext, useState, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

interface AuthContextType {
  auth: boolean;
  setAuth: (token: boolean) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const [auth, setAuth] = useState<boolean>(() => {
    return user ? JSON.parse(user).isAuthenticated === true : false;
  });

  useEffect(() => {
    const verifyToken = async () => {
      const response = await fetch("http://localhost:5000/verify", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setAuth(false);
        console.log(data.message);
      } else {
        console.log(data.message);
        if (user) {
          const parsedUser = JSON.parse(user);
          parsedUser.loggedIn = true;
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
        navigate("/", { replace: true });
      }
    };

    if (
      auth &&
      user &&
      JSON.parse(user).isAuthenticated === true &&
      JSON.parse(user).loggedIn === false
    ) {
      console.log("authenticating...");
      verifyToken();
    } else {
      return;
    }
  }, [auth, navigate, user]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used wihitin an AuthProvider");
  }
  return context;
};