import React from "react";
import { Link, Outlet } from "react-router-dom";

export const DiaryPage = () => {
  return (
    <div className="h-screen">
      <Outlet />
      <h1 className="text-4xl">Write Your Diary</h1>
      <Link to="chapter">Chapter View!</Link>
    </div>
  );
};

export default DiaryPage;
