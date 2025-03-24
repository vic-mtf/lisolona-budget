import React from "react";
import { ToggleButton, Tooltip } from "@mui/material";
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
      {buttons.map(({ id, label, icon = "div" }) => (
        <Tooltip key={id} title={label} enterDelay={700} placement='top'>
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

ToggleStyleButtons.displayName = "ToggleStyleButtons";

ToggleStyleButtons.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  editorState: PropTypes.instanceOf(EditorState).isRequired,
  setEditorState: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
};

export default ToggleStyleButtons;
