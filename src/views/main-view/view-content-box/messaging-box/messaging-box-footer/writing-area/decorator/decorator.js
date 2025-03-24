import { CompositeDecorator } from "draft-js";
import LinkDecorator from "./LinkDecorator";

const findLinkEntities = (name) => (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    entityKey && console.log(contentState.getEntity(entityKey).getType());
    return (
      entityKey !== null && contentState.getEntity(entityKey).getType() === name
    );
  }, callback);
};

const createLinkDecorator = () =>
  new CompositeDecorator([
    {
      strategy: findLinkEntities("LINK"),
      component: LinkDecorator,
    },
  ]);
const decorator = createLinkDecorator();

export default decorator;
