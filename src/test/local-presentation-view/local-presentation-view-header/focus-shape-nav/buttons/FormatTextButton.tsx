import React, { useState, useEffect } from "react";
import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import ToggleButton from "@mui/material/ToggleButton";
import RootToggleButtonGroup from "./RootToggleButtonGroup";
import { EVENT_NAMES } from "@/test/local-presentation-view/local-presentation-view-header/annotationStyles";

const FormatTextButtons = ({ shapeNode }) => {
  const [fontStyle, setFontStyle] = useState(
    () => shapeNode?.fontStyle() || ""
  );

  const handleToggleFontStyle = (style) => () => {
    if (!shapeNode) return;
    let newFontStyle = fontStyle;
    if (fontStyle.includes(style)) {
      newFontStyle = fontStyle
        .split(" ")
        .filter((s) => s !== style)
        .join(" ");
    } else {
      newFontStyle = `${fontStyle} ${style}`.trim();
    }
    setFontStyle(newFontStyle);
    const name = EVENT_NAMES.updateTool;
    const customEvent = new CustomEvent(name, {
      detail: {
        fontStyle: newFontStyle,
        type: "textFontStyle",
        nodeId: shapeNode?.id(),
      },
    });
    window.dispatchEvent(customEvent);
  };

  return (
    <RootToggleButtonGroup size='small'>
      <FontSizeInputText shapeNode={shapeNode} />
      <ToggleButton
        onClick={handleToggleFontStyle("bold")}
        value='bold'
        aria-label='bold'
        selected={fontStyle.includes("bold")}>
        <FormatBoldOutlinedIcon fontSize='small' />
      </ToggleButton>
      <ToggleButton
        onClick={handleToggleFontStyle("italic")}
        value='italic'
        aria-label='italic'
        selected={fontStyle.includes("italic")}>
        <FormatItalicOutlinedIcon fontSize='small' />
      </ToggleButton>
    </RootToggleButtonGroup>
  );
};

const FontSizeInputText = ({ shapeNode }) => {
  const [value, setValue] = useState(() => shapeNode?.fontSize() || 30);
  const inputRef = React.useRef(null);

  const handleChange = (value) => {
    const newValue = Math.min(200, Math.max(8, Number(value)));
    setValue(newValue);
    return newValue;
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.value = value;
    const name = EVENT_NAMES.updateTool;
    const customEvent = new CustomEvent(name, {
      detail: {
        fontSize: value,
        type: "textFontSize",
        name,
        nodeId: shapeNode?.id(),
      },
    });
    window.dispatchEvent(customEvent);
  }, [value, shapeNode]);

  return (
    <div style={{ display: "flex", alignItems: "center", margin: "0 5px" }}>
      <FormControl
        variant='outlined'
        size='small'
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
              border: (t) => `1px solid ${t.palette.divider}`,
            },
          },
        }}>
        <OutlinedInput
          id='font-size-number'
          onChange={(e) => handleChange(e.target.value)}
          inputRef={inputRef}
          defaultValue={value}
          inputProps={{
            onBlur: (e) => {
              e.target.value = handleChange(e.target.value);
            },
          }}
          type='number'
          size='small'
          sx={{ m: 0, px: 0.7, py: 0 }}
          slotProps={{
            input: {
              min: 8,
              max: 200,
              sx: {
                width: 30,
                px: 0,
                fontSize: (t) => t.typography.caption.fontSize,
                textAlign: "center",
              },
            },
          }}
          endAdornment={
            <InputAdornment position='end' sx={{ ml: 0.5 }}>
              <IconButton
                onClick={() => handleChange(value + 1)}
                size='small'
                aria-label='add more font size'
                edge='end'>
                <AddOutlinedIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          }
          startAdornment={
            <InputAdornment position='start' sx={{ mr: 0.5 }}>
              <IconButton
                onClick={() => handleChange(value - 1)}
                size='small'
                aria-label='remove font size'
                edge='start'>
                <RemoveOutlinedIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </div>
  );
};

export default React.memo(FormatTextButtons);
