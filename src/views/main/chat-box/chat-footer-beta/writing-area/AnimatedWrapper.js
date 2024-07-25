import React, { useEffect, useMemo, useState } from "react";
import { Divider } from "@mui/material";
import Slide from "./Slide";
import Fade from "./Fade";
import store from "../../../../../redux/store";
import PropTypes from "prop-types";

const AnimatedWrapper = React.memo(
  ({
    children,
    path,
    defaultOpen,
    wrapperProps,
    type = "slide",
    divided = true,
  }) => {
    const value = Boolean(getValue(store.getState(), path));
    const [open, setOpen] = useState(defaultOpen || value);
    const WrapperComponent = useMemo(
      () => (type?.toLowerCase() === "slide" ? Slide : Fade),
      [type]
    );

    useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        const state = getValue(store.getState(), path);
        if (!open && state) setOpen(true);
        if (open && !state) setOpen(false);
      });
      return () => {
        unsubscribe();
      };
    }, [path, open]);

    return (
      <>
        <WrapperComponent open={open} wrapperProps={wrapperProps}>
          {children}
        </WrapperComponent>
        {open && divided && <Divider />}
      </>
    );
  }
);

AnimatedWrapper.propTypes = {
  children: PropTypes.node,
  path: PropTypes.string,
  type: PropTypes.oneOf(["slide", "fade"]),
  divided: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  wrapperProps: PropTypes.object,
};

export const getValue = (obj, path = "") => {
  const parts = path.split(".");
  let current = obj;
  for (let part of parts) {
    if (current[part] === undefined) return undefined;
    current = current[part];
  }
  return current;
};

export default AnimatedWrapper;
