import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { checkDiary, handleDiary } from "../util/diary.ts";

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
  const [title, setTitle] = useState("");
  const location = useLocation();

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

  const refreshHandle = async (e: React.FormEvent) => {
    await handleDiary(e, title);
    checkAndRender();
  };

  useEffect(() => {
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
                <div className="bg-lime-400 w-20 h-20 flex items-center justify-center">
                  <Link to={`${item.url}/draw`}>
                    <div className="bg-slate-800 rounded-full w-8 h-8" />
                  </Link>
                </div>
              </ul>
            ))
          : "nothing..."}
      </h2>
      <form action="post" onSubmit={(e) => refreshHandle(e)}>
        <input
          type="text"
          value={title}
          placeholder="Add your Title"
          onChange={(e) => setTitle(e.target.value)}
          className="border-pink-400 border-4"
        />
        <button type="submit" className="btn-writeUI">
          {" "}
          New Diary
        </button>
      </form>
    </div>
  );
};

export default DiaryPage;
