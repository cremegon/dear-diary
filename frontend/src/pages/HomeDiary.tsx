import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { checkDiary } from "../util/diary.ts";

export const DiaryPage = () => {
  const [entry, setEntry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    async function checkAndRender() {
      try {
        const response = await checkDiary();
        console.log(response.data);
        setEntry(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    if (location.pathname === "/diary") checkAndRender();
  }, [location.pathname]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex justify-center items-center">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="h-screen">
      <Outlet />
      <h1 className="text-4xl">Write Your Diary</h1>
      <h2 className="text-4xl text-yellow-500">
        {entry
          ? entry.map((item) => (
              <ul key={item.id} className="flex flex-row justify-evenly">
                <li>{item.title}</li>
                <li>{item.created_at}</li>
              </ul>
            ))
          : "nothing..."}
      </h2>
      <Link to="chapter">Chapter View!</Link>
    </div>
  );
};

export default DiaryPage;
