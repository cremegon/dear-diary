import React, { useEffect, useRef, useState } from "react";
import { getName, verifyPassword, verifyUsername } from "../util/client.ts";
import { useAuth } from "../util/contextProvider.tsx";
import { Link } from "react-router-dom";

export const Signup = () => {
  const [modal, setModal] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string[]>([]);

  const [emailCode, setEmailCode] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { setAuth } = useAuth();

  useEffect(() => {
    if (error) {
      if (error[0] === "email") {
        emailRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
    }
  }, [error]);

  // --------------- Form Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(name, email, password);

    // ------------- Verify Username via Helper Function
    const validUsername: { error: boolean; message: string } =
      verifyUsername(email);
    if (validUsername.error) {
      setError(["email", validUsername.message]);
      return;
    }
    setError([]);

    // ------------- Verify Password via Helper Function
    const validPassword: { error: boolean; message: string } =
      verifyPassword(password);
    if (validPassword.error) {
      setError(["password", validPassword.message]);
      return;
    }
    setError([]);

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      const user = localStorage.getItem("user");
      if (user) {
        const title_name = getName(data.content);
        const parsedUser = JSON.parse(user);
        parsedUser.username = title_name;
        parsedUser.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(parsedUser));

        setAuth(true);
      }
    } else {
      setError(["email", data.message]);
    }
  }

  async function handleEmailCode() {
    setModal("code");
    const response = await sendEmailCode();
    setError([]);
    if (!response.data) {
      setError(["code", response.message]);
      setModal("signup");
      return;
    }
    setModal("verify code");
  }

  async function handleEmailVerifyCode(e: React.FormEvent, email_code: string) {
    const response = await verifyEmailCode(email_code);
    setError([]);
    if (!response.data) {
      setError(["verify code", response.message]);
      return;
    }
    handleSubmit(e);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-full ">
      <div className="w-full h-full flex justify-center align-middle">
        {error ? <div>{error[1]}</div> : null}
        <div className="flex flex-col w-1/3 align-middle justify-center">
          {modal === "signup" ? (
            <div>
              <h3 className="text-7xl font-extrabold text-center">Sign Up</h3>
              <input
                type="name"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="enter name"
                className="border-black border-2 mt-8"
              />

              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter email"
                ref={emailRef}
                className="border-black border-2 mt-4"
              />
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter password"
                ref={passwordRef}
                className="border-black border-2 mt-4"
              />
              <button
                onClick={() => handleEmailCode()}
                className="mt-6 border-black border-2 bg-pink-400"
              >
                Sign Up
              </button>
              <Link to={"/login"} className="text-center text-blue-800 mt-4">
                Go to Login
              </Link>
            </div>
          ) : null}
          {modal === "signup" ? (
            <div>
              <h3 className="text-7xl font-extrabold text-center">Sign Up</h3>
              <input
                type="name"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="enter name"
                className="border-black border-2 mt-8"
              />

              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter email"
                ref={emailRef}
                className="border-black border-2 mt-4"
              />
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter password"
                ref={passwordRef}
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
          ) : null}
        </div>
      </div>
    </form>
  );
};
