import { ChapterProvider } from "../../context/chapterContext.tsx";
import EditorPageLayout from "../layouts/EditorLayout.tsx";

export const TextEditorWrapper = () => {
  return (
    <ChapterProvider>
      <EditorPageLayout />
    </ChapterProvider>
  );
};

export default TextEditorWrapper;
