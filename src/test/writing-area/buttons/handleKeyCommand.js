import { EditorState, Modifier, RichUtils, SelectionState } from 'draft-js';

export default function handleKeyCommand(command, editorState, onChange) {
  if (command === 'backspace') {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    let linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

    // Check if the cursor is at the end of a link
    if (!linkKey && startOffset > 0) {
      linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset - 1);
    }

    if (linkKey) {
      const block = contentState.getBlockForKey(startKey);
      let linkRange;
      block.findEntityRanges(
        (character) => character.getEntity() === linkKey,
        (start, end) => {
          linkRange = {
            start,
            end,
          };
        }
      );

      const newSelection = selection.merge({
        anchorOffset: linkRange.start,
        focusOffset: linkRange.end,
      });

      // Select the entire link text
      const newState = EditorState.forceSelection(editorState, newSelection);
      onChange(newState);

      // Remove the entire link
      const newContentState = Modifier.removeRange(
        contentState,
        newSelection,
        'backward'
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'remove-range'
      );
      onChange(newEditorState);
      return 'handled';
    }
  }
  return 'not-handled';
}
