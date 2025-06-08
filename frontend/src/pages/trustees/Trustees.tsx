import React, { useEffect, useState } from "react";
import {
  fetchDiary,
  fetchUniqueTrustees,
  finishDiary,
  verifyTrusteesList,
} from "../../util/diary.ts";
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

interface TrusteeTemplate {
  diaryId: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface TrusteeEntry {
  id: number;
  diary_id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export const EntrusteePage = () => {
  const diaryURL = useParams().diaryId as string;
  const [trustees, setTrustees] = useState<TrusteeTemplate[]>([]);
  const [m_trustees, set_m_Trustees] = useState<TrusteeTemplate[]>([]);
  const [easyAddTrustee, setEasyAddTrustee] = useState(false);
  const [easyTrusteeData, setEasyTrusteeData] = useState<TrusteeEntry[]>([]);
  const [entry, setEntry] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleAddTrustee() {
    if (easyAddTrustee) setEasyAddTrustee(false);
    if (
      m_trustees &&
      m_trustees.length > 0 &&
      m_trustees[m_trustees.length - 1].name
    ) {
      console.log("yes m_trustees");
      set_m_Trustees((prev) => [
        ...prev,
        { diaryId: diaryURL, name: "", email: "", address: "", phone: "" },
      ]);
    } else {
      console.log("NO m_trustees");
      set_m_Trustees([
        { diaryId: diaryURL, name: "", email: "", address: "", phone: "" },
      ]);
    }
    console.log(m_trustees);
  }

  function handleEasyAddTrustee(diaryURL: string, val: string) {
    const value = val.split(",");
    setTrustees((prev) => [
      ...prev,
      {
        diaryId: diaryURL,
        name: value[0],
        email: value[1],
        address: value[2],
        phone: value[3],
      },
    ]);
    console.log(trustees, val.split(","));
  }

  function handleRemoveTrustee(idx: number) {
    const change = [...trustees.slice(0, idx), ...trustees.slice(idx + 1)];
    setTrustees(change);
    console.log(change);
  }

  function handleEntrusteeDetails(value: string, id: string, i: number) {
    const plus_index = id.indexOf("+");
    const newId = id.slice(0, plus_index);
    const updatedItem = m_trustees.map((item, idx) => {
      if (idx === i) {
        return { ...item, [newId]: value };
      }
      return item;
    });

    set_m_Trustees(updatedItem);
    console.log(m_trustees);
  }

  function handleFinishDiary(diaryURL: string, trustees: object[]) {
    const { valid, error_t, error_index, error_field } =
      verifyTrusteesList(m_trustees);
    console.log("error from trustee entry => ", valid, error_t);
    if (error_t) {
      setError(error_t);
      const errorField = document.getElementById(
        `${error_field}+${error_index}`
      );
      if (errorField) {
        errorField.style.borderColor = "red";
      }
      console.log("what we got", `${error_field}+${error_index}`);
      console.log("what it is", `name+${error_index}`);
      return;
    }
    finishDiary(diaryURL, trustees);
    if (!valid) return error;
  }

  useEffect(() => {
    async function fetchCompiledDiaryData(diaryURL: string) {
      try {
        const response = await fetchDiary(diaryURL);
        const unique_trustees = await fetchUniqueTrustees();
        setEntry(response.data);
        setEasyTrusteeData(unique_trustees.trustees);
        console.log(trustees[0]);
        console.log(entry, response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompiledDiaryData(diaryURL);
  }, [loading]);

  return (
    <div className="min-h-screen">
      {/* <div
        className={`top-1/2 left-1/2 bg-yellow-300 ${error ? "block" : "hidden"} absolute`}
      >
        Any Error Occured...
      </div> */}

      <div
        className={`top-1/2 left-1/2 bg-yellow-300 ${loading && !error ? "block" : "hidden"} absolute`}
      >
        Loading...
      </div>

      <div
        className={`${loading ? "hidden" : "block"} my-10 mx-10 flex flex-row w-full h-full`}
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
          <div
            className={`${error ? "block" : "hidden"} text-red-500 bg-red-300 my-4 p-4`}
          >
            {error}
          </div>
          <h1 className="text-2xl font-bold">Add your Trustees</h1>

          <div
            onClick={() => setEasyAddTrustee(!easyAddTrustee)}
            className="text-sm text-blue-600 cursor-pointer"
          >
            {!easyAddTrustee ? "Add from existing trustees" : "Add new trustee"}
          </div>

          <div className={`mt-4 flex flex-row bg-pink-200 w-full h-min`}>
            {trustees.length > 0 && trustees[trustees.length - 1].name
              ? trustees.map((person, idx) => (
                  <div
                    className={`${person.name ? "block" : "hidden"} ml-2 w-auto h-7 p-2 text-sm border-2 border-pink-600 bg-pink-400 items-center justify-center flex`}
                    key={idx}
                  >
                    {person.name}
                  </div>
                ))
              : null}
          </div>

          <div className={`${easyAddTrustee ? "block" : "hidden"}`}>
            <select
              className="mt-4 w-full"
              onChange={(e) => handleEasyAddTrustee(diaryURL, e.target.value)}
            >
              {easyTrusteeData && easyTrusteeData.length > 0
                ? easyTrusteeData.map((item, idx) => (
                    <option
                      value={[item.name, item.email, item.address, item.phone]}
                      key={idx}
                    >
                      {item.name}
                    </option>
                  ))
                : null}
            </select>
          </div>

          <div className={`${!easyAddTrustee ? "block" : "hidden"}`}>
            {m_trustees
              ? m_trustees.map((item, idx) => (
                  <div className="mt-4 flex flex-col justify-evenly" key={idx}>
                    <div className="flex flex-row justify-between align-bottom">
                      <div>{idx}</div>
                      <h1 className="text-xl">{`Trustee # ${idx + 1}`}</h1>
                      <button
                        className="bg-red-600 text-white w-20"
                        onClick={() => handleRemoveTrustee(idx)}
                      >
                        delete
                      </button>
                    </div>
                    <input
                      className="border-pink-400 border-4 mt-4"
                      type="text"
                      placeholder="enter entrustee name"
                      id={`name+${idx}`}
                      value={m_trustees[idx]["name"]}
                      onChange={(e) =>
                        handleEntrusteeDetails(e.target.value, e.target.id, idx)
                      }
                    />
                    <input
                      className="border-pink-400 border-4 mt-4"
                      type="text"
                      placeholder="enter email"
                      id={`email+${idx}`}
                      value={m_trustees[idx]["email"]}
                      onChange={(e) =>
                        handleEntrusteeDetails(e.target.value, e.target.id, idx)
                      }
                    />
                    <input
                      className="border-pink-400 border-4 mt-4"
                      type="text"
                      placeholder="enter entrustee address"
                      id={`address+${idx}`}
                      value={m_trustees[idx]["address"]}
                      onChange={(e) =>
                        handleEntrusteeDetails(e.target.value, e.target.id, idx)
                      }
                    />
                    <input
                      className="border-pink-400 border-4 mt-4"
                      type="text"
                      placeholder="enter entrustee phone number"
                      id={`phone+${idx}`}
                      value={m_trustees[idx]["phone"]}
                      onChange={(e) =>
                        handleEntrusteeDetails(e.target.value, e.target.id, idx)
                      }
                    />
                  </div>
                ))
              : "nothing"}
          </div>

          <div className="flex flex-row justify-between mt-6">
            <button
              className="btn-writeUI"
              onClick={() =>
                handleFinishDiary(diaryURL, [...trustees, ...m_trustees])
              }
            >
              Finish
            </button>
            <button className="btn-writeUI" onClick={handleAddTrustee}>
              New Entrustee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
