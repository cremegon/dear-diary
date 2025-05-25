import React, { createContext, ReactNode, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

interface ChapterContextType {
  chapterArray: Array<object>;
  setChapterArray: (token: Array<object>) => void;
}

type ChapterProviderType = {
  children: ReactNode;
};

const chapContext = createContext<ChapterContextType>(null!);

export const ChapterProvider = ({ children }: ChapterProviderType) => {
  const [chapterArray, setChapterArray] = useState<object[]>([]);

  return (
    <chapContext.Provider value={{ chapterArray, setChapterArray }}>
      {children}
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
