import React from "react";
import { CompositeDecorator, EditorState, Modifier } from "draft-js";

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
  new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);
const decorator = createLinkDecorator();

const addLinkAction = ({ editorState, setEditorState, linkUrl, displayLink }) => {
  if (linkUrl) {
    const currentContent = editorState.getCurrentContent();
    const contentWithEntity = currentContent.createEntity("LINK", "MUTABLE", {
      url: linkUrl,
    });
    let entityKey = contentWithEntity.getLastCreatedEntityKey();
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      if (displayLink) {
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
        "apply-entity"
      );
      setEditorState(EditorState.moveFocusToEnd(newState));
    }
  }
};

export default addLinkAction;