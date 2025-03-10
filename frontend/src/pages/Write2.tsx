import React, { useState } from "react";
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

  const fonts = tailwindConfig.theme?.extend?.fontFamily || {};
  const fontOptions = Object.values(fonts).map((font) => {
    return font[0];
  });

  const [selectedFont, setSelectedFont] = useState("serif");
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState<"left" | "right" | "center">(
    "left"
  );

  // ---- NEW FX TO ADD:
  // ---- finally have the main editing logic working,
  // ---- now the last left is the option to change font size
  // ---- option to change font family, text alignment,
  // ---- as well as to change text color on selections (tentative)

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    addNewLine(event);
  }

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

  return (
    <div className="w-full h-[80vh] flex flex-col items-center">
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
      <div
        className="bg-slate-400 w-full h-full"
        contentEditable="true"
        id="father"
        onKeyDown={handleKeyDown}
        style={{
          fontSize: `${fontSize}px`,
          textAlign: `${textAlign}`,
          fontFamily: `${selectedFont}`,
        }}
      >
        <div>
          <span>
            Hello every <strong>NYAN!</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editor;
