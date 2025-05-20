import React, { useState, useRef, useEffect } from "react";
import {
  addNewLine,
  checkOrPlaceCaret,
  exitCurrentTag,
  findToggleState2,
  findToggleVariation,
  handlePaste,
  insertBlankTag,
  removeFailedTag,
  treeWalkerSearch,
  unwrapAll,
  wrapAll,
} from "../../util/editor.ts";
import tailwindConfig from "../../tailwind.config.js";
import { useParams } from "react-router-dom";
import { loadFromDatabase, saveToDatabase } from "../../util/diary.ts";
import rangy from "rangy/lib/rangy-core";
import "rangy/lib/rangy-classapplier";

export const Editor = () => {
  const [formatting, setFormatting] = useState({
    strong: false,
    em: false,
    underline: false,
  });
  const params = useParams().chapterId as string;

  const windowHeight = window.screen.height;
  const fonts = tailwindConfig.theme?.extend?.fontFamily || {};
  const fontOptions = Object.values(fonts).map((font) => {
    return font[0];
  });

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("fff");
  const [selectedFont, setSelectedFont] = useState("serif");
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<"left" | "right" | "center">(
    "left"
  );

  const editorRef = useRef<HTMLDivElement>(null);
  const father = document.getElementById("father");
  rangy.init();

  function toggleFormat(format: string) {
    let lastNode: Node | undefined | null = null;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const currentRange = selection.getRangeAt(0);
      console.log("the current range at hand", currentRange.startContainer);

      if (currentRange.collapsed) {
        if (
          currentRange.startContainer.parentNode?.nodeType ===
            Node.ELEMENT_NODE &&
          currentRange.startContainer.parentNode.nodeName !== "SPAN"
        ) {
          exitCurrentTag(currentRange, selection);
        } else {
          insertBlankTag(currentRange, format, selection);
        }
        return;
      }

      const variation = findToggleVariation(currentRange, selection);

      const findTextNode = treeWalkerSearch(currentRange);

      const [removeTag, targetElement] = findToggleState2(
        findTextNode as Node,
        format
      );
      console.log(formatting[0]);
      setFormatting((prev) => ({ ...prev, [format]: removeTag }));

      // ---- UNWRAP FROM TAG
      if (!variation && removeTag && targetElement) {
        console.log(currentRange);

        lastNode = unwrapAll(
          targetElement,
          format,
          selection,
          currentRange,
          setFormatting,
          removeTag
        );

        console.log(document.getElementById("father")?.innerHTML);
        return;
      }

      // ---- WRAP INSIDE TAG
      else if (!variation && !removeTag && targetElement) {
        lastNode = wrapAll(
          currentRange,
          format,
          selection,
          targetElement,
          color
        );
      }

      if (lastNode) {
        removeFailedTag(lastNode);
      }
    }
    console.log(document.getElementById("father")?.innerHTML);
  }

  async function saveSession(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    const content = document.getElementById("father")?.innerHTML as string;
    const response = await saveToDatabase(
      title,
      content,
      params,
      selectedFont,
      fontSize
    );
    console.log("RESPONSE", response);
  }

  function handleKeyboard(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewLine();
    } else {
      checkOrPlaceCaret(father as Element, rangy);
    }
  }

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
        <input
          type="text"
          placeholder="enter title"
          className="border-pink-400 border-4"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex flex-row text">
          <select
            className="btn-writeUI"
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <button
            value="strong"
            className="btn-writeUI"
            onClick={(e) => toggleFormat((e.target as HTMLButtonElement).value)}
          >
            Bold
          </button>
          <button
            value="em"
            className="btn-writeUI"
            onClick={(e) => toggleFormat((e.target as HTMLButtonElement).value)}
          >
            Italic
          </button>
          <button
            value="p"
            className="btn-writeUI"
            onClick={(e) => toggleFormat((e.target as HTMLButtonElement).value)}
          >
            Highlight
          </button>
          <button
            className="btn-writeUI"
            onClick={() => setFontSize(fontSize + 2)}
          >
            Font +
          </button>
          <button
            className="btn-writeUI"
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
          >
            Font -
          </button>
          <button className="btn-writeUI" onClick={() => setTextAlign("left")}>
            Text Left
          </button>
          <button
            className="btn-writeUI"
            onClick={() => setTextAlign("center")}
          >
            Text Center
          </button>
          <button className="btn-writeUI" onClick={() => setTextAlign("right")}>
            Text Right
          </button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <form action="submit" onSubmit={(e) => saveSession(e)}>
          <button type="submit" className="btn-writeUI">
            Save
          </button>
        </form>
        <div
          className="bg-slate-400 w-2/3 min-h-screen break-words flex-1"
          id="father"
          ref={editorRef}
          contentEditable="true"
          suppressContentEditableWarning
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyboard(e)}
          onClick={() => checkOrPlaceCaret(father as Element, rangy)}
          style={{
            fontSize: `${fontSize}px`,
            textAlign: `${textAlign}`,
            fontFamily: `${selectedFont}`,
            height: `${windowHeight}px`,
          }}
        >
          <div>
            <span>&nbsp;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
