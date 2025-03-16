import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { checkDiary } from "../util/diary.ts";

export const DiaryPage = () => {
  useEffect(() => {
    const response = checkDiary();
  }, []);

  return (
    <div className="h-screen">
      <Outlet />
      <h1 className="text-4xl">Write Your Diary</h1>

      <Link to="chapter">Chapter View!</Link>
    </div>
  );
};

export default DiaryPage;
