import React, { useState, useRef, useEffect } from "react";
import {
  addNewLine,
  exitCurrentTag,
  findToggleState2,
  findToggleVariation,
  insertBlankTag,
  removeFailedTag,
  treeWalkerSearch,
  unwrapAll,
  wrapAll,
} from "../util/editor2.ts";
import tailwindConfig from "../tailwind.config.js";
import { useParams } from "react-router-dom";
import { loadFromDatabase, saveToDatabase } from "../util/diary.ts";

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

  const [title, setTitle] = useState("");
  const [selectedFont, setSelectedFont] = useState("serif");
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<"left" | "right" | "center">(
    "left"
  );

  const editorRef = useRef<HTMLDivElement>(null);

  function toggleFormat(format: string) {
    let lastNode: Node | undefined | null = null;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const currentRange = selection.getRangeAt(0);

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

        // else if (start,inbetween or end fx?) {
        //   // ---- UNBOLDEN START
        //   if (
        //     parent &&
        //     startCont === endCont &&
        //     start === 0 &&
        //     startCont.textContent &&
        //     end < startCont.textContent.length
        //   ) {
        //     unwrapStart(targetElement, start, end, parent, selection);
        //   }

        //   // ---- UNBOLDEN END
        //   else if (
        //     parent &&
        //     startCont === endCont &&
        //     start > 0 &&
        //     end === startCont.textContent?.length
        //   ) {
        //     unwrapEnd(targetElement, start, end, parent);
        //   }

        //   // ---- UNBOLDEN BETWEEN
        //   else if (
        //     parent &&
        //     startCont === endCont &&
        //     start > 0 &&
        //     endCont.textContent &&
        //     end < endCont.textContent.length
        //   ) {
        //     unwrapBetween(
        //       targetElement,
        //       start,
        //       end,
        //       parent,
        //       format,
        //       currentRange
        //     );
        //   }
        // }

        console.log(document.getElementById("father")?.innerHTML);
        return;
      }

      // ---- WRAP INSIDE TAG
      else if (!variation && !removeTag && targetElement) {
        lastNode = wrapAll(currentRange, format, selection, targetElement);
      }

      if (lastNode) {
        removeFailedTag(lastNode);
      }
    }
    console.log(document.getElementById("father")?.innerHTML);
  }

  function checkAndPlaceCaret() {
    const selection = window.getSelection();
    if (!selection || selection?.rangeCount < 1) return;

    const father = document.getElementById("father");
    if (!father?.innerHTML) {
      const span = document.createElement("span");
      const div = document.createElement("div");
      span.innerHTML = "\u00A0";

      div.appendChild(span);
      father?.appendChild(div);

      const newRange = document.createRange();
      newRange.setStart(span, 0);
      newRange.setEnd(span, 0);

      selection.removeAllRanges();
      selection.addRange(newRange);
      return;
    }
  }

  async function loadContent() {
    const response = await loadFromDatabase(params);
    console.log("LOADED CONTENT = ", response);
    const father = document.getElementById("father");
    setTitle(response.data[0]);
    if (father && response.data[1] !== "null")
      father.innerHTML = response.data[1];
    setFontSize(response.data[2]);
    setSelectedFont(response.data[3]);
    return;
  }

  async function saveSession(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    const content = document.getElementById("father")?.innerHTML as string;
    console.log(content);
    const response = await saveToDatabase(
      title,
      content,
      params,
      selectedFont,
      fontSize
    );
    console.log("RESPONSE", response);
  }

  useEffect(() => {
    loadContent();
  }, []);
  return (
    <div className="w-full h-full flex flex-col items-center">
      <input
        type="text"
        placeholder="enter title"
        className="border-pink-400 border-4"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex flex-row text">
        <select className="btn-writeUI">
          {fontOptions.map((font) => (
            <option
              key={font}
              value={font}
              onClick={() => setSelectedFont(font)}
            >
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
        <button className="btn-writeUI" onClick={() => setTextAlign("center")}>
          Text Center
        </button>
        <button className="btn-writeUI" onClick={() => setTextAlign("right")}>
          Text Right
        </button>
        <input type="color" />
      </div>

      <form action="submit" onSubmit={(e) => saveSession(e)}>
        <button type="submit" className="btn-writeUI">
          Save
        </button>
      </form>

      <div
        className="bg-slate-400 w-2/3 min-h-screen break-words flex-1"
        ref={editorRef}
        contentEditable="true"
        id="father"
        onClick={() => checkAndPlaceCaret()}
        onKeyDown={(e) => addNewLine(e)}
        style={{
          fontSize: `${fontSize}px`,
          textAlign: `${textAlign}`,
          fontFamily: `${selectedFont}`,
          height: `${windowHeight}px`,
        }}
      ></div>
    </div>
  );
};

export default Editor;
