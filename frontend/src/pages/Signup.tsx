import React, { useEffect, useRef, useState } from "react";
import {
  getName,
  sendSignupCode,
  signUpCodeCheck,
  verifyPassword,
  verifyUsername,
} from "../util/client.ts";
import { useAuth } from "../util/contextProvider.tsx";
import { Link } from "react-router-dom";

export const Signup = () => {
  const [modal, setModal] = useState("signup");

  // ---- Login Modal
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string[]>([]);

  // ---- Verify SignUp Code Modal
  const [verifyCode, setVerifyCode] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const verifyCodeRef = useRef<HTMLInputElement>(null);

  const { setAuth } = useAuth();

  useEffect(() => {
    if (error) {
      if (error[0] === "email") {
        if (emailRef && emailRef.current) {
          emailRef.current?.focus();
        }
      } else if (error[0] === "password") {
        if (passwordRef && passwordRef.current) {
          passwordRef.current?.focus();
        }
      } else {
        if (verifyCodeRef && verifyCodeRef.current) {
          verifyCodeRef.current?.focus();
          verifyCodeRef.current.style.borderColor = "red";
        }
      }
    }
  }, [error]);

  async function verifyInputs(email: string, password: string) {
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
    setModal("code");
    await sendSignupCode(email);
  }

  // --------------- Form Submission
  async function handleSubmit(name: string, email: string, password: string) {
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

  async function handleEmailVerifyCode(email_code: string) {
    setModal("code");
    const response = await signUpCodeCheck(email_code);
    setError([]);
    if (!response.data) {
      setError(["verify code", response.message]);
      return;
    }
    console.log("correct signup code!");
    await handleSubmit(name, email, password);
  }

  return (
    <div className="flex flex-row justify-center align-middle">
      {error ? (
        <div className="text-red-600 text-center">{error[1]}</div>
      ) : null}
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
              className="border-black border-2 mt-8 w-full"
            />

            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter email"
              ref={emailRef}
              className="border-black border-2 mt-4 w-full"
            />
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter password"
              ref={passwordRef}
              className="border-black border-2 mt-4 w-full"
            />
            <div className="flex flex-col mt-6 justify-center">
              <button
                onClick={() => verifyInputs(email, password)}
                className=" border-black border-2 bg-pink-400"
              >
                Sign Up
              </button>
              <Link to={"/login"} className="text-center text-blue-800 mt-4">
                Go to Login
              </Link>
            </div>
          </div>
        ) : null}
        {modal === "code" ? (
          <div>
            <h3 className="text-7xl font-extrabold text-center">
              Verification Email
            </h3>
            <p className="mt-4 text-center">
              We have sent a verification email to the email account you
              registered with. Kindly enter the verification code below:
            </p>
            <input
              ref={verifyCodeRef}
              type="text"
              name="verify"
              id="name"
              onChange={(e) => setVerifyCode(e.target.value)}
              className="border-black border-2 mt-8 w-full"
            />

            <button
              onClick={() => handleEmailVerifyCode(verifyCode)}
              className="mt-6 border-black border-2 bg-pink-400 w-full"
            >
              Verify
            </button>
            <div
              onClick={() => setModal("signup")}
              className="text-center mt-4 text-blue-700 cursor-pointer"
            >
              Sign Up
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
