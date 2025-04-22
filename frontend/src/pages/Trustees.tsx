import React, { useEffect, useState } from "react";
import { fetchDiary } from "../util/diary.ts";
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
  const [entry, setEntry] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchCompiledDiaryData(diaryURL: string) {
      try {
        const response = await fetchDiary(diaryURL);
        setEntry(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompiledDiaryData(diaryURL);
    console.log(entry[0]);
  }, [refresh]);
  return (
    <div className="min-h-screen">
      <div className="my-10 mx-10 flex flex-row w-full h-full">
        <div>
          <h1 className="text-xl font-bold text-center mb-5">
            {entry[0].title}
          </h1>
          <img
            src={entry[0].cover}
            alt="thebiggay"
            style={{ width: 300, height: 460 }}
          />
        </div>
        <div className="ml-10">
          <h1 className="text-2xl font-bold">Add your Trustees</h1>
        </div>
      </div>
    </div>
  );
};
