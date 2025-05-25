import { useNavigate } from "react-router-dom";
import { useChapterContext } from "../context/chapterContext";

export const TextEditorNavbar = () => {
  const navigate = useNavigate();
  const { chapterArray } = useChapterContext();
  const currentChapIdx = 0;
  function handlePrevious() {
    console.log(chapterArray, currentChapIdx);
    if (currentChapIdx >= 1) {
      const chapterId = chapterArray[currentChapIdx - 1];
      navigate(`${chapterId}/write-session?create=false`);
    }
  }

  function handleNext() {
    if (currentChapIdx < chapterArray.length - 1) {
      const chapterId = chapterArray[currentChapIdx + 1];
      navigate(`${chapterId}/write-session?create=false`);
    }
  }

  return (
    <div>
      <div className="h-40 bg-pink-500 flex flex-row justify-between items-center">
        <button
          onClick={handlePrevious}
          className="bg-white border-pink-400 border-4 w-24 h-10 ml-20"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-white border-pink-400 border-4 w-24 h-10 mr-20"
        >
          Next
        </button>
      </div>
    </div>
  );
};
