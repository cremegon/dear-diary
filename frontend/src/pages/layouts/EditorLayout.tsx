import React from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { nextChapter, prevChapter } from "../../util/diary.ts";

export const EditorPageLayout = () => {
  const params = useParams().chapterId as string;
  const diaryId = useParams().diaryId as string;
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  async function handlePrevious() {
    const response = await prevChapter(params);
    const chapterId = response.data;
    if (!chapterId) return;
    if (location.pathname.includes("diary")) {
      navigate(`/diary/${diaryId}/chapter/${chapterId}`);
    } else {
      navigate(`/archive/${diaryId}/chapter/${chapterId}`);
    }
  }

  async function handleNext() {
    const response = await nextChapter(params);
    const chapterId = response.data;
    if (!chapterId) return;
    navigate(`/diary/${diaryId}/chapter/${chapterId}`);
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
        <Link
          to={`/diary/${diaryId}/chapter`}
          className="text-white font-bold text-3xl"
        >
          Chapters
        </Link>
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
