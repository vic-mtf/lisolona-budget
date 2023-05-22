import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showModal, setShowModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const handleLinkInput = (e) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: linkUrl }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const selectionState = newEditorState.getSelection();
    const newContentState = Modifier.replaceText(
      contentStateWithEntity,
      selectionState,
      linkText,
      newEditorState.getCurrentInlineStyle(),
      entityKey
    );
    const newEditorStateWithLink = EditorState.push(
      newEditorState,
      newContentState,
      'insert-characters'
    );
    setEditorState(newEditorStateWithLink);
    setShowModal(false);
  };

  const handleLinkButtonClick = () => {
    const selectionState = editorState.getSelection();
    const selectedText = editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey())
      .getText().slice(selectionState.getStartOffset(), selectionState.getEndOffset());
    setLinkText(selectedText);
    setShowModal(true);
  };

  return (
    <div>
      <button onClick={handleLinkButtonClick}>Add Link</button>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
      />
      {showModal && (
        <div>
          <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          <button onClick={handleLinkInput}>Add Link</button>
        </div>
      )}
    </div>
  );
};

export default MyEditor