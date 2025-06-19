import React, { useEffect, useRef, useState } from "react";
import {
  fetchProfileBio,
  updateProfileBio,
  uploadProfilePic,
} from "../util/diary.ts";

export const ProfilePage = () => {
  const bioBox = useRef<HTMLTextAreaElement>(null);
  const user = localStorage.getItem("user");
  const [image, setImage] = useState("");
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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const response = await uploadProfilePic(file);
      if (!response) return;
      setImage(response.data);
    }
  }

  useEffect(() => {
    async function fetchBio() {
      const response = await fetchProfileBio();
      if (!response) return;
      if (!bioBox.current) return;
      console.log(response.data);
      setBio(response.data.bio);
      setImage(response.data.profile_dp);
      bioBox.current.textContent = bio;
    }
    fetchBio();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-1/3 h-full flex flex-col">
        <h1 className="my-8 text-4xl font-bold text-center">{username}</h1>
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="w-40 h-40 rounded-full self-center"
          />
        ) : (
          <div className="w-40 h-40 bg-gray-300 rounded-full self-center" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e)}
        />

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
