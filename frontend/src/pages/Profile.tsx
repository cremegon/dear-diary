import React, { useEffect, useState } from "react";
import { fetchProfileBio, updateProfileBio } from "../util/diary.ts";

export const ProfilePage = () => {
  let username = "";
  const [edit, setEdit] = useState(false);
  const [bio, setBio] = useState("");
  const user = localStorage.getItem("user");
  if (user) {
    username = JSON.parse(user).username ? JSON.parse(user).username : "Guest";
  } else {
    username = "Guest";
  }

  function handleEdit() {
    if (edit) {
      console.log("sending this bio =>", bio);
      updateProfileBio(bio);
    }
    setEdit(!edit);
  }

  function handleChange(e) {
    setBio(e.target.value);
    console.log(e.target.value);
  }

  useEffect(() => {
    async function fetchBio() {
      const response = await fetchProfileBio();
      if (!response) return;
      setBio(response.data);
    }
    fetchBio();
  }, [bio]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-1/3 h-full flex flex-col">
        <h1 className="my-8 text-4xl font-bold text-center">{username}</h1>
        <div className="w-40 h-40 bg-gray-300 rounded-full self-center" />
        <h2 className="mt-6">About You</h2>
        <textarea
          onChange={(e) => handleChange(e)}
          disabled={!edit}
          className="border-2 border-black h-52 my-4"
        ></textarea>
        <button onClick={handleEdit} className="btn-writeUI">
          {!edit ? "Update" : "Confirm"}
        </button>
      </div>
    </div>
  );
};
