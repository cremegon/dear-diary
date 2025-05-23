import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from ".././layouts/HomeLayout.tsx";

export const EditorPageLayout = () => {
  return (
    <div>
      <Navbar />

      <Outlet />
    </div>
  );
};
export default EditorPageLayout;
