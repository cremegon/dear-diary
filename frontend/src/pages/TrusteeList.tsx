import React, { useEffect, useState } from "react";
import { fetchEntrustees } from "../util/diary.ts";

interface Trustees {
  id: number;
  diary_id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface DiaryEntry {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
  completed_at: Date;
  url: string;
  cover: string;
}

export const TrusteeHome = () => {
  const [diaries, setDiaries] = useState([]);
  const [trusteesList, setTrusteesList] = useState<Trustees[]>([]);
  const [diariesToTrustees, setDiariesToTrustees] = useState<{
    [key: number]: DiaryEntry[];
  }>([]);

  async function fetchTrusteeData() {
    const response = await fetchEntrustees();
    if (!response) return "error from backend finding entrustees...";
    setTrusteesList(response.data);
    setDiariesToTrustees(response.diaries);
    console.log(response.diaries);
  }

  useEffect(() => {
    fetchTrusteeData();
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-col items-center mt-6 mb-14">
      <h1 className="text-4xl font-extrabold my-6">My Trustees</h1>
      {trusteesList && trusteesList.length > 0
        ? trusteesList.map((person) => (
            <div
              key={person.id}
              className="flex flex-col w-1/2 items-start border-pink-500 border-4 my-2 p-4"
            >
              <div className="text-xl font-bold">{person.name}</div>
              <div className="">{person.email}</div>
              <div className="">{person.address}</div>
              <div className="">{person.phone}</div>
              {diariesToTrustees[person.diary_id] &&
              diariesToTrustees[person.diary_id].length > 0
                ? diariesToTrustees[person.diary_id].map((related) => (
                    <div key={related.id} className="flex flex-row">
                      <div>{related.title}</div>
                    </div>
                  ))
                : "no trustees found..."}
            </div>
          ))
        : null}
    </div>
  );
};

export default TrusteeHome;
