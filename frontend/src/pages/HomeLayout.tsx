import React from "react";
import Navbar from "../components/Navbar.tsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.tsx";

export const HomePageLayout = () => {
  return (
    <>
      <Navbar />

      <div className="w-full h-auto">
        <Outlet />
      </div>

      {/* <Footer /> */}
    </>
  );
};
export default HomePageLayout;
