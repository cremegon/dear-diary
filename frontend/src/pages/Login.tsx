import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LoginUser } from "../util/client.ts";
import { useAuth } from "../util/contextProvider.tsx";

export const Login = () => {
  const [modal, setModal] = useState("login");

  // ---- Login Modal
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string[]>([]);

  // ---- Send Code to Reset Password Modal
  const [emailCode, setEmailCode] = useState("");

  // ---- Reset Password Modal
  const [resetPass1, setResetPass1] = useState("");
  const [resetPass2, setResetPass2] = useState("");

  const { setAuth } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const resetRef1 = useRef<HTMLInputElement>(null);
  const resetRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      if (error[0] === "email") {
        emailRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
    }
  }, [error]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError([]);
    const result = await LoginUser(email, password, setAuth);

    if (result) {
      setError(result);
      return;
    }
  }

  return (
    <div className="flex justify-center align-middle w-full h-full">
      <div className="flex flex-col justify-center align-middle w-1/3">
        {modal === "login" ? (
          <div className="flex flex-col">
            <h1 className="text-7xl font-extrabold text-center">Login</h1>
            <input
              type="email"
              placeholder="enter email"
              required
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
              className="border-black border-2 mt-8"
            />
            <input
              type="password"
              placeholder="enter password"
              required
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordRef}
              className="border-black border-2 mt-4"
            />
            {error ? <div>{error[1]}</div> : null}
            <button
              className="mt-6 border-black border-2 bg-pink-400"
              onClick={handleLogin}
            >
              Login
            </button>
            <Link to={"/signup"} className="text-center text-blue-800 mt-6">
              Go to Signup
            </Link>
            <div
              onClick={() => setModal("code")}
              className="text-red-600 text-center"
            >
              Forgot Password?
            </div>
          </div>
        ) : null}
        {modal === "code" ? (
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-center">
              Enter Your Email to Send Reset Code
            </h1>
            <input
              type="email"
              placeholder="enter email"
              required
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
              className="border-black border-2 mt-8"
            />

            {error ? <div>{error[1]}</div> : null}
            <button
              className="mt-6 border-black border-2 bg-pink-400"
              onClick={handleEmailReset()}
            >
              Send Code
            </button>
            <Link to={"/signup"} className="text-center text-blue-800 mt-6">
              Go to Signup
            </Link>
            <div
              onClick={() => setModal("login")}
              className="text-red-600 text-center"
            >
              Go Back
            </div>
            <div
              onClick={() => setModal("reset")}
              className="text-red-600 text-center"
            >
              Reset
            </div>
          </div>
        ) : null}
        {modal === "reset" ? (
          <div className="flex flex-col">
            <h1 className="text-5xl font-extrabold text-center">
              Enter Your New Password
            </h1>
            <input
              type="password"
              placeholder="enter password"
              required
              onChange={(e) => setResetPass1(e.target.value)}
              ref={resetRef1}
              className="border-black border-2 mt-8"
            />
            <input
              type="password"
              placeholder="enter password"
              required
              onChange={(e) => setResetPass2(e.target.value)}
              ref={resetRef2}
              className="border-black border-2 mt-8"
            />

            {error ? <div>{error[1]}</div> : null}
            <button
              className="mt-6 border-black border-2 bg-pink-400"
              type="submit"
            >
              Reset Password
            </button>
            <Link to={"/signup"} className="text-center text-blue-800 mt-6">
              Go to Signup
            </Link>
            <div
              onClick={() => setModal("login")}
              className="text-red-600 text-center"
            >
              Go Back
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
