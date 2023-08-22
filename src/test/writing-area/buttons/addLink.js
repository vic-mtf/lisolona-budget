import { EditorState, Modifier } from "draft-js";
import decorator from "./decorator";

export default function addLink(editorState, data) {
    const { name, url } = data;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const currentSelectionState = editorState.getSelection();
    const newContentState = Modifier.replaceText(
      contentState,
      currentSelectionState,
      name,
      null,
      entityKey
    );
    let newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
    return newEditorState;
}
  
export function isCursorOnLink(editorState) {
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const endKey = selection.getEndKey();
    const contentState = editorState.getCurrentContent();
    const startBlock = contentState.getBlockForKey(startKey);
    const endBlock = contentState.getBlockForKey(endKey);
    let isLink = false;
    if (startKey === endKey) {
      startBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'LINK'
          );
        },
        (start, end) => {
          if (selection.getStartOffset() >= start && selection.getEndOffset() <= end) {
            isLink = true;
          }
        }
      );
    } else {
      const startBlockLink = startBlock.getCharacterList().some((character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      });
      const endBlockLink = endBlock.getCharacterList().some((character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      });
      isLink = startBlockLink || endBlockLink;
    }
    return isLink;
  }
  