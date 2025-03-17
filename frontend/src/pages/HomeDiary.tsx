import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { checkDiary } from "../util/diary.ts";

export const DiaryPage = () => {
  const [entry, setEntry] = useState([]);

  useEffect(() => {
    async function checkAndRender() {
      try {
        const response = await checkDiary();
        console.log(response.data);
        setEntry(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    checkAndRender();
  }, []);

  return (
    <div className="h-screen">
      <Outlet />
      <h1 className="text-4xl">Write Your Diary</h1>
      <h2 className="text-4xl text-yellow-500">{entry[1].title}</h2>
      <Link to="chapter">Chapter View!</Link>
    </div>
  );
};

export default DiaryPage;
