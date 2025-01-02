import React from "react";
import { useAuth } from "./contextProvider.tsx";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to={"/login"} />;
  }
  return <Outlet />;
};

export const PublicRoute = () => {
  const { auth } = useAuth();

  if (auth) {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};
