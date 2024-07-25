import React, { useMemo } from "react";

export default function ToggleComponent({
  componentA = "div",
  componentB = "div",
  AProps = {},
  BProps = {},
  isFirst = true,
  children = null,
}) {
  const { Element, props } = useMemo(() => {
    return {
      Element: isFirst ? componentA : componentB,
      props: isFirst ? AProps : BProps,
    };
  }, [componentA, componentB, isFirst, AProps, BProps]);
  return <Element {...props}>{children}</Element>;
}
