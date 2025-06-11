import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { fetchPrevNextChapters } from "../../util/diary.ts";

export const EditorPageLayout = () => {
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  const param = useParams().chapterId as string;
  const archive_param = useParams().archiveChapterId as string;
  const params = param ? param : archive_param;
  const diary_id = useParams().diaryId as string;
  const archive_diary_id = useParams().archiveDiaryId as string;
  const diaryId = diary_id ? diary_id : archive_diary_id;
  const navigate = useNavigate();
  const location = useLocation();

  async function handlePrevious() {
    if (!prevId) return;
    const chapterId = prevId;
    if (location.pathname.includes("diary")) {
      navigate(`/diary/${diaryId}/chapter/${chapterId}`);
    } else {
      navigate(`/archive/${diaryId}/chapter/${chapterId}`);
    }
  }

  async function handleNext() {
    if (!nextId) {
      return;
    }
    const chapterId = nextId;
    if (location.pathname.includes("diary")) {
      navigate(`/diary/${diaryId}/chapter/${chapterId}`);
    } else {
      navigate(`/archive/${diaryId}/chapter/${chapterId}`);
    }
  }

  useEffect(() => {
    async function handlePrevNextChapters(URL: string) {
      const response = await fetchPrevNextChapters(URL);
      console.log("response...?", response);
      if (!response) return;
      setPrevId(response.prev);
      setNextId(response.next);
      console.log(prevId, nextId);
    }
    handlePrevNextChapters(params);
  }, [navigate]);
  return (
    <div>
      <div className="h-40 bg-pink-500 flex flex-row justify-between items-center">
        <button
          disabled={!prevId ? true : false}
          onClick={handlePrevious}
          className={`${prevId ? "text-green-500" : "text-red-500"} bg-white border-pink-400 border-4 w-24 h-10 ml-20`}
        >
          Previous
        </button>
        <Link
          to={
            location.pathname.includes("diary")
              ? `/diary/${diaryId}/chapter`
              : `/archive/${diaryId}/chapter`
          }
          className="text-white font-bold text-3xl"
        >
          {location.pathname.includes("diary") ? "Chapter" : "Archive"}
        </Link>
        <button
          disabled={!nextId ? true : false}
          onClick={handleNext}
          className={`${nextId ? "text-green-500" : "text-red-500"} bg-white border-pink-400 border-4 w-24 h-10 ml-20`}
        >
          Next
        </button>
      </div>

      <Outlet />
    </div>
  );
};
export default EditorPageLayout;
