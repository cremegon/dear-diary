import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from ".././layouts/HomeLayout.tsx";

export const EditorPageLayout = () => {
  return (
    <div>
      <div className="h-40 bg-pink-500" />

      <Outlet />
    </div>
  );
};
export default EditorPageLayout;
