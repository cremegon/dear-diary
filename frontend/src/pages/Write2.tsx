import React, { useState, useEffect, useRef } from "react";
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

export const Editor = () => {
  const [formatting, setFormatting] = useState({
    strong: false,
    em: false,
    underline: false,
  });

  const windowHeight = window.screen.height;
  const fonts = tailwindConfig.theme?.extend?.fontFamily || {};
  const fontOptions = Object.values(fonts).map((font) => {
    return font[0];
  });

  const [selectedFont, setSelectedFont] = useState("serif");
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<"left" | "right" | "center">(
    "left"
  );

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleInput = () => {
      const editor = editorRef.current;
      if (editor) {
        console.log("getting big for you...", editorRef.current);
        // editor.style.height = "auto"; // Reset height to recalculate
        editor.style.height = `${editor.scrollHeight}px`; // Adjust height dynamically
      }
    };

    const editor = editorRef.current;

    if (editor) {
      editor.addEventListener("input", handleInput);
    }

    return () => {
      if (editor) {
        editor.removeEventListener("input", handleInput);
      }
    };
  }, []);

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

  return (
    <div className="w-full h-svh flex flex-col items-center">
      <input
        type="text"
        placeholder="enter title"
        className="border-pink-400 border-4"
        id="title"
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

      <form action="submit">
        <button type="submit" className="btn-writeUI">
          Save
        </button>
      </form>

      <div
        className="bg-slate-400 w-full break-words"
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
