import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { handleLogout } from "../util/client.ts";
import { useAuth } from "../util/contextProvider.tsx";

export const Navbar = () => {
  const { setAuth } = useAuth();
  const user = localStorage.getItem("user");
  const [navUser] = useState<string>(() => {
    return user ? JSON.parse(user).username : "Guest";
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-black w-full h-1/6 flex flex-col justify-center">
      <ul className="flex flex-row justify-between items-center text-xl text-white">
        <NavLink to={"/"} className="ml-8">
          Home
        </NavLink>

        <NavLink to={"/about"} className="ml-24 hover:font-black">
          What is a Death Diary?
        </NavLink>

        <div className="flex flex-row mr-8 w-40 justify-evenly">
          <div className="bg-white w-12 h-12 rounded-full"></div>
          <p
            className="flex items-center hover:cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {navUser}
          </p>

          <div
            className={`absolute top-24 w-72 h-min bg-yellow-300 ${isOpen ? "block" : "hidden"}`}
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
