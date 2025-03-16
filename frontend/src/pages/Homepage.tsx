import React from "react";
import { Link } from "react-router-dom";

export const Homepage = () => {
  return (
    <div className="h-screen">
      <h1 className="text-5xl">HOMEPAGE</h1>

      <Link to={"/diary"}>Diary Page</Link>
    </div>
  );
};
