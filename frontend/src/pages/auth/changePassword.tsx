import React from "react";

export const ChangePassPage = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold my-6">Change Password</h1>
        <input
          type="text"
          placeholder="current password"
          className="mt-2 border-4 border-pink-400"
        />
        <input
          type="text"
          placeholder="new password"
          className="mt-2 border-4 border-pink-400"
        />
        <input
          type="text"
          placeholder="re-type new password"
          className="mt-2 border-4 border-pink-400"
        />
      </div>
    </div>
  );
};

export default ChangePassPage;
