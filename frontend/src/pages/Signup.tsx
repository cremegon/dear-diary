import React, { useState } from "react";
import { verifyPassword, verifyUsername } from "../util/client.ts";
import { useAuth } from "../util/contextProvider.tsx";
import { Link } from "react-router-dom";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();

  // --------------- Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);

    // ------------- Verify Username via Helper Function
    const validUsername = verifyUsername(email);
    if (!validUsername) {
      console.log("Email is not valid");
    }

    // ------------- Verify Password via Helper Function
    const validPassword = verifyPassword(password);
    if (!validPassword) {
      console.log("Password is not valid");
    }

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);

        parsedUser.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(parsedUser));
        setAuth(true);
      }
    } else {
      console.log(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full ">
      <div className="w-full h-full flex justify-center align-middle">
        <div className="flex flex-col w-1/3 align-middle justify-center">
          <h3 className="text-7xl font-extrabold text-center">Sign Up</h3>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter email"
            className="border-black border-2 mt-8"
          />
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter password"
            className="border-black border-2 mt-4"
          />
          <button
            type="submit"
            className="mt-6 border-black border-2 bg-pink-400"
          >
            Sign Up
          </button>
          <Link to={"/login"} className="text-center text-blue-800 mt-4">
            Go to Login
          </Link>
        </div>
      </div>
    </form>
  );
};
