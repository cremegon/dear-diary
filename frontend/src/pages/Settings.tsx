import React from "react";
import { NavLink } from "react-router-dom";

interface settingsArrayProps {
  title: string;
  navlink: string;
}

export const settingsArray: settingsArrayProps[] = [
  { title: "Change Password", navlink: "change-password" },
  { title: "Confirm End of User", navlink: "" },
];
export const SettingsPage = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-3xl font-bold mt-4 ml-4">Settings</h1>
        <ul className="w-1/2">
          {settingsArray && settingsArray.length > 0
            ? settingsArray.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-center w-full h-20 bg-pink-400 mt-6"
                >
                  <NavLink to={item.navlink}>
                    <li className="ml-4 text-white font-bold">{item.title}</li>
                  </NavLink>
                </div>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;
