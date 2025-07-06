import {
  Drawer,
  Menu,
  MenuItem,
  ToggleButton,
  Tooltip,
  Typography,
} from "@mui/material";
import useLongPress from "../../../../../../../hooks/useLongPress";
import { useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useSmallScreen from "../../../../../../../hooks/useSmallScreen";
import { useMemo } from "react";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import { EditorState } from "draft-js";
import PropTypes from "prop-types";
import getCurrentBlockType from "../buttons/getCurrentBlockType";
import { getStateToggleBlockStyle } from "./buttons";

const ToggleTitleSizeButton = ({ editorState, setEditorState }) => {
  const [open, setOpen] = useState(false);
  const anchorElRef = useRef();
  const [block, setBlock] = useState("header-three");

  const props = useLongPress(() => {
    setOpen(true);
  });

  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const menuNavProps = useMemo(
    () =>
      matches
        ? { anchor: "bottom" }
        : {
            anchorEl: open && anchorElRef.current,
            anchorOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          },
    [matches, open]
  );
  const selected = useMemo(
    () =>
      Boolean(
        headerBlocks.find(({ id }) => id === getCurrentBlockType(editorState))
      ),
    [editorState]
  );
  console.log(getCurrentBlockType(editorState));
  return (
    <>
      <Tooltip
        title={
          <div>
            <span>Titre</span>
            <div>Mainternir pour changer le format</div>
          </div>
        }
        enterDelay={700}
        placement='top'>
        <div style={{ position: "relative" }}>
          <ToggleButton
            {...props}
            value='link'
            ref={anchorElRef}
            selected={selected}
            onClick={() =>
              setEditorState(getStateToggleBlockStyle(editorState, block))
            }>
            <TitleOutlinedIcon fontSize='small' />
            <ArrowDropDownIcon fontSize='small' />
            <Typography
              sx={{ position: "absolute", bottom: -2, right: 10, fontSize: 10 }}
              variant='caption'
              color=''>
              {headerBlocks.find(({ id }) => id === block).name}
            </Typography>
          </ToggleButton>
        </div>
      </Tooltip>
      <MenuNav
        open={open}
        onClose={() => setOpen(false)}
        disableEnforceFocus
        disableAutoFocus
        disableAutoFocusItem
        disableRestoreFocus
        onMouseDown={(event) => event.preventDefault()}
        {...menuNavProps}>
        {headerBlocks.map(({ id, value, label }) => (
          <MenuItem
            key={id}
            onClick={() => {
              setEditorState(getStateToggleBlockStyle(editorState, id));
              setBlock(id);
              setOpen(false);
            }}
            value={value}
            selected={block === id}
            onMouseDown={(event) => event.preventDefault()}>
            {label}
          </MenuItem>
        ))}
      </MenuNav>
    </>
  );
};

const headerBlocks = [
  {
    id: "header-one",
    label: "En-tête de niveau 1",
    name: "H1",
  },
  {
    id: "header-two",
    label: "En-tête de niveau 2",
    name: "H2",
  },
  {
    id: "header-three",
    label: "En-tête de niveau 3",
    name: "H3",
  },
  {
    id: "header-four",
    label: "En-tête de niveau 4",
    name: "H4",
  },
  {
    id: "header-five",
    label: "En-tête de niveau 5",
    name: "H5",
  },
  {
    id: "header-six",
    label: "En-tête de niveau 6",
    name: "H6",
  },
];

ToggleTitleSizeButton.propTypes = {
  editorState: PropTypes.instanceOf(EditorState).isRequired,
  setEditorState: PropTypes.func.isRequired,
};

export default ToggleTitleSizeButton;
