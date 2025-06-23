import React from "react";

export const EndUser = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold mt-8">End User History</h1>
        <p className="mt-10">
          This page exists to confirm the action to be taken upon the passing of
          the user. You may choose to make your diary public into the library of
          people's experiences. Otherwise, upon the passing of the user, this
          diary will only be shared only with respective trustees that the user
          has associated
        </p>
      </div>
    </div>
  );
};

export default EndUser;
