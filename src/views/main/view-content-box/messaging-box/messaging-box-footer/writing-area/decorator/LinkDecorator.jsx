import PropTypes from "prop-types";
import { styled } from "@mui/material";
import { EVENT_CHANGE_DATA } from "../buttons/buttons";
import { _SELECT_LINK_EVENT } from "./selectLink";

const Link = styled("a")(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
}));

const LinkDecorator = ({
  entityKey,
  contentState,
  children,
  ...otherProps
}) => {
  let { url } = contentState.getEntity(entityKey).getData();

  return (
    <Link
      href={url}
      rel='noopener'
      target='_blank'
      component='a'
      // onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.preventDefault();
        // e.stopPropagation();
        const name = _SELECT_LINK_EVENT;
        const data = { ...otherProps, entityKey, contentState, children };
        const customEvent = new CustomEvent(name, {
          detail: { name, data },
        });
        EVENT_CHANGE_DATA.dispatchEvent(customEvent);
      }}>
      {children}
    </Link>
  );
};

LinkDecorator.propTypes = {
  entityKey: PropTypes.string.isRequired,
  contentState: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default LinkDecorator;
