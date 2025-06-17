import React, { useState } from "react";

export const ProfilePage = () => {
  const [bio, setBio] = useState(false);
  const user = localStorage.getItem("user");
  if (!user) return;
  const username = JSON.parse(user).username
    ? JSON.parse(user).username
    : "Guest";

  function handleEdit() {
    if (bio) {
      handleUpdateProfileBio();
    }
    setBio(!bio);
  }
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-1/3 h-full flex flex-col">
        <h1 className="my-8 text-4xl font-bold text-center">{username}</h1>
        <div className="w-40 h-40 bg-gray-300 rounded-full self-center" />
        <h2 className="mt-6">About You</h2>
        <textarea
          disabled={bio}
          className="border-2 border-black h-52 my-4"
        ></textarea>
        <button onClick={handleEdit} className="btn-writeUI">
          Edit
        </button>
      </div>
    </div>
  );
};
