export default function getLinkInSelection(editorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endOffset = selectionState.getEndOffset();
  const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);

  // Check if there's a link entity at the start or end of the selection
  const linkKeyAtStart = blockWithLinkAtBeginning.getEntityAt(startOffset);
  const linkKeyAtEnd = blockWithLinkAtBeginning.getEntityAt(endOffset - 1);

  const linkKey = linkKeyAtStart || linkKeyAtEnd;

  if (linkKey) {
    const linkInstance = contentState.getEntity(linkKey);
    if (linkInstance.getType() === "LINK") {
      // Find the range of the link
      let linkRangeStart = startOffset;
      let linkRangeEnd = endOffset;

      while (
        linkRangeStart > 0 &&
        blockWithLinkAtBeginning.getEntityAt(linkRangeStart - 1) === linkKey
      ) {
        linkRangeStart--;
      }

      while (
        linkRangeEnd < blockWithLinkAtBeginning.getLength() &&
        blockWithLinkAtBeginning.getEntityAt(linkRangeEnd) === linkKey
      ) {
        linkRangeEnd++;
      }

      // Ensure the entire selection is within the link
      if (
        blockWithLinkAtBeginning.getEntityAt(linkRangeStart) === linkKey &&
        blockWithLinkAtBeginning.getEntityAt(linkRangeEnd - 1) === linkKey
      ) {
        const linkText = blockWithLinkAtBeginning
          .getText()
          .slice(linkRangeStart, linkRangeEnd);
        const linkData = linkInstance.getData();
        return {
          url: linkData.url,
          text: linkText,
        };
      }
    }
  }
  return null;
}

export function getSelectedText(editorState) {
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const startOffset = selectionState.getStartOffset();
  const endOffset = selectionState.getEndOffset();
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();

  let selectedText = "";

  blockMap.forEach((block) => {
    const key = block.getKey();
    if (key === startKey && key === endKey)
      selectedText += block.getText().slice(startOffset, endOffset);
    else if (key === startKey)
      selectedText += block.getText().slice(startOffset) + "\n";
    else if (key === endKey)
      selectedText += block.getText().slice(0, endOffset);
    else if (selectionState.hasEdgeWithin(key, 0, block.getLength()))
      selectedText += block.getText() + "\n";
  });

  return selectedText;
}
