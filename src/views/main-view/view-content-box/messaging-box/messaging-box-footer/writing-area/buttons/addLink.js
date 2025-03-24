import { EditorState, Modifier } from "draft-js";

export default function addLink(editorState, text, url) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endOffset = selectionState.getEndOffset();
  const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
  let newEditorState;

  const linkKeyAtStart = blockWithLinkAtBeginning.getEntityAt(startOffset);
  const linkKeyAtEnd = blockWithLinkAtBeginning.getEntityAt(endOffset - 1);

  const linkKey = linkKeyAtStart || linkKeyAtEnd;

  let linkRangeStart = startOffset;
  let linkRangeEnd = endOffset;

  if (linkKey) {
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

    const newSelection = selectionState.merge({
      anchorOffset: linkRangeStart,
      focusOffset: linkRangeEnd,
    });

    const contentStateWithoutLink = Modifier.applyEntity(
      contentState,
      newSelection,
      null
    );

    const contentStateWithNewText = Modifier.replaceText(
      contentStateWithoutLink,
      newSelection,
      text
    );

    const contentStateWithEntity = contentStateWithNewText.createEntity(
      "LINK",
      "MUTABLE",
      { url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newSelectionWithNewText = newSelection.merge({
      focusOffset: linkRangeStart + text.length,
    });

    const contentStateWithLink = Modifier.applyEntity(
      contentStateWithEntity,
      newSelectionWithNewText,
      entityKey
    );

    newEditorState = EditorState.push(
      editorState,
      contentStateWithLink,
      "apply-entity"
    );
  } else {
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const contentStateWithNewText = Modifier.replaceText(
      contentState,
      selectionState,
      text,
      null,
      entityKey
    );

    newEditorState = EditorState.push(
      editorState,
      contentStateWithNewText,
      "insert-characters"
    );
  }
  return deselectAndMoveCursorToEnd(newEditorState);
}

export function deselectAndMoveCursorToEnd(editorState) {
  const selectionState = editorState.getSelection();
  // const endKey = selectionState.getEndKey();
  const endOffset = selectionState.getEndOffset();
  const newSelection = selectionState.merge({
    anchorOffset: endOffset,
    focusOffset: endOffset,
    isBackward: false,
  });
  const newEditorState = EditorState.forceSelection(editorState, newSelection);
  return newEditorState;
}
