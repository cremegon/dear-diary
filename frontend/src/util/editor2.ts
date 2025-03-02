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

  const actualTextSearch = currentRange.toString().normalize();
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

  while (
    current.previousSibling?.textContent &&
    current.previousSibling.nodeType === Node.TEXT_NODE
  ) {
    console.log("SEARCH FOR TRUEOFFSET child: ", current.previousSibling);

    offset += current.previousSibling?.textContent.length;
    current = current.previousSibling;
  }
  console.log("returned offset = ", offset);
  return offset;
}

export function wrapAll(
  currentRange: Range,
  format: string,
  selection: Selection,
  targetNode: Node
) {
  console.log("Adding Tag...");
  console.log(targetNode);
  const endOffset = currentRange.endOffset - currentRange.startOffset;
  const wrappedNode = document.createElement(format);
  const fragment = currentRange.extractContents();

  wrappedNode.appendChild(fragment);

  currentRange.insertNode(wrappedNode);
  selection.removeAllRanges();

  // ---- Define New Range
  const newRange = document.createRange();
  const trueContainer = wrappedNode.lastChild
    ? wrappedNode.lastChild
    : wrappedNode;

  try {
    newRange.setStart(trueContainer, 0);
    newRange.setEnd(trueContainer, endOffset);

    selection.addRange(newRange);
  } catch (error) {
    console.log(error);
  }
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
  console.log("Removing Full Tag...");
  console.log(
    "target node = ",
    targetElement,
    "target element = ",
    targetElement.previousSibling
  );

  let parentNode = targetElement;
  let trueContainer: Node | null = null;

  while (parentNode.parentNode && parentNode.nodeName !== "SPAN") {
    parentNode = parentNode.parentNode;
  }

  const trueOffset =
    targetElement.childNodes.length <= 2 ? getTrueOffset(targetElement) : 0;
  const startOffset = currentRange.startOffset + trueOffset;
  const endOffset = currentRange.endOffset + trueOffset;
  const contentParent = targetElement?.parentNode;

  const previousSibling = targetElement?.previousSibling;
  const previousContent = previousSibling?.lastChild?.textContent
    ? previousSibling?.lastChild?.textContent
    : previousSibling?.textContent;

  let prevPrev = targetElement;
  while (prevPrev.parentNode && prevPrev.parentNode.nodeName !== "SPAN") {
    prevPrev = prevPrev.parentNode;
  }

  const prevPrevSibling = prevPrev.previousSibling?.previousSibling
    ? prevPrev.previousSibling.previousSibling
    : parentNode.firstChild;
  console.log(
    "prevprevprev",
    prevPrev.previousSibling,
    prevPrev.previousSibling?.previousSibling
  );

  // ---- Move Content Out of Tag Being Removed
  while (targetElement && targetElement.firstChild) {
    if (targetElement.firstChild.textContent?.trim() === "") {
      console.log("removing something = ", targetElement.firstChild);
      targetElement.removeChild(targetElement.firstChild);
    } else {
      console.log("throwing it back = ", targetElement.firstChild);
      targetElement.parentNode?.insertBefore(
        targetElement.firstChild,
        targetElement
      );
    }
  }

  const previousCurrent = targetElement.previousSibling;
  const currentContent = previousCurrent?.lastChild?.textContent
    ? previousCurrent?.lastChild?.textContent
    : previousCurrent?.textContent;

  const nextSibling = targetElement.nextSibling;
  const nextContent =
    nextSibling?.nodeType === Node.TEXT_NODE ? nextSibling.textContent : "";

  // ---- Remove Element & Cleanup Empty Space
  contentParent?.removeChild(targetElement);
  contentParent?.normalize();
  setFormatting((prev) => ({ ...prev, [format]: !removeTag }));
  selection.removeAllRanges();

  // if the previous Sibling and current Nodes are both TextNodes

  if (
    previousSibling?.nodeType === Node.TEXT_NODE &&
    previousCurrent?.nodeType === Node.TEXT_NODE &&
    previousContent &&
    currentContent
  ) {
    // If both will become textNodes, then combined their
    // texts, make a new textNode ouf of them and delete
    // the rest
    const updatedElement = document.createTextNode(
      previousContent + currentContent + nextContent
    );

    parentNode.replaceChild(updatedElement, previousSibling);
    trueContainer = updatedElement;
  } else {
    console.log(
      "different previous container",
      //   parentNode.childNodes,
      prevPrevSibling?.nextSibling?.childNodes,
      prevPrevSibling?.nextSibling
    );
    trueContainer = prevPrevSibling?.nextSibling?.lastChild?.textContent
      ? prevPrevSibling?.nextSibling.lastChild
      : prevPrevSibling?.nextSibling;
    console.log(trueContainer);
  }

  // ---- Define the New Range

  console.log(document.getElementById("father")?.childNodes);
  console.log(trueContainer, startOffset, endOffset, trueOffset);

  return {
    trueContainer: trueContainer,
    startOffset: startOffset,
    endOffset: endOffset,
  };

  // ---- Programmatically Set & Select the New Range
  //   console.log(trueContainer, startOffset, endOffset);
  //   newRange.setStart(trueContainer, startOffset);
  //   newRange.setEnd(trueContainer, endOffset);

  //   selection.addRange(newRange);
}

export function unwrapStart(
  targetElement: Node,
  start: number,
  end: number,
  parent: Node
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
