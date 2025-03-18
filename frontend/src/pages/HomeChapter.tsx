import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import { checkChapter, handleChapter } from "../util/diary.ts";

interface ChapterEntry {
  id: number;
  diary_id: number;
  title: string;
  created_at: Date;
  content: string;
  font_family: string;
  font_size: number;
  url: string;
}

export const ChapterPage = () => {
  const [entry, setEntry] = useState<ChapterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const navigate = useNavigate();
  const params = useParams().diaryId as string;

  useEffect(() => {
    async function checkAndRender() {
      try {
        const response = await checkChapter(params);
        setEntry(response.data);
        console.log("RESPONSES", response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    if (params) checkAndRender();
  }, [params]);

  async function createChapter(e: React.FormEvent) {
    const data = await handleChapter(e);
    console.log(data);
    if (!data) return;

    navigate(data.redirect);
  }

  if (location.pathname === `${params}/chapter` && loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (location.pathname === `${params}/chapter` && error)
    return (
      <div className="h-screen flex justify-center items-center">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="h-screen">
      <Outlet />
      <h1 className="text-4xl">Write Your Chapters</h1>
      <h2 className="text-4xl text-yellow-500">
        {entry
          ? entry.map((item) => (
              <ul key={item.id} className="flex flex-row justify-evenly">
                <Link to={`${item.url}/write-session`}>
                  <li>{item.title}</li>
                </Link>

                <li>{new Date(item.created_at).toLocaleDateString()}</li>
              </ul>
            ))
          : "nothing..."}
      </h2>
      <form action="post" onSubmit={(e) => createChapter(e)}>
        <button type="submit" className="btn-writeUI">
          {" "}
          New Chapter
        </button>
      </form>
    </div>
  );
};

export default ChapterPage;
