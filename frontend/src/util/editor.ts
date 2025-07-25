import React from "react";

export function treeWalkerSearch(currentRange: Range) {
  function calculateRectDistance(rect1: DOMRect, rect2: DOMRect) {
    const center1 = {
      x: rect1.left + rect1.width / 2,
      y: rect1.top + rect1.height / 2,
    };
    const center2 = {
      x: rect2.left + rect2.width / 2,
      y: rect2.top + rect2.height / 2,
    };

    const dx = center1.x - center2.x;
    const dy = center1.y - center2.y;

    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  let closestDistance = Infinity;
  let closestTextNode: Text | null = null;

  const actualTextSearch = currentRange.toString().trim();
  const actualRect = currentRange.getBoundingClientRect();

  console.log("Finding True Node = ", actualTextSearch);

  const editableFather = document.getElementById("father");

  if (!editableFather) return;

  const walker = document.createTreeWalker(
    editableFather,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return node.textContent?.includes(actualTextSearch)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  let textNode: Text | null;
  while ((textNode = walker.nextNode() as Text | null)) {
    const range = document.createRange();
    range.selectNodeContents(textNode);
    const rect = range.getBoundingClientRect();
    const distance = calculateRectDistance(actualRect, rect);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestTextNode = textNode;
    } else if (distance > closestDistance) {
      break;
    }
  }
  console.log("True Returned Node = ", closestTextNode);
  return closestTextNode as Node;
}

export function findToggleVariation(currentRange: Range, selection: Selection) {
  const hashmap = {};

  // ---- Create a Document Fragment from the Selection
  const content = currentRange.cloneContents();
  const selectionArray = content.childNodes;

  // ---- Count the Highest and Lowest Frequency Element/Text Node
  for (const element of selectionArray) {
    const ele = element.nodeName.toLocaleLowerCase();
    hashmap[ele] = (hashmap[ele] || 0) + 1;
  }

  const maxValue = Math.max(...(Object.values(hashmap) as number[]));
  const minValue = Math.min(...(Object.values(hashmap) as number[]));
  const minKey = Object.keys(hashmap).find((key) => hashmap[key] === minValue);

  // ---- If the Max Value === Fragment Length => No Variation
  if (maxValue === selectionArray.length) return false;

  // ---- Build a String of All ChildNode textContents
  let textContent = "";
  for (const element of selectionArray) {
    textContent +=
      element.lastChild !== null
        ? element.lastChild.textContent
        : element.textContent;
  }

  // ---- Create the TextNode & Remove Data Inside Range
  const newContent = document.createTextNode(textContent);
  currentRange.deleteContents();

  if (minKey === "#text") {
    currentRange.insertNode(newContent);
  } else {
    const newElement = document.createElement(`${minKey}`);
    newElement.appendChild(newContent);
    currentRange.insertNode(newElement);
  }

  // ---- Incase Not All the Data was deleted, Manually set
  // ---- the range to the new TextNode and check left & right
  const startOffset = 0;
  const endOffset = textContent.length;
  const trueContainer = treeWalkerSearch(currentRange);

  if (!trueContainer) return;

  // ---- Find Span Parent
  let current = trueContainer;
  while (current?.parentNode && current.nodeName !== "SPAN") {
    current = current.parentNode;
  }

  // ---- Adjust the Range to the Selected Node
  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.setStart(trueContainer, startOffset);
  newRange.setEnd(trueContainer, endOffset);
  selection.addRange(newRange);

  // ---- Check for Left & Right Empty Elements
  const previousTarget = trueContainer.previousSibling;
  const nextTarget = trueContainer.nextSibling;

  if (
    previousTarget?.ELEMENT_NODE &&
    previousTarget.textContent?.trim() === ""
  ) {
    current?.removeChild(previousTarget);
  }

  if (nextTarget?.ELEMENT_NODE && nextTarget.textContent?.trim() === "") {
    current?.removeChild(nextTarget);
  }

  console.log("final content = ", document.getElementById("father")?.innerHTML);
  return true;
}

export function findToggleState(
  format: string,
  currentRange: Range
): [boolean, Node | null] {
  const selection = window.getSelection();
  if (selection && selection?.rangeCount > 0) {
    let current = currentRange?.commonAncestorContainer;
    console.log(currentRange);
    console.log("CURRENT SELECTIONS = ", current.childNodes);

    // ---- REACH THE TEXT NODE
    while (current.hasChildNodes() && current.firstChild) {
      current = current.firstChild;
      console.log("GOING DEEPER INTO CURRENT = ", current);
    }

    // ---- IF NONE, GO UP TILL YOU FIND AN ELEMENT NODE
    if (!current) {
      while (
        current.parentNode &&
        current.parentNode.nodeType !== Node.ELEMENT_NODE
      ) {
        current = current.parentNode;
      }
    }

    // ---- LOWEST COMMON ANCESTOR CONFIRMED
    const targetElement = current.parentNode;
    console.log("FINAL CURRENT = ", targetElement);

    if (current) {
      const targetTagName = format.toUpperCase();

      // ---- TRAVERSE UP TILL YOU FIND MATCHING TAG
      while (
        current.nodeName !== "SPAN" &&
        current.nodeName !== targetTagName &&
        current.parentNode
      ) {
        current = current.parentNode;
      }

      // ---- IF THERE IS NONE, THEN THE SELECTION IS PURE TEXT
      if (current.nodeName === "SPAN") {
        return [false, targetElement];
      }
    }
    return [true, targetElement];
  }
  return [false, null];
}

export function findToggleState2(
  textNode: Node,
  format: string
): [boolean, Node | null] {
  const targetTagName = format.toUpperCase();
  let current = textNode;
  while (
    current.parentNode &&
    current.parentNode.nodeName !== "SPAN" &&
    current.parentNode.nodeName !== targetTagName
  ) {
    current = current.parentNode;
  }

  if (!current.parentNode) return [false, null];

  if (current.parentNode?.nodeName === "SPAN") {
    return [false, current];
  } else {
    return [true, current.parentNode];
  }
}

export function getTrueOffset(target: Node) {
  let offset = 0;
  let current = target;

  console.log("offset sibling = ", current.previousSibling);
  while (
    current.previousSibling &&
    current.previousSibling !== null &&
    current.previousSibling.nodeType === Node.TEXT_NODE
  ) {
    console.log("SEARCH FOR TRUEOFFSET child: ", current.previousSibling);

    offset += current.previousSibling?.textContent
      ? current.previousSibling.textContent.length
      : 0;
    current = current.previousSibling;
  }
  console.log("returned offset = ", offset);
  return offset;
}

export function wrapAll(
  currentRange: Range,
  format: string,
  selection: Selection,
  targetNode: Node,
  color: string
) {
  console.log("Adding Tag...");
  console.log(targetNode);
  console.log(currentRange);
  let endOffset = 0;
  const startOffset = 0;

  if (currentRange.startContainer !== currentRange.endContainer) {
    endOffset = currentRange.startContainer.textContent
      ? currentRange.startContainer.textContent.length -
        currentRange.startOffset
      : 0;
  } else {
    endOffset = currentRange.endOffset - currentRange.startOffset;
  }

  const wrappedNode = document.createElement(format);
  const fragment = currentRange.extractContents();

  if (wrappedNode.nodeName === "P") {
    wrappedNode.style.display = "inline";
    wrappedNode.style.color = color;
  }

  wrappedNode.appendChild(fragment);

  currentRange.insertNode(wrappedNode);
  selection.removeAllRanges();

  // ---- Define New Range
  const newRange = document.createRange();
  const trueContainer = wrappedNode.lastChild
    ? wrappedNode.lastChild
    : wrappedNode;

  console.log(trueContainer, startOffset, endOffset);
  try {
    newRange.setStart(trueContainer, startOffset);
    newRange.setEnd(trueContainer, endOffset - startOffset);

    selection.addRange(newRange);
  } catch (error) {
    console.log(error);
  }

  return trueContainer;
}

export function unwrapAll(
  targetElement: Node,
  format: string,
  selection: Selection,
  currentRange: Range,
  setFormatting: (
    value: React.SetStateAction<{
      strong: boolean;
      em: boolean;
      underline: boolean;
    }>
  ) => void,
  removeTag: boolean
) {
  console.log("Removing Full Tag...", targetElement);

  let parentNode = targetElement;
  while (parentNode.parentNode && parentNode.nodeName !== "SPAN") {
    parentNode = parentNode.parentNode;
  }

  console.log("???", targetElement.childNodes);

  const trueOffset =
    targetElement.firstChild?.nodeType === Node.TEXT_NODE
      ? getTrueOffset(targetElement)
      : 0;
  const startOffset = currentRange.startOffset + trueOffset;
  const endOffset = currentRange.endOffset + trueOffset;
  const spanParent = targetElement?.parentNode;

  // ---- Move Content Out of Tag Being Removed
  while (targetElement && targetElement.firstChild) {
    // ---- Remove Empty Text Nodes
    if (targetElement.firstChild.textContent?.trim() === "") {
      targetElement.removeChild(targetElement.firstChild);
    } else {
      // ---- Throwback Everything that's a Node/Text Node
      targetElement.parentNode?.insertBefore(
        targetElement.firstChild,
        targetElement
      );
    }
  }

  spanParent?.normalize();
  const previousCurrent = targetElement.previousSibling;

  // ---- Remove Element & Cleanup Empty Space
  spanParent?.removeChild(targetElement);
  spanParent?.normalize();
  setFormatting((prev) => ({ ...prev, [format]: !removeTag }));
  selection.removeAllRanges();

  // if the previous Sibling and current Nodes are both TextNodes
  const trueContainer = previousCurrent?.lastChild?.textContent
    ? previousCurrent.lastChild
    : previousCurrent;

  console.log(parentNode.childNodes);
  console.log(trueContainer, startOffset, endOffset, trueOffset);

  if (!trueContainer) return;

  // ---- Programmatically Set & Select the New Range
  try {
    const newRange = document.createRange();
    newRange.setStart(trueContainer, startOffset);
    newRange.setEnd(trueContainer, endOffset);
    selection.addRange(newRange);
  } catch (error) {
    console.log(error);
  }

  return trueContainer;
}

export function unwrapStart(
  targetElement: Node,
  start: number,
  end: number,
  parent: Node,
  selection: Selection
) {
  if (!targetElement.textContent) {
    return;
  }
  console.log("UNBOLDEN START");

  const trueOffset =
    targetElement.childNodes.length < 2 ? getTrueOffset(targetElement) : 0;

  const textBefore = targetElement.textContent.slice(start, end);
  targetElement.textContent = targetElement.textContent.slice(
    end,
    targetElement.textContent.length
  );
  const textBeforeNode = document.createTextNode(textBefore);
  parent?.insertBefore(textBeforeNode, targetElement);

  parent.normalize();

  const newRange = document.createRange();
  newRange.setStart(textBeforeNode, 0 + trueOffset);
  newRange.setEnd(textBeforeNode, textBefore.length + trueOffset);
  selection.removeAllRanges();
  selection.addRange(newRange);
}

export function unwrapEnd(
  targetElement: Node,
  start: number,
  end: number,
  parent: Node
) {
  if (!targetElement.textContent) {
    return;
  }
  console.log("UNBOLDEN END");
  const textAfter = targetElement.textContent.slice(start, end);
  targetElement.textContent = targetElement.textContent.slice(0, start);
  const textAfterNode = document.createTextNode(textAfter);

  if (!targetElement.nextSibling) {
    parent?.appendChild(textAfterNode);
    return;
  }
  parent?.insertBefore(textAfterNode, targetElement.nextSibling);
}

export function unwrapBetween(
  targetElement: Node,
  start: number,
  end: number,
  parent: Node,
  format: string,
  currentRange: Range
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

export function validSelection(currentRange: Range) {
  if (
    currentRange.collapsed ||
    (currentRange.commonAncestorContainer.nodeName === "SPAN" &&
      currentRange.startContainer !== currentRange.endContainer)
  ) {
    console.log("Aborting Selection...");
    return false;
  }
  return true;
}

export function removeFailedTag(node: Node) {
  let parent = node;
  while (parent.parentNode && parent.parentNode.nodeName !== "SPAN") {
    parent = parent.parentNode;
  }

  if (
    parent.previousSibling?.nodeType === node.ELEMENT_NODE &&
    parent.previousSibling.textContent?.trim() === "" &&
    parent.previousSibling.nodeName !== "BR"
  ) {
    parent.removeChild(parent.previousSibling);
  }
  if (
    parent.nextSibling?.nodeType === node.ELEMENT_NODE &&
    parent.nextSibling.textContent?.trim() === "" &&
    parent.nextSibling.nodeName !== "BR"
  ) {
    parent.removeChild(parent.nextSibling);
  }

  parent.normalize();
}

export function removeEmptySpaceAtStart(selection: Selection) {
  console.log("removing any empty space from start...");
  const currentRange = selection.getRangeAt(0);
  let current = currentRange.startContainer;
  while (current.parentNode && current.nodeName !== "SPAN") {
    current = current.parentNode;
  }
  console.log("the current CURRENT", current);
  console.log(current.firstChild?.textContent === "\u00A0");
  if (current.firstChild && current.firstChild.textContent === "\u00A0") {
    if (current.textContent && current.textContent.length > 0) {
      current.firstChild.textContent = "";
    }
  }
}

export function insertBlankTag(
  currentRange: Range,
  format: string,
  selection: Selection
) {
  console.log("Inserting Empty Tag...");
  const element = document.createElement(`${format}`);
  element.textContent = "\u200B";
  currentRange.insertNode(element);
  const trueContainer = element;
  console.log("true container's child = ", trueContainer.firstChild);

  const newRange = document.createRange();
  newRange.setStart(trueContainer, 1);

  newRange.collapse();
  selection.removeAllRanges();
  selection.addRange(newRange);
}

export function exitCurrentTag(currentRange: Range, selection: Selection) {
  console.log("Exiting Current Tag...");
  let current = currentRange.startContainer;
  while (current.parentNode && current.parentNode.nodeName !== "SPAN") {
    current = current.parentNode;
  }
  let next = current.nextSibling;

  if (!next) {
    const dummyText = document.createTextNode("\u200B");
    current.parentNode?.appendChild(dummyText);
    next = dummyText;
  } else if (next?.nodeType !== Node.TEXT_NODE) {
    const textNode = document.createTextNode("");
    current.parentNode?.insertBefore(textNode, next);
    next = textNode;
  }
  const dummyNode = document.createTextNode("\u200B");
  current.parentNode?.insertBefore(dummyNode, next);
  console.log("current exit next sibling:", current.nextSibling);
  console.log("before exiting, im here:", current);
  const newRange = document.createRange();
  newRange.setStart(next, 0);
  newRange.collapse(true);

  selection.removeAllRanges();
  selection.addRange(newRange);
  console.log(newRange);
}

export function addNewLine() {
  const selection = window.getSelection();
  if (!selection || selection?.rangeCount < 1) return;
  const currentRange = selection.getRangeAt(0);
  let the_end = false;

  // ---- Find the Current Selection's Span Node and Div Node
  let spanParent = currentRange.startContainer;
  while (spanParent.parentNode && spanParent.nodeName !== "SPAN") {
    spanParent = spanParent.parentNode;
  }
  const divParent = spanParent.parentNode;

  // ---- Find the Outermost Node of the Selection Container
  let selectionParent: Node | null = currentRange.startContainer;
  while (
    selectionParent.parentNode &&
    selectionParent.parentNode.nodeName !== "SPAN"
  ) {
    selectionParent = selectionParent.parentNode;
  }

  // ---- Define Start Offset as the current Caret Position
  // ---- Define End Offset as the Total Length of Container
  const startOffset = currentRange.startOffset;
  const endOffset = currentRange.startContainer.textContent
    ? currentRange.startContainer.textContent.length
    : 0;

  console.log(
    "NEW LINE PARAMS: <span,start,end>",
    selectionParent,
    startOffset,
    endOffset
  );

  // ---- Create new Div and Span to Insert
  const div = document.createElement("div");
  const span = document.createElement("span");
  span.innerHTML = "\u00A0";
  div.appendChild(span);

  // ---- New Line: If Caret is at the very beginning of the Line
  if (startOffset === 0 && !selectionParent.previousSibling) {
    console.log("Caret at Left...");

    while (spanParent.firstChild) {
      span.appendChild(spanParent.firstChild);
    }
    spanParent.textContent = "\u00A0";
  }

  // ---- New Line: If Caret is in-between a Text Node
  else if (startOffset > 0 && endOffset - startOffset > 1) {
    console.log("Caret in Between...", "currentRange:", currentRange);
    console.log("divparent:", divParent, "spanparent:", spanParent);

    // ---- Go Up and record every Element Node
    const elementArray: string[] = [];
    let current = currentRange.startContainer;

    if (current.nodeName === "SPAN") {
      divParent?.parentNode?.appendChild(div);
      console.log("poopdog");

      const newRange = document.createRange();
      newRange.setStart(span, 0);
      newRange.setEnd(span, 0);
      selection.removeAllRanges();
      selection.addRange(newRange);
      return;
    }
    while (current.parentNode && current.parentNode.nodeName !== "SPAN") {
      elementArray.push(current.parentNode.nodeName);
      current = current.parentNode;
    }

    console.log("element array:", elementArray);

    // ---- Slice the Text for the New Line
    const newLineText = currentRange.startContainer.textContent?.slice(
      startOffset,
      endOffset
    );

    // ---- Slice the Text on the Current Line
    const oldLineText = currentRange.startContainer.textContent?.slice(
      0,
      startOffset
    );
    currentRange.startContainer.textContent = oldLineText as string;

    // ---- Build the NewTextNode with/without Element Tags
    const newTextNode = document.createTextNode(newLineText as string);
    let wrappedNode: Node = newTextNode;

    for (const element of elementArray.reverse()) {
      console.log("inheriting tags!", wrappedNode);
      const newElement = document.createElement(element.toLowerCase());
      newElement.appendChild(wrappedNode);
      wrappedNode = newElement;
    }

    // ---- Append newTextNode to Span
    span.appendChild(wrappedNode);

    // ---- Append the rest of the Nodes after the newTextNode
    while (selectionParent.nextSibling) {
      span.appendChild(selectionParent.nextSibling);
    }
  }

  // ---- New Line: If Caret is at the end of a Node
  else if (
    startOffset === endOffset - 1 ||
    (startOffset === 0 && selectionParent.previousSibling)
  ) {
    the_end = true;
    console.log("Caret at Right...");
    if (startOffset === endOffset - 1) {
      console.log("caret right first");
      while (selectionParent.nextSibling) {
        span.appendChild(selectionParent.nextSibling);
      }
    } else {
      console.log("caret right second");
      while (selectionParent) {
        span.appendChild(selectionParent);
        selectionParent = selectionParent.nextSibling;
      }
    }
  }

  const trueContainer = divParent?.parentNode;

  if (divParent?.nextSibling) {
    console.log("In-between Line");
    trueContainer?.insertBefore(div, divParent?.nextSibling);
  } else {
    console.log("New Line");
    trueContainer?.appendChild(div);
  }

  try {
    const newRange = document.createRange();
    newRange.setStart(span, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    console.log("THE END?", the_end);
    if (!the_end) {
      const newSelection = window.getSelection();
      removeEmptySpaceAtStart(newSelection as Selection);
    }
  } catch (error) {
    console.log(error);
  }

  console.log(document.getElementById("father")?.childNodes);
}

export function cacheBeforeBackspace() {
  const selection = window.getSelection();
  const currentRange = selection?.getRangeAt(0);

  // ---- Select Span Container
  let node = currentRange?.startContainer;
  while (node && node.parentNode && node.nodeName !== "SPAN") {
    node = node.parentNode;
  }
  const span = node;

  if (
    span?.firstChild === currentRange?.startContainer &&
    currentRange?.startOffset === 0
  ) {
    return span;
  }
  return null;
}

export function checkOrPlaceCaret(father: Element, rangy: Window) {
  const selection = rangy.getSelection();
  if (!selection || selection?.rangeCount < 1) return null;

  if (
    !father.innerHTML ||
    father.innerHTML === "<br>" ||
    father.innerHTML === "<div><br></div>"
  ) {
    father.innerHTML = "";
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
    console.log("father not present");
  } else {
    return cacheBeforeBackspace();
  }
  console.log(father.innerHTML);
  return null;
}

export function handlePaste(e: React.ClipboardEvent) {
  console.log("pasting content...");
  e.preventDefault();
  const pastedContent = e.clipboardData.getData("text");

  const selection = window.getSelection();
  if (!selection || selection?.rangeCount < 1) return;
  const currentRange = selection.getRangeAt(0);
  let current = currentRange.startContainer;
  while (current.firstChild && current.nodeName !== "SPAN") {
    current = current.firstChild;
  }

  current.textContent = pastedContent;
  console.log("text content length:", current.textContent.length, current);

  if (!current.firstChild) return;
  const newRange = document.createRange();
  newRange.setStart(current.firstChild, current.textContent.length || 0);
  newRange.setEnd(current.firstChild, current.textContent.length || 0);
  selection.removeAllRanges();
  selection.addRange(newRange);
}

export function siblingMergeAfterBackspace() {
  const selection = window.getSelection();
  const currentRange = selection?.getRangeAt(0);

  // ---- Select Div Container
  let node = currentRange?.startContainer;
  while (node && node.parentNode && node.nodeName !== "SPAN")
    node = node.parentNode;
  const trueStartOffset = node?.textContent?.length || 0;
  const span = node;
  const next_span = span?.nextSibling;
  const div_node = span?.parentNode;
  console.log("neighbouring span => ", span, next_span, next_span?.nodeName);

  // For Browser Compatibility: If the browser sees the next span sibling as a span: treat it like this
  if (div_node && span && next_span && next_span?.nodeName === "SPAN") {
    console.log("importing next sibling as a SPAN...");
    while (next_span.firstChild) {
      span.appendChild(next_span.firstChild);
    }
    span.normalize();
    div_node.removeChild(next_span);
    if (span && span.firstChild) {
      const newRange = document.createRange();
      newRange.setStart(span.firstChild, trueStartOffset);
      newRange.collapse(true);

      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }
  }

  // If the browser sees the next span sibling as a textNode: do this
  else if (div_node && span && next_span && next_span.nodeName === "#text") {
    console.log("importing next sibling as a TEXT node...");
    span.appendChild(next_span);
    span.normalize();

    if (div_node.childNodes.length > 1) {
      div_node.removeChild(next_span);
    }

    if (span && span.firstChild) {
      const newRange = document.createRange();
      newRange.setStart(span.firstChild, trueStartOffset);
      newRange.collapse(true);

      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }
  }
}
