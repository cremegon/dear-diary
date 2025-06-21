import React from "react";

export const EndUser = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold mt-8">End User History</h1>
        <p className="mt-10">
          This page exists to confirm the presence of the user's health,
          well-being and activity. In order to continue the life span of this
          diary in parallel with the writer's presence, please answer the
          security questions below. Failure to answer correctly within 3-months
          will automatically end the life cycle of this diary and distribute
          copies of all diaries to their designated trustees and permanently
          conclude the life cycle of the writer's history
        </p>
      </div>
    </div>
  );
};

export default EndUser;
