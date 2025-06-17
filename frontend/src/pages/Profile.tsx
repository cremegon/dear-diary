import React, { useEffect, useRef, useState } from "react";
import { fetchProfileBio, updateProfileBio } from "../util/diary.ts";

export const ProfilePage = () => {
  const bioBox = useRef<HTMLTextAreaElement>(null);
  const user = localStorage.getItem("user");
  const [edit, setEdit] = useState(false);
  const [bio, setBio] = useState("");
  const [username] = useState(
    user && JSON.parse(user).username ? JSON.parse(user).username : "Guest"
  );

  function handleEdit() {
    if (edit) {
      console.log("sending this bio =>", bio);
      updateProfileBio(bio);
    }
    setEdit(!edit);
  }

  useEffect(() => {
    async function fetchBio() {
      const response = await fetchProfileBio();
      if (!response) return;
      if (!bioBox.current) return;
      setBio(response.data);
      bioBox.current.textContent = bio;
    }
    fetchBio();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-1/3 h-full flex flex-col">
        <h1 className="my-8 text-4xl font-bold text-center">{username}</h1>
        <div className="w-40 h-40 bg-gray-300 rounded-full self-center" />
        <h2 className="mt-6">About You</h2>
        <textarea
          ref={bioBox}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
