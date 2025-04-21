import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadFromDatabase } from "../util/diary";

const Reader = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const params = useParams().archiveChapterId as string;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [selectedFont, setSelectedFont] = useState("serif");
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    async function loadContent() {
      const response = await loadFromDatabase(params);
      try {
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        console.log(response.data);
        if (editorRef.current) {
          editorRef.current.innerHTML = response.data[1];
          console.log("HI:3");
        }
        setTitle(response.data[0]);
        setFontSize(response.data[2]);
        setSelectedFont(response.data[3]);
      }
    }

    loadContent();
  }, [params]);
  return (
    <div>
      <div
        className={`top-1/2 left-1/2 bg-yellow-300 ${loading ? "block" : "hidden"} absolute`}
      >
        Loading...
      </div>
      <div
        className={`w-full h-full flex flex-col items-center ${loading ? "hidden" : "block"}`}
      >
        <h1 className="text-4xl font-bold">{title}</h1>
        <div
          contentEditable="false"
          id="father"
          style={{
            fontSize: `${fontSize}px`,
            textAlign: `${textAlign}`,
            fontFamily: `${selectedFont}`,
          }}
          ref={editorRef}
        ></div>
      </div>
    </div>
  );
};

export default Reader;
