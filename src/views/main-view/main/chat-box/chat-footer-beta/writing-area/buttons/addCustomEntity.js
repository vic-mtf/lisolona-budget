import { EditorState, Modifier } from "draft-js";

export default function addCustomEntity(editorState, entityType, entityData) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
        entityType,
        'MUTABLE',
        entityData
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const currentSelectionState = editorState.getSelection();
    const newContentState = Modifier.replaceText(
      contentState,
      currentSelectionState,
      '_',
      null,
      entityKey
    );
    let newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
    return newEditorState;
  }
  