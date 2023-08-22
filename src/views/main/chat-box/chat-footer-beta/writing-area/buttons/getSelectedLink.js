export default function getSelectedLink(editorState) {
  const selection = editorState.getSelection();
  if (!selection.isCollapsed()) {
    const contentState = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

    let linkData = { url: null, text: null };
    if (linkKey) {
      const linkInstance = contentState.getEntity(linkKey);
      linkData.url = linkInstance.getData().url;
    }

    // Get the selected text
    const startBlock = contentState.getBlockForKey(selection.getStartKey());
    const endBlock = contentState.getBlockForKey(selection.getEndKey());
    let selectedText = '';
    if (startBlock === endBlock) {
      selectedText = startBlock.getText().slice(selection.getStartOffset(), selection.getEndOffset());
    } else {
      selectedText += startBlock.getText().slice(selection.getStartOffset()) + '\n';
      let currentBlockKey = contentState.getKeyAfter(startBlock.getKey());
      while (currentBlockKey !== endBlock.getKey()) {
        const currentBlock = contentState.getBlockForKey(currentBlockKey);
        selectedText += currentBlock.getText() + '\n';
        currentBlockKey = contentState.getKeyAfter(currentBlock.getKey());
      }
      selectedText += endBlock.getText().slice(0, selection.getEndOffset());
    }
    linkData.text = selectedText;

    return linkData;
  }
  return null;
}
