import { Stack, OutlinedInput, Box as MuiBox } from "@mui/material";
import React, { useRef, useMemo, useState } from "react";
import propTypes from "prop-types";
import { useCallback } from "react";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import IconButton from "./IconButton";
import { useEffect } from "react";

export default function InputCode({
  length = 6,
  size = 40,
  values = [],
  type = "alphanumeric",
  onChange = () => null,
  onComplete = () => null,
}) {
  const [codes, setCodes] = useState(values.slice(0, length));
  const rootRef = useRef();
  const changingRef = useRef(true);
  const handleChange = useCallback(
    ({ event, index }) => {
      const value = event.target.value?.trim()?.charAt(0);
      onChange(event, { index, value });
      const inputs = rootRef.current.querySelectorAll("input");
      const nextInput = inputs[index + 1];
      if (index < length) changingRef.current = true;
      if (verifyType(type, value) || value === "") {
        if (value) {
          event.target?.blur();
          nextInput?.focus();
          setCodes((codes) => [...codes, value]);
        }
      }
    },
    [type, onChange, length]
  );

  const handleDelete = useCallback(
    ({ event, notControlled }) => {
      const inputs = rootRef.current.querySelectorAll("input");
      const previousInput = inputs[codes.length > 0 ? codes.length - 1 : 0];
      if (
        event?.keyCode === 8 ||
        event?.code?.toLowerCase() === "backspace" ||
        notControlled
      ) {
        event.target?.blur();
        previousInput?.focus();
        setCodes((codes) => codes.slice(0, codes.length - 1));
      }
    },
    [codes]
  );

  useEffect(() => {
    if (codes.length === length && changingRef.current) {
      onComplete(codes);
      changingRef.current = false;
    }
  }, [codes, length, onComplete]);

  const inputs = useMemo(
    () =>
      new Array(length).fill("_").map((_, index, __) => {
        const value = codes[index] === undefined ? "" : codes[index];
        const readOnly =
          index > 0
            ? value !== "" || codes[index - 1] === undefined
            : value !== "";
        return (
          <OutlinedInput
            key={index}
            size='small'
            placeholder='-'
            readOnly={readOnly}
            onChange={(event) => handleChange({ index, event })}
            onKeyDown={(event) => handleDelete({ index, event })}
            autoFocus={!readOnly && value === ""}
            value={value}
            sx={{
              fontWeight: "bold",
              fontSize: (10 * size) / 20,
              width: size,
              height: size,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              "& input": {
                textAlign: "center",
                lineHeight: "2em",
              },
            }}
          />
        );
      }),
    [codes, length, size, handleChange, handleDelete]
  );

  return (
    <MuiBox
      display='flex'
      gap={0.5}
      sx={{
        flexDirection: {
          xs: length <= 6 ? "rom" : "column",
          md: "row",
        },
      }}>
      <Stack
        direction='row'
        spacing={0.5}
        ref={rootRef}
        display='flex'
        flex={1}>
        {inputs}
      </Stack>
      <MuiBox justifyContent='center' alignItems='center' display='flex'>
        <IconButton
          onClick={(event) => handleDelete({ event, notControlled: true })}
          onMouseDown={(event) => event.preventDefault()}>
          <BackspaceOutlinedIcon />
        </IconButton>
      </MuiBox>
    </MuiBox>
  );
}

InputCode.propType = {
  length: propTypes.number,
  size: propTypes.number,
  values: propTypes.array,
  onChange: propTypes.func,
  onComplete: propTypes.func,
  type: propTypes.oneOf(["numeric", "alphanumeric", "alphabetic"]),
};
function verifyType(type, str) {
  let regex;
  switch (type) {
    case "numeric":
      regex = /^[0-9]+$/;
      break;
    case "alphanumeric":
      regex = /^[a-zA-Z0-9]+$/;
      break;
    case "alphabetic":
      regex = /^[a-zA-Z]+$/;
      break;
    default:
      return false;
  }
  return regex.test(str);
}
