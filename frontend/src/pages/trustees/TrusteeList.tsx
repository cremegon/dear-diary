import React, { useEffect, useState } from "react";
import { fetchEntrustees } from "../../util/diary.ts";
import { Link } from "react-router-dom";
import { handleLogout } from "../../util/client.ts";
import { useAuth } from "../../context/contextProvider.tsx";

interface Trustees {
  id: number;
  diary_id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export const TrusteeHome = () => {
  const { setAuth } = useAuth();
  const [trusteesList, setTrusteesList] = useState<Trustees[]>([]);
  const [diariesToTrustees, setDiariesToTrustees] = useState<{
    [key: number]: string[];
  }>([]);
  const [linkToDiaries, setLinkeToDiaries] = useState<{
    [key: string]: string | null;
  }>();

  async function fetchTrusteeData() {
    const response = await fetchEntrustees();
    if (!response) return handleLogout(setAuth);
    setTrusteesList(response.trustees);
    setDiariesToTrustees(response.diaries);
    setLinkeToDiaries(response.urls);
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
              <ul className="flex flex-row">
                {diariesToTrustees[person.name] &&
                diariesToTrustees[person.name].length > 0
                  ? diariesToTrustees[person.name].map(
                      (related: string, idx: number) => (
                        <div
                          key={idx}
                          className={`flex flex-row text-blue-500 ${idx > 0 ? "ml-2" : null}`}
                        >
                          <li className={`${idx > 0 ? "block" : "hidden"}`}>
                            |
                          </li>
                          <li className={`${idx > 0 ? "ml-2" : null}`}>
                            <Link
                              to={
                                linkToDiaries
                                  ? `/archive/${linkToDiaries[related]}/chapter`
                                  : ""
                              }
                            >
                              {related}
                            </Link>
                          </li>
                        </div>
                      )
                    )
                  : "no trustees found..."}
              </ul>
            </div>
          ))
        : null}
    </div>
  );
};

export default TrusteeHome;
