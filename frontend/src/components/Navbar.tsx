import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { handleLogout } from "../util/client.ts";
import { useAuth } from "../context/contextProvider.tsx";
import { expireCookie } from "../util/diary.ts";

export const Navbar = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const [navUser] = useState<string>(() => {
    return user ? JSON.parse(user).username : "Guest";
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(false);
  }, [navigate]);

  return (
    <div className="bg-black w-full h-32 flex flex-col justify-center">
      <ul className="flex flex-row justify-between items-center text-xl text-white">
        <button
          onClick={() => expireCookie()}
          className="border-4 border-black p-4 bg-red-500"
        >
          Expire Cookie
        </button>
        <NavLink to={"/diary"} className="ml-8">
          Diary
        </NavLink>

        <NavLink to={"/archive"} className="ml-24 hover:font-black">
          Archive
        </NavLink>

        <NavLink to={"/trustees"} className="ml-24 hover:font-black">
          Trustees
        </NavLink>

        <div className="flex flex-row mr-8 w-40 justify-evenly">
          {parsedUser.profile_dp ? (
            <img
              src={parsedUser.profile_dp}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="bg-white w-12 h-12 rounded-full" />
          )}
          <p
            className="flex items-center hover:cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {navUser}
          </p>

          <div
            className={`absolute z-10 top-24 w-72 h-min bg-yellow-300 ${isOpen ? "block" : "hidden"}`}
          >
            <ul className="text-black m-8 leading-loos">
              <p>
                <NavLink
                  to={"/profile"}
                  className="hover:font-black cursor-pointer"
                >
                  Profile
                </NavLink>
              </p>

              <p>
                <NavLink
                  to={"/settings"}
                  className="hover:font-black cursor-pointer"
                >
                  Settings
                </NavLink>
              </p>

              <p
                onClick={() => handleLogout(setAuth)}
                className="hover:font-black cursor-pointer"
              >
                Logout
              </p>
            </ul>
          </div>
        </div>
      </ul>
    </div>
  );
};
export default Navbar;
