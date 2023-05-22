import React, { useState } from "react";
import { CompositeDecorator, EditorState, Modifier, Editor, RichUtils } from "draft-js";
import addLinkPluginPlugin from "./addLinkPlugin";

const Link = ({ entityKey, contentState, children }) => {
    let { url } = contentState.getEntity(entityKey).getData();
    return (
        <a
            style={{ color: "blue" }}
            href={url}
            rel="noreferrer"
            target="_blank"
        >
            {children}
        </a>
    );
};

const findLinkEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === "LINK"
        );
    }, callback);
};

const createLinkDecorator = () =>
    new CompositeDecorator([{
        strategy: findLinkEntities,
        component: Link,
}]);
const decorator = createLinkDecorator();

export const onAddLink = (editorState, setEditorState) => {
    let linkUrl = window.prompt("Add link http:// ");
    if (linkUrl) {
        const currentContent = editorState.getCurrentContent();
        const contentWithEntity = currentContent.createEntity("LINK", "MUTABLE", {
            url: linkUrl,
        });
        let entityKey = contentWithEntity.getLastCreatedEntityKey();
        const selection = editorState.getSelection();
        if(selection.isCollapsed()) {
          let displayLink = window.prompt("Display Text");
          if(displayLink) {
            const textWithEntity = Modifier.insertText(
              currentContent,
              selection,
              displayLink,
              null,
              entityKey
          );
          const newState = EditorState.createWithContent(textWithEntity, decorator);
          setEditorState(newState);
          } 
      } else {
        const newContentState = Modifier.applyEntity(
          currentContent,
          selection,
          entityKey
        );
        const newState = EditorState.push(
          editorState,
          newContentState,
          'apply-entity'
        );
        setEditorState(newState);
      }
           
    }
};


export default function Apptest () {
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));

  const handleAddText = () => onAddLink(editorState, setEditorState);

  const handleGetEntity = (event) => {
    event.preventDefault();
    const selectionState = editorState.getSelection();
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const currentContent = editorState.getCurrentContent();
    const selectedBlock = currentContent.getBlockForKey(selectionState.getStartKey());
    const selectedText = selectedBlock.getText().slice(start, end);
    const entityKey = selectedBlock.getEntityAt(start);
    if (entityKey) {
      const entity = currentContent.getEntity(entityKey);
      if (entity.getType() === 'LINK') {
        const url = entity.getData().url;
      
      }
    }

  };

  return (
    <div>
      <button 
        onMouseDown={event => event.preventDefault()}
        onClick={handleAddText}
      >Add Text de link</button>
      <button 
        onClick={handleGetEntity}
        onMouseDown={event => event.preventDefault()}
      >get entry</button>
      <div
        style={{
          background: 'white',
          width: 600,
          height: 300
        }}
      >
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          plugins={[addLinkPluginPlugin]}
          handleKeyCommand={(command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
              setEditorState(newState);
              return 'handled';
            }
            return 'not-handled';
          }}
        />
      </div>
    </div>
  );
};