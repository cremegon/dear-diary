import React from "react";

export const ProfilePage = () => {
  const user = localStorage.getItem("user");
  if (!user) return;
  const username = JSON.parse(user).username
    ? JSON.parse(user).username
    : "Guest";
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-1/3 h-full flex flex-col">
        <h1 className="my-8 text-4xl font-bold text-center">{username}</h1>
        <div className="w-40 h-40 bg-gray-300 rounded-full self-center" />
        <h2 className="mt-6 mb-2">About You</h2>
        <textarea className="border-2 border-black h-52"></textarea>
      </div>
    </div>
  );
};
