import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { checkDiary } from "../util/diary.ts";

interface DiaryEntry {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
  url: string;
}

export const DiaryPage = () => {
  const [entry, setEntry] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    async function checkAndRender() {
      try {
        const response = await checkDiary();
        setEntry(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    if (location.pathname === "/diary") checkAndRender();
  }, [location.pathname]);

  if (location.pathname === "/diary" && loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (location.pathname === "/diary" && error)
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
                <Link to={`${item.url}/chapter`}>
                  <li>{item.title}</li>
                </Link>

                <li>{new Date(item.created_at).toLocaleDateString()}</li>
              </ul>
            ))
          : "nothing..."}
      </h2>
      <Link to="1/chapter">Chapter View!</Link>
    </div>
  );
};

export default DiaryPage;
