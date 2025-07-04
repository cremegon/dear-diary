import React, { useRef, useState } from "react";
import { changePassword, verifyPassword } from "../../util/client.ts";

export const ChangePassPage = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reTypeNew, setReTypeNew] = useState("");
  const [error, setError] = useState({ status: false, message: "" });
  const [success, setSuccess] = useState("");

  const currentRef = useRef<HTMLInputElement | null>(null);
  const newRef = useRef<HTMLInputElement | null>(null);
  const reTypeNewRef = useRef<HTMLInputElement | null>(null);

  async function handleChangePassword() {
    setSuccess("");
    setError({ status: false, message: "" });
    if (newPass !== reTypeNew) {
      setError({ status: true, message: "New passwords do not match" });
      return;
    }
    const validPassword = verifyPassword(newPass);
    if (validPassword.error) {
      setError({ status: true, message: validPassword.message });
      return;
    }
    const response = await changePassword(current, newPass);
    if (response.error) {
      setError({ status: true, message: response.message });
      return;
    }
    setSuccess(response.message);
  }
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold my-6">Change Password</h1>
        <div
          className={`${error && error.status ? "block" : "hidden"} text-red-600 bg-red-300 p-4`}
        >
          {error.message}
        </div>
        <div
          className={`${success ? "block" : "hidden"} text-green-600 bg-green-300 p-4`}
        >
          {success}
        </div>
        <h2 className="text-start mt-4">Enter Current Password</h2>
        <input
          ref={currentRef}
          type="text"
          placeholder="current password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="border-4 border-pink-400"
        />

        <h2 className="text-start mt-4">Enter New Password</h2>
        <input
          ref={newRef}
          type="text"
          placeholder="new password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="border-4 border-pink-400"
        />

        <h2 className="text-start mt-4">Re-Enter New Password</h2>
        <input
          ref={reTypeNewRef}
          type="text"
          placeholder="re-type new password"
          value={reTypeNew}
          onChange={(e) => setReTypeNew(e.target.value)}
          className="mb-6 border-4 border-pink-400"
        />
        <button onClick={handleChangePassword} className="btn-writeUI">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ChangePassPage;
