import React, { useRef, useState } from "react";

export const ChangePassPage = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reTypeNew, setReTypeNew] = useState("");

  const currentRef = useRef<HTMLInputElement | null>(null);
  const newRef = useRef<HTMLInputElement | null>(null);
  const reTypeNewRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold my-6">Change Password</h1>
        <input
          ref={currentRef}
          type="text"
          placeholder="current password"
          value={current}
          className="mt-2 border-4 border-pink-400"
        />
        <input
          ref={newRef}
          type="text"
          placeholder="new password"
          value={newPass}
          className="mt-2 border-4 border-pink-400"
        />
        <input
          ref={reTypeNewRef}
          type="text"
          placeholder="re-type new password"
          value={reTypeNew}
          className="mt-2 border-4 border-pink-400"
        />
      </div>
    </div>
  );
};

export default ChangePassPage;
