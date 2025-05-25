import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const EditorPageLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapterArray, currentChapIdx } = location.state || {};
  function handlePrevious() {
    if (currentChapIdx >= 1) {
      const chapterId = chapterArray[currentChapIdx - 1].url;
      navigate(`${chapterId}/write-session?create=false`, {
        state: {
          chapterArray,
          currentChapIdx,
        },
      });
    }
  }

  function handleNext() {
    if (currentChapIdx < chapterArray.length - 1) {
      const chapterId = chapterArray[currentChapIdx + 1].url;
      navigate(`${chapterId}/write-session?create=false`, {
        state: {
          chapterArray,
          currentChapIdx,
        },
      });
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

      <Outlet />
    </div>
  );
};
export default EditorPageLayout;
