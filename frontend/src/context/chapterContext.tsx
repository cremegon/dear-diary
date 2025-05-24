import React, { createContext } from "react";

const chapContext = createContext(null);

const chapterContext = ({ children }) => {
  const chapterArray = [];

  return (
    <chapContext.Provider value={chapterArray}>{children}</chapContext.Provider>
  );
};
