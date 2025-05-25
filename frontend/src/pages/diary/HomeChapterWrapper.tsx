import { ChapterProvider } from "../../context/chapterContext.tsx";
import ChapterPage from "./HomeChapter.tsx";

const ChapterPageWrapper = () => (
  <ChapterProvider>
    <ChapterPage />
  </ChapterProvider>
);

export default ChapterPageWrapper;
