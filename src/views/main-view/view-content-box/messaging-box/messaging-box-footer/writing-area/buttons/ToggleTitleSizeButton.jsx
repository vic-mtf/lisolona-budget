import {
  Drawer,
  Menu,
  MenuItem,
  ToggleButton,
  Tooltip,
  Typography,
} from "@mui/material";
//import PropTypes from "prop-types";
//import FormatSizeOutlinedIcon from "@mui/icons-material/FormatSizeOutlined";
// import ElasticPopper from "../../../../../../../components/ElasticPopper";
import useLongPress from "../../../../../../../hooks/useLongPress";
import { useRef } from "react";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useSmallScreen from "../../../../../../../hooks/useSmallScreen";
import { useMemo } from "react";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";

const ToggleTitleSizeButton = () => {
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

  return (
    <>
      <Tooltip title='Title' enterDelay={700} placement='top'>
        <div style={{ position: "relative" }}>
          <ToggleButton {...props} value='link' ref={anchorElRef}>
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
        {...menuNavProps}>
        {headerBlocks.map(({ id, value, label }) => (
          <MenuItem
            key={id}
            onClick={() => {
              setBlock(id);
              setOpen(false);
            }}
            value={value}
            selected={block === id}>
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

ToggleTitleSizeButton.propTypes = {};

export default ToggleTitleSizeButton;
