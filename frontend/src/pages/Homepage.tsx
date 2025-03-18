import React from "react";
import { Link } from "react-router-dom";

export const Homepage = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-4xl">HOMEPAGE!!!!</h1>
      <Link to={"/diary"}>Go To Diary!</Link>
    </div>
  );
};
