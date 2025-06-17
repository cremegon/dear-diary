import React from "react";

export const settingsArray: string[] = [
  "Change Password",
  "Confirm End of User",
];
export const SettingsPage = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-3xl font-bold mt-4 ml-4">Settings</h1>
        <ul className="w-full">
          {settingsArray && settingsArray.length > 0
            ? settingsArray.map((item, idx) => (
                <div key={idx} className="w-full h-20 bg-pink-400">
                  <li className="ml-4 text-white font-bold">{item}</li>
                </div>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;
