import React, { useState } from "react";
import {
  findToggleState2,
  findToggleVariation,
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

  function toggleFormat(format: string) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const currentRange = selection.getRangeAt(0);

      if (currentRange.collapsed) {
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
          const { trueContainer, startOffset, endOffset } = unwrapAll(
            targetElement,
            format,
            selection,
            currentRange,
            setFormatting,
            removeTag
          );

          // ---- Programmatically Set & Select the New Range
          if (trueContainer) {
            const newRange = document.createRange();
            newRange.setStart(trueContainer, startOffset);
            newRange.setEnd(trueContainer, endOffset);

            selection.addRange(newRange);
          }
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
        wrapAll(currentRange, format, selection, targetElement);
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
      >
        <span>Hello, World!</span> <br />
        <span>
          We are <em>testing</em> and <em>testing</em> and <strong>tes</strong>
          ti<strong>ng</strong> and test<strong>in</strong>g this and that that
          that that <strong>BULLSHIT</strong>
        </span>
      </div>
    </div>
  );
};

export default Editor;
