import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkDiary, deleteDiary, handleDiary } from "../../util/diary.ts";
import { handleLogout } from "../../util/client.ts";
import { useAuth } from "../../context/contextProvider.tsx";

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
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [changeTitle, setChangeTitle] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [modal, setModal] = useState<[boolean, string]>([false, ""]);
  const [conclude, setConclude] = useState<[boolean, string]>([false, ""]);

  async function handleDelete(e: React.MouseEvent, diaryId: string) {
    console.log(diaryId);
    await deleteDiary(e, diaryId);
    console.log("frontend diary delete");
    setModal([false, ""]);
    setRefresh(!refresh);
  }

  async function handleFinishDiary(URL: string) {
    navigate(`${URL}/entrustees`);
  }

  async function refreshCreateDiary(e: React.FormEvent) {
    if (!title) {
      const titleNode = document.getElementById("title");
      if (titleNode) {
        titleNode.style.borderColor = "red";
      }
      return;
    }
    await handleDiary(e, title);
    console.log("created new diary");
    setRefresh(!refresh);
  }

  // ---- Load in Available Diary Entries
  useEffect(() => {
    async function fetchDiaryData() {
      try {
        const response = await checkDiary();
        if (!response) return handleLogout(setAuth);
        setEntry(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDiaryData();
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
        className={`relative w-full h-full flex-col ${loading || error ? "hidden" : "block"} ${modal[1] || conclude[1] ? "backdrop-blur-sm bg-white/30" : "bg-inherit"}`}
      >
        <div
          className={`${modal[1] ? "block" : "hidden"} absolute top-1/2 left-1/3 bg-pink-700 w-1/3 h-1/2 flex flex-col items-center justify-center`}
        >
          <h1 className="font-bold my-4 text-pink-100">
            Are you sure you want to delete this diary?
          </h1>
          <div className="flex flex-row">
            <button
              className="btn-writeUI"
              onClick={(e) => handleDelete(e, modal[1])}
            >
              Yes
            </button>
            <button
              className="btn-writeUI"
              onClick={() => setModal([false, ""])}
            >
              No
            </button>
          </div>
        </div>

        <div
          className={`${conclude[1] ? "block" : "hidden"} absolute top-1/2 left-1/3 bg-cyan-300 w-1/3 h-1/2 flex flex-col items-center justify-center`}
        >
          <h1 className="font-bold my-4 text-cyan-500">
            Are you sure you want to finish this diary?
          </h1>
          <div className="flex flex-row">
            <button
              className="btn-writeUI"
              onClick={() => handleFinishDiary(conclude[1])}
            >
              Yes
            </button>
            <button
              className="btn-writeUI"
              onClick={() => setConclude([false, ""])}
            >
              No
            </button>
          </div>
        </div>
        <h1 className="text-4xl mb-10">Write Your Diary</h1>
        <h2 className="text-4xl text-yellow-500">
          {entry && entry.length > 0
            ? entry.map((item) => (
                <ul
                  key={item.id}
                  className="flex flex-row justify-evenly items-center"
                >
                  <div className={`${item.cover ? "block" : "hidden"}`}>
                    <img
                      src={item.cover}
                      width={100}
                      height={150}
                      alt="thebiggay"
                    />
                  </div>
                  <Link to={`${item.url}/chapter`}>
                    <li className={`${!changeTitle ? "block" : "hidden"}`}>
                      {item.title}
                    </li>
                    <input
                      className={`${changeTitle ? "block" : "hidden"} border-4 w-1/2 p-0`}
                      placeholder={item.title}
                    />
                  </Link>

                  <button
                    onClick={() => setChangeTitle(!changeTitle)}
                    className="text-sm border-4 p-4 bg-blue-500 border-black text-blue-950"
                  >
                    Edit Diary Name
                  </button>

                  <div className="bg-lime-400 w-20 h-20 flex items-center justify-center">
                    <Link
                      to={`${item.url}/draw?edit=${item.cover ? "true" : "false"}`}
                    >
                      <div className="bg-slate-800 rounded-full w-8 h-8" />
                    </Link>
                  </div>

                  <button
                    onClick={() => setConclude([true, item.url])}
                    className="bg-black w-40 h-20 text-lg font-bold"
                  >
                    Conclude Diary
                  </button>

                  <button
                    onClick={() => setModal([true, item.url])}
                    className=" text-black bg-red-600 w-28 h-20 text-lg font-bold"
                  >
                    Delete
                  </button>
                </ul>
              ))
            : "nothing..."}
        </h2>

        <div className={`${entry && entry.length > 0 ? "hidden" : "block"}`}>
          <form action="post" onSubmit={(e) => refreshCreateDiary(e)}>
            <input
              type="text"
              value={title}
              id="title"
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
