export default function getEntity (editorState)  {
    const selectionState = editorState.getSelection();
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const currentContent = editorState.getCurrentContent();
    const selectedBlock = currentContent.getBlockForKey(selectionState.getStartKey());
    const selectedText = selectedBlock.getText().slice(start, end);
    let url;
    const entityKey = selectedBlock.getEntityAt(start);
    if (entityKey) {
      const entity = currentContent.getEntity(entityKey);
      if (entity.getType() === 'LINK') {
            url = entity.getData().url;
      }
    }
    return {
        selectedText,
        url
    };

  };