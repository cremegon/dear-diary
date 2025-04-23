import React, { useEffect, useState } from "react";
import { fetchDiary, finishDiary } from "../util/diary.ts";
import { useParams } from "react-router-dom";

interface DiaryEntry {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
  completed_at: Date;
  url: string;
  cover: string;
}

export const EntrusteePage = () => {
  const diaryURL = useParams().diaryId as string;
  const [userData, setUserData] = useState([
    { diaryId: diaryURL, name: "", email: "", address: "", phone: 0 },
  ]);
  const [entry, setEntry] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  function handleAddTrustee() {
    setUserData((prev) => [
      ...prev,
      { diaryId: diaryURL, name: "", email: "", address: "", phone: 0 },
    ]);
  }

  useEffect(() => {
    async function fetchCompiledDiaryData(diaryURL: string) {
      try {
        const response = await fetchDiary(diaryURL);
        setEntry(response.data);
        console.log(entry, response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompiledDiaryData(diaryURL);
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
        className={`${loading || error ? "hidden" : "block"} my-10 mx-10 flex flex-row w-full h-full`}
      >
        <div>
          <h1 className="text-xl font-bold text-center mb-5">
            {entry && entry.length > 0 ? entry[0].title : "Loading..."}
          </h1>
          {entry && entry.length > 0 ? (
            <img
              src={entry[0].cover}
              alt="thebiggay"
              style={{ width: 300, height: 460 }}
            />
          ) : (
            <div
              style={{ width: 300, height: 460, backgroundColor: "salmon" }}
            />
          )}
        </div>

        <div className="ml-10">
          <h1 className="text-2xl font-bold">Add your Trustees</h1>
          {userData
            ? userData.map((item, idx) => (
                <div className="flex flex-col justify-evenly" key={idx}>
                  <h1 className="mt-4 text-xl">{`Trustee ${idx + 1}`}</h1>
                  <input
                    className="border-pink-400 border-4 mt-4"
                    type="text"
                    placeholder="enter entrustee name"
                  />
                  <input
                    className="border-pink-400 border-4 mt-4"
                    type="text"
                    placeholder="enter email"
                  />
                  <input
                    className="border-pink-400 border-4 mt-4"
                    type="text"
                    placeholder="enter entrustee address"
                  />
                  <input
                    className="border-pink-400 border-4 mt-4"
                    type="tel"
                    placeholder="enter entrustee phone number"
                  />
                </div>
              ))
            : "nothing"}
          <div className="flex flex-row justify-between mt-6">
            <button
              className="btn-writeUI"
              onClick={() => finishDiary(diaryURL)}
            >
              Finish
            </button>
            <button className="btn-writeUI" onClick={handleAddTrustee}>
              Add Entrustee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
