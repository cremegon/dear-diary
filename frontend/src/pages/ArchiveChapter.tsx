import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { checkChapter } from "../util/diary.ts";

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

export const ArchiveChapterPage = () => {
  const [entry, setEntry] = useState<ChapterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useParams().archiveDiaryId as string;

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
        <h1 className="text-4xl">Read Your Chapters</h1>
        <h2 className="text-4xl text-yellow-500">
          {entry
            ? entry.map((item) => (
                <ul key={item.id} className="flex flex-row justify-evenly">
                  <Link to={`${item.url}`}>
                    <li>{`chapter-${item.title}`}</li>
                  </Link>
                  <li>{new Date(item.created_at).toLocaleDateString()}</li>
                </ul>
              ))
            : "nothing..."}
        </h2>
      </div>
    </div>
  );
};

export default ArchiveChapterPage;
