export function findToggleVariation(currentRange: Range) {
  const hashmap = {};

  const content = currentRange.cloneContents();
  const selectionArray = content.childNodes;
  for (const element of selectionArray) {
    const ele = element.nodeName.toLocaleLowerCase();
    hashmap[ele] = (hashmap[ele] || 0) + 1;
  }
  console.log("hello:3");
  const maxValue = Math.max(...(Object.values(hashmap) as number[]));
  const minValue = Math.min(...(Object.values(hashmap) as number[]));
  const minKey = Object.keys(hashmap).find((key) => hashmap[key] === minValue);

  if (maxValue === selectionArray.length) return false;

  for (let i = 0; i < selectionArray.length; i++) {
    const element = selectionArray[i];
    console.log(element, minKey);
    if (element.nodeType !== Node.TEXT_NODE) {
      const newElement = document.createTextNode(
        element.lastChild?.textContent as string
      );
      content.replaceChild(newElement, element);
    }
  }
  if (minKey === "#text") {
    const newContent = content;
    currentRange.deleteContents();
    currentRange.insertNode(newContent);
    return true;
  }
  const newContent = document.createElement(`${minKey}`);
  newContent.append(content);

  console.log("final content = ", newContent);

  currentRange.deleteContents();
  currentRange.insertNode(newContent);
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

export function getTrueOffset(target: Node, parent: Node) {
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

export function wrapAll(
  currentRange: Range,
  format: string,
  selection: Selection
) {
  console.log("Adding Tag...");
  const endOffset = currentRange.endOffset - currentRange.startOffset;
  if (currentRange) {
    const wrappedNode = document.createElement(format);
    const fragment = currentRange.extractContents();

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

      selection.addRange(newRange);
    } catch (error) {
      console.log(error);
    }
  }
}

export function unwrapAll(
  targetElement: Node,
  format: string,
  selection: Selection,
  currentRange: Range,
  parent: Node,
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
  let siblingTarget = true;
  let startOffset = 0;
  let endOffset = currentRange.endOffset - currentRange.startOffset;
  const newEndOffset = currentRange.endOffset;
  const targetTagName = format.toUpperCase();
  const textNode = targetElement.lastChild;

  while (targetElement.parentNode && targetElement.nodeName !== targetTagName) {
    targetElement = targetElement.parentNode;
  }

  if (!targetElement) {
    return {
      trueContainer: null,
      startOffset: null,
      endOffset: null,
    };
  }

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

  if (!siblingTarget && contentParent) {
    const trueOffset = getTrueOffset(targetElement, contentParent);
    console.log(trueOffset, currentRange.endOffset);
    startOffset = 0 + trueOffset;
    endOffset = newEndOffset + trueOffset;
  }

  // ---- Remove Element & Cleanup Empty Space
  contentParent?.removeChild(targetElement);
  contentParent?.normalize();
  setFormatting((prev) => ({ ...prev, [format]: !removeTag }));
  selection.removeAllRanges();

  // ---- Define the New Range
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
        fragmentSearch = element.textContent?.indexOf(textNode?.textContent);
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
    return {
      trueContainer: null,
      startOffset: null,
      endOffset: null,
    };
  }

  console.log("CURRENT PARENT AFTER TAG REMOVAL", contentParent);
  console.log(contentParent?.childNodes, textNode);
  console.log("RANGE DETAILS: ", trueContainer, startOffset, endOffset);

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
