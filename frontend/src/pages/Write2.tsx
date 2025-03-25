import React, { useState, useRef, useEffect } from "react";
import {
  addNewLine,
  backSpaceCheck,
  checkAndPlaceCaret,
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

  // ---- Now the only other edge case to add is this:
  // ---- when you select a range of words in father
  // ----

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

  useEffect(() => {
    async function loadContent() {
      const response = await loadFromDatabase(params);
      try {
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        requestAnimationFrame(() => {
          if (editorRef.current) {
            console.log(editorRef);
            editorRef.current.innerHTML = response.data[1];
          }
          console.log(response.data);
          setTitle(response.data[0]);
          setFontSize(response.data[2]);
          setSelectedFont(response.data[3]);
        });
      }
    }

    loadContent();
  }, [params]);

  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => {
        if (!editorRef.current) {
          console.log("no editorref present");
          return;
        }
        editorRef.current.focus();
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(editorRef.current);
        const span = range.startContainer.lastChild?.lastChild;
        let startContainer =
          span?.lastChild?.nodeName !== "BR"
            ? span?.lastChild
            : span.lastChild.previousSibling;

        while (startContainer?.firstChild) {
          startContainer = startContainer.firstChild;
        }
        const offset = startContainer?.textContent?.length || 0;

        if (!startContainer) return;

        range.setStart(startContainer, offset);
        range.setEnd(startContainer, offset);

        selection?.removeAllRanges();
        selection?.addRange(range);
      });
    }
  }, [loading]);

  if (loading) return <div>Loading...</div>;

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
        <select className="btn-writeUI" value={selectedFont}>
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
        <button className="btn-writeUI" onClick={() => setTextAlign("center")}>
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
        ref={editorRef}
        contentEditable="true"
        id="father"
        onClick={() => checkAndPlaceCaret()}
        onKeyDown={(e) => addNewLine(e)}
        onKeyUp={(e) => backSpaceCheck(e, father as Element)}
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
