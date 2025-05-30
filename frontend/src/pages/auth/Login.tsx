import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LoginUser,
  resetCodeCheck,
  resetPassword,
  verifyResetPassword,
} from "../../util/client.ts";
import { useAuth } from "../../context/contextProvider.tsx";
import { passwordResetEmail } from "../../util/client.ts";

export const Login = () => {
  const [modal, setModal] = useState("login");

  // ---- Login Modal
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  // ---- Send Reset to Email
  const [resetEmail, setResetEmail] = useState("");

  // ---- Send Code to Reset Password Modal
  const [emailCode, setEmailCode] = useState("");

  // ---- Reset Password Modal
  const [resetPass1, setResetPass1] = useState("");
  const [resetPass2, setResetPass2] = useState("");

  const { setAuth } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailCodeRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (resetPass1 && resetPass2 && resetRef1.current && resetRef2.current) {
      if (resetPass1 !== resetPass2) {
        resetRef1.current.style.borderColor = "red";
        resetRef2.current.style.borderColor = "red";
      } else {
        resetRef1.current.style.borderColor = "green";
        resetRef2.current.style.borderColor = "green";
      }
    }
  }, [resetPass1, resetPass2]);
  async function handleLogin(e: React.MouseEvent) {
    e.preventDefault();
    setError([]);
    const result = await LoginUser(email, password, setAuth);

    if (result) {
      setError(result);
      return;
    }
  }

  async function handleEmailReset(e: React.MouseEvent) {
    e.preventDefault();
    setError([]);
    const response = await passwordResetEmail(resetEmail);
    if (!response.data) {
      setError(["email code", response.message]);
      return;
    }
    setModal("code");
  }

  async function handleResetCode(e: React.MouseEvent) {
    e.preventDefault();
    setError([]);
    const response = await resetCodeCheck(emailCode);
    if (!response.data) {
      setError(["ecode", response.message]);
      return;
    }
    setModal("reset");
  }

  async function handlePasswordReset(e: React.MouseEvent) {
    e.preventDefault();
    setError([]);
    const matchingPasswords = verifyResetPassword(resetPass1, resetPass2);

    if (matchingPasswords.error) {
      setError(["password match", matchingPasswords.message]);
      return;
    }

    const response = await resetPassword(resetPass1, emailCode);
    setStatus(response.message);
    setModal("login");
  }

  return (
    <div className="flex justify-center align-middle w-full h-full">
      <div className="flex flex-col justify-center align-middle w-1/3">
        {status ? (
          <div className="text-green-500 text-center">{status}</div>
        ) : null}
        {error ? (
          <div className="text-red-700 text-center">{error[1]}</div>
        ) : null}

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

            <button
              className="mt-6 border-black border-2 bg-pink-400"
              onClick={handleLogin}
            >
              Login
            </button>
            <Link to={"/signup"} className="text-center text-blue-800 mt-6">
              Go to Signup
            </Link>
            <div className="text-red-600 text-center border-pink-500 border-4">
              <p
                onClick={() => setModal("email code")}
                className="cursor-pointer"
              >
                Forgot Password?
              </p>
            </div>
          </div>
        ) : null}
        {modal === "email code" ? (
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-center">
              Enter Your Email to Send Reset Code
            </h1>
            <input
              type="email"
              placeholder="enter email"
              required
              onChange={(e) => setResetEmail(e.target.value)}
              ref={emailCodeRef}
              className="border-black border-2 mt-8"
            />

            <button
              className="mt-6 border-black border-2 bg-pink-400"
              onClick={(e) => handleEmailReset(e)}
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
        {modal === "code" ? (
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-center">
              Enter Your Reset Code
            </h1>
            <input
              type="text"
              placeholder="enter reset code"
              required
              onChange={(e) => setEmailCode(e.target.value)}
              ref={codeRef}
              className="border-black border-2 mt-8"
            />

            <button
              className="mt-6 border-black border-2 bg-pink-400"
              onClick={(e) => handleResetCode(e)}
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

            <button
              className="mt-6 border-black border-2 bg-pink-400"
              onClick={(e) => handlePasswordReset(e)}
            >
              Reset Password
            </button>
            <Link to={"/signup"} className="text-center text-blue-800 mt-6">
              Go to Signup
            </Link>
            <div
              onClick={() => setModal("code")}
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
