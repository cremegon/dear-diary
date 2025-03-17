import React from "react";
import { Link, Outlet } from "react-router-dom";

export const ChapterPage = () => {
  return (
    <div className="h-screen">
      <Outlet />
      <h1 className="text-4xl">Write Your Chapters</h1>
      <Link to="1/write-session">Write NOW!</Link>
    </div>
  );
};

export default ChapterPage;
