import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchArchives } from "../util/diary.ts";

interface DiaryEntry {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
  completed_at: Date;
  url: string;
  cover: string;
}

export const ArchivePage = () => {
  const [entry, setEntry] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchArchivedData() {
    try {
      const response = await fetchArchives();
      setEntry(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  // ---- Load in Available Diary Entries
  useEffect(() => {
    fetchArchivedData();
  }, [loading]);

  return (
    <div className="min-h-screen">
      <div
        className={`top-1/2 left-1/2 bg-yellow-300 ${error ? "block" : "hidden"} absolute`}
      >
        Any Error Occured...
      </div>

      <div
        className={`top-1/2 left-1/2 bg-yellow-300 ${loading && !error ? "block" : "hidden"} absolute`}
      >
        Loading...
      </div>

      <div
        className={`w-full h-full flex-col ${loading || error ? "hidden" : "block"}`}
      >
        <h1 className="text-4xl mb-10">Read Your Archived Diary</h1>
        <h2 className="text-4xl text-yellow-500">
          {entry
            ? entry.map((item) => (
                <ul
                  key={item.id}
                  className="flex flex-row justify-evenly items-center"
                >
                  <div
                    className={`${item.cover ? "block" : "hidden"}  border-black border-8`}
                  >
                    <img
                      src={item.cover}
                      width={100}
                      height={150}
                      alt="thebiggay"
                    />
                  </div>
                  <Link to={`${item.url}/chapter`}>
                    <li>{item.title}</li>
                  </Link>
                </ul>
              ))
            : "nothing..."}
        </h2>
      </div>
    </div>
  );
};

export default ArchivePage;
