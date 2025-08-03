import { EditorState } from 'draft-js';

export function selectTextInCurrentBlock(editorState) {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const focusKey = selectionState.getFocusKey();
  const contentState = editorState.getCurrentContent();
  const anchorBlock = contentState.getBlockForKey(anchorKey);
  const focusBlock = contentState.getBlockForKey(focusKey);
  let startKey, endKey, startOffset, endOffset;
  if (selectionState.getIsBackward()) {
    startKey = focusKey;
    endKey = anchorKey;
    startOffset = 0;
    endOffset = anchorBlock.getLength();
  } else {
    startKey = anchorKey;
    endKey = focusKey;
    startOffset = 0;
    endOffset = focusBlock.getLength();
  }
  const newSelectionState = selectionState.merge({
    anchorKey: startKey,
    anchorOffset: startOffset,
    focusKey: endKey,
    focusOffset: endOffset,
    isBackward: false,
  });
  const newEditorState = EditorState.forceSelection(editorState, newSelectionState);
  return newEditorState;
}

export function deselectText(editorState) {
  const selectionState = editorState.getSelection();
  const newSelectionState = selectionState.merge({
    anchorKey: selectionState.getAnchorKey(),
    anchorOffset: selectionState.getAnchorOffset(),
    focusKey: selectionState.getAnchorKey(),
    focusOffset: selectionState.getAnchorOffset(),
    isBackward: false,
  });
  const newEditorState = EditorState.forceSelection(editorState, newSelectionState);

  return newEditorState;
}

export default function applyCallbackToSelectedText(editorState, callback = e => e) {
  const currentSelectionState = editorState.getSelection();
  const newEditorState = selectTextInCurrentBlock(editorState);
  const updatedEditorState = callback(newEditorState);
  const finalEditorState = EditorState.forceSelection(updatedEditorState, currentSelectionState);
  return finalEditorState;
}

// const contentState = editorState.getCurrentContent();
//   contentState.getBlockMap().forEach(block => {
//     block.findStyleRanges(
//       () => true,
//       (start, end) => {
//         const styles = contentState
//           .getBlockForKey(block.getKey())
//           .getInlineStyleAt(start)
//           .toJS();
//         console.log(`Styles applied from ${start} to ${end}:`, styles);
//       }
//     );
//   });