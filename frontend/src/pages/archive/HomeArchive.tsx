import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchArchives } from "../../util/diary.ts";
import { useAuth } from "../../context/contextProvider.tsx";
import { handleLogout } from "../../util/client.ts";

interface DiaryEntry {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
  completed_at: Date;
  url: string;
  cover: string;
}

interface TrusteeEntry {
  id: number;
  diary_id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export const ArchivePage = () => {
  const { setAuth } = useAuth();
  const [entry, setEntry] = useState<DiaryEntry[]>([]);
  const [trusted, setTrusted] = useState<{ [key: number]: TrusteeEntry[] }>([]);
  const [loading, setLoading] = useState(true);
  const [addHover, setAddHover] = useState([false, 0]);
  const [error, setError] = useState("");

  // ---- Load in Available Diary Entries
  useEffect(() => {
    async function fetchArchivedData() {
      try {
        const response = await fetchArchives();
        if (!response) return handleLogout(setAuth);
        setEntry(response.data);
        setTrusted(response.entrusted);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
      console.log(trusted);
    }
    fetchArchivedData();
  }, [loading]);

  return (
    <div className="min-h-screen">
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
        className={`w-full h-full flex flex-col items-center  ${loading || error ? "hidden" : "block"}`}
      >
        <h1 className="text-4xl my-10 font-bold">Read Your Archived Diary</h1>
        <div className=" mb-10 w-1/2 text-4xl text-yellow-500">
          {entry
            ? entry.map((item, idx) => (
                <ul key={item.id} className="flex flex-col w-full">
                  <div className="flex flex-row justify-start items-center">
                    <div className={`${item.cover ? "block" : "hidden"}`}>
                      <img
                        src={item.cover}
                        width={100}
                        height={150}
                        alt="thebiggay"
                      />
                    </div>
                    <div className="flex flex-col ml-10">
                      <Link to={`${item.url}/chapter`}>
                        <li>{item.title}</li>
                      </Link>
                      <div className="mt-4 flex flex-wrap w-2/3">
                        <div className="text-sm">Entrusted to:</div>
                        {trusted[item.id] && trusted[item.id].length > 0 ? (
                          trusted[item.id].map((person) => (
                            <div
                              key={person.id}
                              className="text-sm text-green-400 ml-2"
                            >
                              {person.name}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 ml-2">none</div>
                        )}
                        <div
                          onMouseEnter={() => setAddHover([true, idx])}
                          onMouseLeave={() => setAddHover([false, idx])}
                          className={`${addHover[0] && addHover[1] === idx ? "w-20" : "w-5"} h-5 ml-2 bg-pink-300 rounded-xl overflow-auto`}
                        >
                          {addHover[0] && addHover[1] === idx ? (
                            <Link to={`${item.url}/entrustees`}>
                              <p className="ml-2 text-sm text-white">Add New</p>
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </ul>
              ))
            : "nothing..."}
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;
