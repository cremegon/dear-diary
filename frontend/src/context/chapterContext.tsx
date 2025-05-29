import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

interface ChapterContextType {
  chapterArray: Array<object>;
  setChapterArray: (chapterArray: Array<object>) => void;
}

const chapContext = createContext<ChapterContextType>(null!);

export const ChapterProvider = () => {
  const [chapterArray, setChapterArray] = useState<object[]>([
    { poopy: "lez go" },
  ]);

  return (
    <chapContext.Provider value={{ chapterArray, setChapterArray }}>
      <Outlet />
    </chapContext.Provider>
  );
};

export const useChapterContext = () => {
  const context = useContext(chapContext);
  if (!context) {
    throw new Error("ChapterContext must be used within an ChapterProvider");
  }
  return context;
};
