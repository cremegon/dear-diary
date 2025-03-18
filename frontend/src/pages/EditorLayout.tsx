import React from "react";

import { Outlet } from "react-router-dom";

export const EditorPageLayout = () => {
  return (
    <div className="min-h-screen justify-center items-center my-20">
      <Outlet />
    </div>
  );
};
export default EditorPageLayout;
