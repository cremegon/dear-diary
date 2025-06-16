import React from "react";

export const settingsArray: string[] = ["Change Password", "Confirm Deceased"];
export const SettingsPage = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mt-4 ml-4">Settings</h1>
      <ul>
        {settingsArray && settingsArray.length > 0
          ? settingsArray.map((item, idx) => (
              <div key={idx} className="my-8 ml-4">
                <li>{item}</li>
              </div>
            ))
          : null}
      </ul>
    </div>
  );
};

export default SettingsPage;
