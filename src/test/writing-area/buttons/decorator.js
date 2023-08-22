import React from "react";
import { CompositeDecorator } from "draft-js";

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
    console.log( entityKey !== null ?
        contentState.getEntity(entityKey).getType(): null)
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
export default decorator;