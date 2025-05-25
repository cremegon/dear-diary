import React, { createContext, ReactNode, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

type ChapterContextType = {
  chapterArray: object[];
  setChapterArray: React.Dispatch<React.SetStateAction<object[]>>;
};

const chapContext = createContext<ChapterContextType | null>(null);

export const ChapterProvider = ({ children }: ChapterProviderType) => {
  const [chapterArray, setChapterArray] = useState<object[]>([]);

  return (
    <chapContext.Provider value={{ chapterArray, setChapterArray }}>
      {children}
    </chapContext.Provider>
  );
};

export const useChapterContext = () => useContext(chapContext);

export const ChapterLayout = () => {
  <ChapterProvider>
    <Outlet />
  </ChapterProvider>;
};
