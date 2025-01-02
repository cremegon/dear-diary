import React from "react";
import { useAuth } from "../util/contextProvider.tsx";

export const Homepage = () => {
  const user = localStorage.getItem("user");
  const { setAuth } = useAuth();
  const handleLogout = async () => {
    const response = await fetch("http://localhost:5000/logout", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      if (user) {
        console.log(data.message);
        const parsedUser = JSON.parse(user);
        parsedUser.isAuthenticated = false;
        parsedUser.loggedIn = false;
        localStorage.setItem("user", JSON.stringify(parsedUser));
      }

      setAuth(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-center">
        <h1 className="text-7xl text-center font-extrabold">
          Hi, Welcome to the Homepage!
        </h1>
        <button
          className="mt-6 border-black border-2 bg-pink-400"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
