import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { checkChapter, deleteChapter, handleChapter } from "../util/diary.ts";
import { testEmail } from "../util/client.ts";

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

  const navigate = useNavigate();
  const params = useParams().diaryId as string;

  async function fetchChapterData() {
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

  async function createChapter(e: React.FormEvent, params: string) {
    console.log("frontend chapter params", params);
    const data = await handleChapter(e, params);
    console.log(data);
    if (!data) return;

    navigate(data.redirect);
  }

  async function handleDelete(e: React.MouseEvent, diaryId: string) {
    await deleteChapter(e, diaryId);
    console.log("frontend chapter delete");
    fetchChapterData();
  }

  // ---- Load in Available Chapter Entries
  useEffect(() => {
    if (params) fetchChapterData();
  }, [params]);

  return (
    <div className={`w-full h-full min-h-screen flex flex-col`}>
      <div
        className={`top-1/2 left-1/2 bg-yellow-300 ${error ? "block" : "hidden"} absolute`}
      >
        An Error Occured...
      </div>
      <div
        className={`top-1/2 left-1/2 bg-yellow-300 ${loading && !error ? "block" : "hidden"} absolute`}
      >
        Loading...
      </div>
      <div
        className={`w-full h-full flex-col flex-1 ${loading || error ? "hidden" : "block"}`}
      >
        <h1 className="text-4xl">Write Your Chapters</h1>
        <h2 className="text-4xl text-yellow-500">
          {entry
            ? entry.map((item) => (
                <ul key={item.id} className="flex flex-row justify-evenly">
                  <Link to={`${item.url}/write-session?create=false`}>
                    <li>{`chapter-${item.title}`}</li>
                  </Link>
                  <li>{new Date(item.created_at).toLocaleDateString()}</li>
                  <button
                    onClick={(e) => handleDelete(e, item.url)}
                    className="bg-black"
                  >
                    Delete
                  </button>
                </ul>
              ))
            : "nothing..."}
        </h2>
        <div className="flex flex-row justify-evenly">
          <form action="post" onSubmit={(e) => createChapter(e, params)}>
            <button type="submit" className="btn-writeUI">
              New Chapter
            </button>
          </form>

          <button onClick={() => testEmail()} className="btn-writeUI">
            Test Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
