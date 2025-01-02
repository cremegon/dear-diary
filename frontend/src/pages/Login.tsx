import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyPassword, verifyUsername } from "../util/client.ts";
import { useAuth } from "../util/contextProvider.tsx";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        parsedUser.isAuthenticated = true;
        parsedUser.loggedIn = true;
        localStorage.setItem("user", JSON.stringify(parsedUser));

        setAuth(true);
        console.log("Login Successful");
      }
    } else {
      console.log("Login Failed");
      navigate(`${data.redirect}`);
    }
  };
  return (
    <form action="post" className="w-full h-full" onSubmit={handleLogin}>
      <div className="flex justify-center align-middle w-full h-full">
        <div className="flex flex-col justify-center align-middle w-1/3">
          <h1 className="text-7xl font-extrabold text-center">Login</h1>

          <input
            type="email"
            placeholder="enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="border-black border-2 mt-8"
          />
          <input
            type="password"
            placeholder="enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="border-black border-2 mt-4"
          />
          <button
            className="mt-6 border-black border-2 bg-pink-400"
            type="submit"
          >
            Login
          </button>
          <Link to={"/signup"} className="text-center text-blue-800 mt-6">
            Go to Signup
          </Link>
        </div>
      </div>
    </form>
  );
};
