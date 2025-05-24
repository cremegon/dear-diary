import React, { createContext, useState } from "react";

const chapContext = createContext(null);

export const chapterContext = ({ children }) => {
  const [chapterArray, setChapterArray] = useState([]);

  return (
    <chapContext.Provider value={{ chapterArray, setChapterArray }}>
      {children}
    </chapContext.Provider>
  );
};

export const useChapterContext;
