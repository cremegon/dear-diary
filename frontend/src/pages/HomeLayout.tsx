import React from "react";
import Navbar from "../components/Navbar.tsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.tsx";

export const HomePageLayout = () => {
  return (
    <div>
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
};
export default HomePageLayout;
