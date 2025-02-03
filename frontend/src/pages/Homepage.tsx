import React from "react";
import { Link } from "react-router-dom";

export const Homepage = () => {
  return (
    <div>
      <h1 className="text-5xl">HOMEPAGE</h1>
      <Link to={"/write-session"}>Writing Sessions</Link>
    </div>
  );
};
