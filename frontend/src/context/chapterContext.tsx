import React, { createContext, useContext, useState } from "react";

type ChapterContextType = {
  chapterArray: object[];
  setChapterArray: React.Dispatch<React.SetStateAction<object[]>>;
};

const chapContext = createContext<ChapterContextType | null>(null);

export const ChapterProvider = ({ children }) => {
  const [chapterArray, setChapterArray] = useState<object[]>([]);

  return (
    <chapContext.Provider value={{ chapterArray, setChapterArray }}>
      {children}
    </chapContext.Provider>
  );
};

export const useChapterContext = () => useContext(chapContext);
