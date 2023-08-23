import React from "react";
import { CompositeDecorator } from "draft-js";
import { Box as MuiBox } from "@mui/material";

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

const EMOJI = ({ entityKey, contentState, children }) => {
  let data = contentState.getEntity(entityKey).getData();
  const url = window.encodeURI(`${process.env.PUBLIC_URL}/${data.src}`);
  return (
    <MuiBox
      component="span"
      sx={{
        position: 'relative',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${url})`,
        caretColor: theme => theme.palette.text.primary,
        p: 0,
        m: 0,
        '& > span': {
          color: 'transparent',
        },
      }}
    >
      <span>{children}</span>
    </MuiBox>
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

const findEmojiEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "EMOJI"
    );
  }, callback);
};

const createLinkDecorator = () =>
  new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
    {
      strategy: findEmojiEntities,
      component: EMOJI,
    },
  ]);
const decorator = createLinkDecorator();
export default decorator;