import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";

export const EditorPageLayout = () => {
  return (
    <div className="min-h-screen justify-center items-center">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default EditorPageLayout;
