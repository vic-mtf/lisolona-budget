import {
  Fade,
  ToggleButton,
  Tooltip,
  Typography,
  Popper,
  Box,
} from "@mui/material";
import ToggleButtonGroup from "../../../../../../../components/ToggleButtonGroup";
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
import { motion } from "framer-motion";

const ToggleTitleSizeButton = ({ editorState, setEditorState }) => {
  const [open, setOpen] = useState(false);
  const anchorElRef = useRef();
  const [block, setBlock] = useState("header-three");
  const isSmallScreen = useSmallScreen();
  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  const props = useLongPress(() => {
    setOpen(true);
  });

  const selected = useMemo(
    () =>
      Boolean(
        headerBlocks.find(({ id }) => id === getCurrentBlockType(editorState))
      ),
    [editorState]
  );

  return (
    <>
      <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Tooltip title='Titre' enterDelay={700} placement='top'>
          <Box>
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
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: 10,
                  fontSize: 10,
                  color: "currentcolor",
                }}
                variant='caption'>
                {headerBlocks.find(({ id }) => id === block).name}
              </Typography>
            </ToggleButton>
          </Box>
        </Tooltip>
        <Popper
          open={open}
          anchorEl={anchorElRef.current}
          placement={isSmallScreen ? "left-end" : "right-start"}
          transition
          disablePortal
          sx={{ zIndex: (t) => t.zIndex.tooltip }}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Box
                sx={{
                  border: (t) => `.01px solid ${t.palette.divider}`,
                  backdropFilter: "blur(15px)",
                  background: "transparent",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 1,
                }}>
                <Box
                  component={motion.div}
                  initial={{ width: 0 }}
                  animate={{
                    width: open ? "auto" : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}>
                  <ToggleButtonGroup
                    size='small'
                    value={block}
                    exclusive
                    sx={{
                      mx: 0.5,
                    }}>
                    {headerBlocks.map(({ name, id, label }) => (
                      <Tooltip
                        key={id}
                        title={label}
                        enterDelay={700}
                        placement='top'>
                        <ToggleButton
                          value={id}
                          onClick={() => {
                            setBlock(id);
                            setEditorState(
                              getStateToggleBlockStyle(editorState, id)
                            );
                          }}>
                          <Typography
                            fontWeight='bold'
                            variant='caption'
                            mx={0.25}>
                            {name}
                          </Typography>
                        </ToggleButton>
                      </Tooltip>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              </Box>
            </Fade>
          )}
        </Popper>
      </Box>
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
