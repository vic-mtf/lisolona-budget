import React from "react";
import { ToggleButton, Tooltip, Box } from "@mui/material";
import { EditorState } from "draft-js";
import PropTypes from "prop-types";
import ToggleButtonGroup from "../../../../../../components/ToggleButtonGroup";
import { createElement } from "react";
import getStateToggleInlineStyle from "./buttons/getStateToggleInlineStyle";
import { getStateToggleBlockStyle } from "./buttons/buttons";

const ToggleStyleButtons = React.memo(
  ({ values, editorState, setEditorState, buttons, disabled }) => (
    <ToggleButtonGroup
      size='small'
      disabled={disabled}
      value={values}
      onChange={({ currentTarget }) => {
        const value = currentTarget.value;
        const button = buttons.find(({ id }) => id === value);
        if (button.style === "inline")
          setEditorState(getStateToggleInlineStyle(editorState, value, button));
        if (button.style === "block")
          setEditorState(getStateToggleBlockStyle(editorState, value));
      }}>
      {buttons.map(({ id, label, icon = "div", cmd }) => (
        <Tooltip
          key={id}
          title={<TooltipTile label={label} cmd={cmd} />}
          enterDelay={700}
          placement='top'>
          <div>
            <ToggleButton value={id}>
              {createElement(icon, { fontSize: "small" })}
            </ToggleButton>
          </div>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  )
);

const TooltipTile = ({ label, cmd }) => {
  const commands = cmd?.split("+");
  return (
    <div>
      <div>{label}</div>
      {Array.isArray(commands) && (
        <Box
          sx={{
            "& kbd": {
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: 0.5,
            },
          }}>
          {commands.map((key, i) => (
            <React.Fragment key={i}>
              {i > 0 && " + "}
              {<kbd>{key}</kbd>}
            </React.Fragment>
          ))}
        </Box>
      )}
    </div>
  );
};
TooltipTile.propTypes = {
  label: PropTypes.string,
  cmd: PropTypes.string,
};
ToggleStyleButtons.displayName = "ToggleStyleButtons";

ToggleStyleButtons.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  editorState: PropTypes.instanceOf(EditorState).isRequired,
  setEditorState: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
};

export default ToggleStyleButtons;
