import React from "react";
import { Link } from "react-router-dom";

export const Homepage = () => {
  return (
    <div className="min-h-screen text-center">
      <h1 className="text-8xl">HOMEPAGE</h1>
      <Link to={"/diary"}>
        <h1 className="text-5xl font-bold mt-8 text-amber-400 ">
          Go To Diary!
        </h1>
      </Link>
    </div>
  );
};
