import React from "react";
import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="bg-black w-full h-1/6">
      <ul className="flex flex-row text-cyan-50">
        <NavLink to={"/about"}>About Dear-Diary</NavLink>
        <NavLink to={"/contact"}>Contact Us</NavLink>
      </ul>
    </div>
  );
};

export default Footer;
