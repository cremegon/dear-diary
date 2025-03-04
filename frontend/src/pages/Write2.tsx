import React, { useState } from "react";
import {
  addNewLine,
  findToggleState2,
  findToggleVariation,
  insertBlankTag,
  removeFailedTag,
  treeWalkerSearch,
  unwrapAll,
  unwrapBetween,
  unwrapEnd,
  unwrapStart,
  wrapAll,
} from "../util/editor2.ts";

export const Editor = () => {
  const [formatting, setFormatting] = useState({
    strong: false,
    em: false,
    underline: false,
  });

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    addNewLine(event);
  }

  function toggleFormat(format: string) {
    let lastNode: Node | undefined | null = null;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const currentRange = selection.getRangeAt(0);

      if (currentRange.collapsed) {
        insertBlankTag(currentRange, format, selection);
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
        const startCont = currentRange.startContainer;
        const endCont = currentRange.endContainer;
        const start = currentRange.startOffset;
        const end = currentRange.endOffset;
        const parent = targetElement.parentNode;
        console.log(currentRange);

        // ---- UNBOLDEN ALL
        if (
          parent &&
          startCont === endCont &&
          start === 0 &&
          end === startCont.textContent?.length
        ) {
          lastNode = unwrapAll(
            targetElement,
            format,
            selection,
            currentRange,
            setFormatting,
            removeTag
          );
        }

        // ---- UNBOLDEN START
        else if (
          parent &&
          startCont === endCont &&
          start === 0 &&
          startCont.textContent &&
          end < startCont.textContent.length
        ) {
          unwrapStart(targetElement, start, end, parent);
        }

        // ---- UNBOLDEN END
        else if (
          parent &&
          startCont === endCont &&
          start > 0 &&
          end === startCont.textContent?.length
        ) {
          unwrapEnd(targetElement, start, end, parent);
        }

        // ---- UNBOLDEN BETWEEN
        else if (
          parent &&
          startCont === endCont &&
          start > 0 &&
          endCont.textContent &&
          end < endCont.textContent.length
        ) {
          unwrapBetween(
            targetElement,
            start,
            end,
            parent,
            format,
            currentRange
          );
        }

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
      <div
        className="bg-slate-400 w-full h-full"
        contentEditable="true"
        id="father"
        onKeyDown={handleKeyDown}
      >
        <div>
          <span>HELLO EVERY NYAN!</span>
        </div>
      </div>
    </div>
  );
};

export default Editor;
