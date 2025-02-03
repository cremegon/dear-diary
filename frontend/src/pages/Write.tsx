import React, { useState } from "react";

export const Editor = () => {
  const [formatting, setFormatting] = useState({
    strong: false,
    em: false,
    underline: false,
  });

  let range: Range | null | void = null;

  function getTrueOffset(target: Node, parent: Node) {
    let offset = 0;
    let current = target;
    console.log("SEARCHING FOR TRUE OFFSET PARENT: ", parent);

    while (current && current !== parent) {
      console.log("SEARCH FOR TRUEOFFSET child: ", current);
      if (current.previousSibling) {
        current = current.previousSibling;
        if (current.previousSibling?.textContent) {
          offset += current.previousSibling?.textContent.length;
        }
      }
      current = current.parentNode ? current.parentNode : current;
    }
    return offset;
  }

  function findToggleState(format: string): [boolean, Node | null] {
    let result: [boolean, Node | null] = [false, null];
    const selection = window.getSelection();
    if (selection && selection?.rangeCount > 0) {
      console.log("STARTING RANGE: ", range);
      const currentRange = range ? range : selection.getRangeAt(0);

      let current = currentRange?.commonAncestorContainer;

      let prev = current;
      while (current.hasChildNodes() && current.firstChild) {
        prev = current;
        current = current.firstChild;
      }
      if (!current) {
        current = prev;
      }
      const targetElement = current.parentNode;

      if (current) {
        const targetTagName = format.toUpperCase();

        while (
          current.nodeName !== "SPAN" &&
          current.nodeName !== targetTagName &&
          current.parentNode
        ) {
          current = current.parentNode;
        }

        if (current.nodeName === "SPAN") {
          result = [false, targetElement];
          return result;
        }
      }
      result = [true, targetElement];
      return result;
    }
    return result;
  }

  function toggleFormat(format: string) {
    const trueToggle = findToggleState(format);
    const removeTag = trueToggle[0];
    let targetElement = trueToggle[1];

    setFormatting((prev) => ({ ...prev, [format]: trueToggle[0] }));
    console.log(formatting[format], trueToggle[0]);

    const selection = window.getSelection();
    if (selection && selection?.rangeCount > 0) {
      const currentRange = range ? range : selection.getRangeAt(0);

      // ---- Remove Tag: Select Parent Element and Traverse Up
      while (removeTag && targetElement) {
        const start = currentRange.startOffset;
        const end = currentRange.endOffset;
        const parent = targetElement.parentNode;
        console.log(currentRange);

        // ---- If the selection is the whole Tag, then remove the whole tag
        if (
          currentRange.startContainer === currentRange.endContainer &&
          currentRange.startOffset === 0 &&
          currentRange.endOffset ===
            currentRange.startContainer.textContent?.length
        ) {
          console.log("Removing Full Tag...");
          let siblingTarget = true;
          let startOffset = 0;
          let endOffset = currentRange.endOffset - currentRange.startOffset;
          const newEndOffset = currentRange.endOffset;

          const targetTagName = format.toUpperCase();
          const textNode = targetElement.lastChild;
          while (targetElement && targetElement.nodeName !== targetTagName) {
            targetElement = targetElement.parentNode;
          }

          if (!targetElement) {
            return;
          }

          console.log(targetElement.childNodes);

          if (parent?.nodeName === "SPAN") {
            let seen = false;
            const TargetElementArray = Array.from(targetElement.childNodes);
            for (const element of TargetElementArray) {
              if (element.nodeType !== Node.TEXT_NODE) {
                seen = true;
                break;
              }
            }
            if (!seen) {
              siblingTarget = false;
            }
          }

          const contentParent = targetElement?.parentNode;

          while (targetElement && targetElement.firstChild) {
            targetElement.parentNode?.insertBefore(
              targetElement.firstChild,
              targetElement
            );
          }

          console.log(contentParent?.childNodes);

          if (!siblingTarget && contentParent) {
            const trueOffset = getTrueOffset(targetElement, contentParent);
            console.log(trueOffset, currentRange.endOffset);
            startOffset = 0 + trueOffset;
            endOffset = newEndOffset + trueOffset;
          }

          // ---- Remove Element & Cleanup Empty Space
          contentParent?.removeChild(targetElement);
          contentParent?.normalize();
          setFormatting((prev) => ({ ...prev, [format]: !trueToggle }));
          selection.removeAllRanges();

          // ---- Define the New Range
          const newRange = document.createRange();
          let trueContainer: Node | undefined = undefined;

          if (textNode) {
            trueContainer =
              contentParent?.childNodes[
                Array.from(contentParent.childNodes).indexOf(textNode)
              ];
          } else {
            trueContainer = undefined;
          }

          if (!trueContainer && contentParent?.childNodes) {
            const NodeArray = Array.from(contentParent?.childNodes);
            let fragmentSearch: number | undefined = undefined;

            NodeArray.forEach((element, idx) => {
              if (textNode?.textContent) {
                fragmentSearch = element.textContent?.indexOf(
                  textNode?.textContent
                );
              } else {
                fragmentSearch = -1;
              }

              if (fragmentSearch !== -1) {
                trueContainer = contentParent?.childNodes[idx];
                if (trueContainer?.nodeName !== "SPAN") {
                  while (trueContainer?.firstChild) {
                    trueContainer = trueContainer.firstChild;
                  }
                }
                console.log("RESULT FROM SEARCH: ", trueContainer);
                return;
              }
            });
          }

          if (!trueContainer) {
            return;
          }

          console.log("CURRENT PARENT AFTER TAG REMOVAL", contentParent);
          console.log(contentParent?.childNodes, textNode);
          console.log("RANGE DETAILS: ", trueContainer, startOffset, endOffset);

          // ---- Programmatically Set & Select the New Range
          console.log(trueContainer, startOffset, endOffset);
          newRange.setStart(trueContainer, startOffset);
          newRange.setEnd(trueContainer, endOffset);

          range = selection.addRange(newRange);
        }

        // ---- UNBOLDEN START
        else if (
          currentRange.startContainer === currentRange.endContainer &&
          currentRange.startOffset === 0 &&
          currentRange.startContainer.textContent &&
          currentRange.endOffset <
            currentRange.startContainer.textContent?.length
        ) {
          if (!targetElement.textContent) {
            return;
          }
          console.log("UNBOLDEN START");
          const textBefore = targetElement.textContent.slice(start, end);
          targetElement.textContent = targetElement.textContent.slice(
            end,
            targetElement.textContent.length
          );
          const textBeforeNode = document.createTextNode(textBefore);
          parent?.insertBefore(textBeforeNode, targetElement);
        }

        // ---- UNBOLDEN END
        else if (
          currentRange.startContainer === currentRange.endContainer &&
          currentRange.startOffset > 0 &&
          currentRange.endOffset ===
            currentRange.startContainer.textContent?.length
        ) {
          if (!targetElement.textContent) {
            return;
          }
          console.log("UNBOLDEN END");
          const textAfter = targetElement.textContent.slice(start, end);
          targetElement.textContent = targetElement.textContent.slice(0, start);
          const textAfterNode = document.createTextNode(textAfter);

          if (!targetElement.nextSibling) {
            targetElement.parentElement?.appendChild(textAfterNode);
            return;
          }
          targetElement.parentNode?.insertBefore(
            textAfterNode,
            targetElement.nextSibling
          );
        }

        // ---- UNBOLDEN BETWEEN
        else if (
          currentRange.startContainer === currentRange.endContainer &&
          currentRange.startOffset > 0 &&
          currentRange.endContainer.textContent &&
          currentRange.endOffset < currentRange.endContainer.textContent.length
        ) {
          if (!targetElement.textContent) {
            return;
          }
          console.log("UNBOLDEN END");
          const textBetween = targetElement.textContent.slice(start, end);
          const textBefore = targetElement.textContent.slice(0, start);
          const textAfter = targetElement.textContent.slice(
            end,
            currentRange.startContainer.textContent?.length
          );

          // ---- Create The Before Tag
          const textBeforeTag = document.createElement(format);
          textBeforeTag.append(textBefore);

          // ---- Create The Between Node
          const textBetweenTag = document.createTextNode(textBetween);

          // ---- Create the After Tag
          const textAfterTag = document.createElement(format);
          textAfterTag.append(textAfter);

          const nextSibling = targetElement.nextSibling;
          parent?.removeChild(targetElement);

          if (!nextSibling) {
            parent?.appendChild(textBeforeTag);
            parent?.appendChild(textBetweenTag);
            parent?.appendChild(textAfterTag);
            return;
          }

          parent?.insertBefore(textBeforeTag, nextSibling);
          parent?.insertBefore(textBetweenTag, nextSibling);
          parent?.insertBefore(textAfterTag, nextSibling);
        }

        console.log(document.getElementById("father")?.innerHTML);
        console.log(document.getElementById("father")?.lastChild?.childNodes);
        return;
      }

      // ---- Add Tag: Extract Content, Wrap it in a created Element
      {
        console.log("Adding Tag...");
        const endOffset = currentRange.endOffset - currentRange.startOffset;

        if (currentRange) {
          const fragment = currentRange.extractContents();
          const wrappedNode = document.createElement(format);
          wrappedNode.appendChild(fragment);
          currentRange.insertNode(wrappedNode);
          selection.removeAllRanges();

          // ---- Define New Range
          const newRange = document.createRange();
          const trueContainer = wrappedNode.firstChild
            ? wrappedNode.firstChild
            : wrappedNode;

          console.log("BITCH: ", 0, endOffset);

          try {
            newRange.setStart(trueContainer, 0);
            newRange.setEnd(trueContainer, endOffset);

            range = selection.addRange(newRange);
          } catch (error) {
            console.log(error);
          }

          console.log(document.getElementById("father")?.innerHTML);
        }
      }
      console.log("NEW RANGE: ", range);
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
        // onMouseMoveCapture={() => console.log(range)}
        className="bg-slate-400 w-full h-full"
        contentEditable="true"
        id="father"
        onClick={() => (range = null)}
      >
        <span>Hello, World!</span> <br />
        <span>
          We are <strong>testing</strong> this <strong>BULLSHIT</strong>
        </span>
      </div>
    </div>
  );
};

export default Editor;
