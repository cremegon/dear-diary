import React, { createContext, useState } from "react";

const chapContext = createContext(null);

const chapterContext = ({ children }) => {
  const [chapterArray, setChapterArray] = useState([]);

  return (
    <chapContext.Provider value={{ chapterArray, setChapterArray }}>
      {children}
    </chapContext.Provider>
  );
};
