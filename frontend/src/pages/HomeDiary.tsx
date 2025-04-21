import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  checkDiary,
  deleteDiary,
  finishDiary,
  handleDiary,
} from "../util/diary.ts";

interface DiaryEntry {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
  completed_at: Date;
  url: string;
  cover: string;
}

export const DiaryPage = () => {
  const [entry, setEntry] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [refresh, setRefresh] = useState(true);

  async function fetchDiaryData() {
    try {
      const response = await checkDiary();
      setEntry(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e: React.MouseEvent, diaryId: string) {
    await deleteDiary(e, diaryId);
    console.log("frontend diary delete");
    setRefresh(!refresh);
  }

  async function handleFinishDiary(URL: string) {
    await finishDiary(URL);
    setEntry([]);
    setRefresh(!refresh);
  }

  async function refreshCreateDiary(e: React.FormEvent) {
    await handleDiary(e, title);
    console.log("created new diary");
    setRefresh(!refresh);
  }

  // ---- Load in Available Diary Entries
  useEffect(() => {
    fetchDiaryData();
    console.log("refreshed!");
  }, [loading, refresh]);

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
        <h1 className="text-4xl mb-10">Write Your Diary</h1>
        <h2 className="text-4xl text-yellow-500">
          {entry
            ? entry.map((item) => (
                <ul
                  key={item.id}
                  className="flex flex-row justify-evenly items-center"
                >
                  <div
                    className={`${item.cover ? "block" : "hidden"} border-black border-8`}
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

                  <div className="bg-lime-400 w-20 h-20 flex items-center justify-center">
                    <Link
                      to={`${item.url}/draw?edit=${item.cover ? "true" : "false"}`}
                    >
                      <div className="bg-slate-800 rounded-full w-8 h-8" />
                    </Link>
                  </div>

                  <button
                    onClick={() => handleFinishDiary(item.url)}
                    className="bg-black w-40 h-20 text-lg font-bold"
                  >
                    Conclude Diary
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, item.url)}
                    className=" text-black bg-red-600 w-28 h-20 text-lg font-bold"
                  >
                    Delete
                  </button>
                </ul>
              ))
            : "nothing..."}
        </h2>

        <div className={`${entry.length > 0 ? "hidden" : "block"}`}>
          <form action="post" onSubmit={(e) => refreshCreateDiary(e)}>
            <input
              type="text"
              value={title}
              placeholder="Add your Title"
              onChange={(e) => setTitle(e.target.value)}
              className="border-pink-400 border-4"
            />
            <button type="submit" className="btn-writeUI">
              New Diary
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
