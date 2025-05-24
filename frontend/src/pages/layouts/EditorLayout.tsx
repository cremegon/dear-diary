import React from "react";

import { Outlet, useLocation } from "react-router-dom";

export const EditorPageLayout = () => {
  const location = useLocation()
  const {chapterArray, currentChapIdx} = location.state || {}
  function handlePrevious(){
    if (currentChapIdx >= 1){
      const chapterId = chapterArray[currentChapIdx - 1].
    }
  }
  return (
    <div>
      <div className="h-40 bg-pink-500 flex flex-row justify-between items-center">
        <button className="bg-white border-pink-400 border-4 w-24 h-10 ml-20">
          Previous
        </button>
        <button className="bg-white border-pink-400 border-4 w-24 h-10 mr-20">
          Next
        </button>
      </div>

      <Outlet />
    </div>
  );
};
export default EditorPageLayout;
