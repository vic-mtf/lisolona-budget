import React from "react";
import { Arrow, Line, Ring } from "react-konva";
import PropTypes from "prop-types";
import { useMemo } from "react";
import CustomLine from "./CustomLine";

const MultiForm = React.memo(({ mode, draggable, ...data }) => {
  const { component: Shape, ...props } = useMemo(
    () => forms[mode] || {},
    [mode]
  );

  return (
    Boolean(Shape) && (
      <Shape
        {...props}
        {...data}
        draggable={props.draggable ? draggable : false}
      />
    )
  );
});

const forms = {
  line: {
    lineCap: "round",
    lineJoin: "round",
    component: Line,
    draggable: true,
  },
  rect: {
    lineCap: "square",
    component: Line,
    draggable: true,
  },
  circle: {
    lineCap: "round",
    component: Ring,
    draggable: true,
  },
  arrow: {
    lineCap: "round",
    pointerLength: 5,
    pointerWidth: 5,
    component: Arrow,
    draggable: true,
  },
  persist: {
    lineCap: "round",
    lineJoin: "round",
    component: CustomLine,
    draggable: false,
  },
  text: {
    component: Line,
    draggable: true,
  },
};

MultiForm.displayName = "MultiForm";

MultiForm.propTypes = {
  mode: PropTypes.oneOf(["line", "rect", "circle", "text", "arrow", "persist"]),
  draggable: PropTypes.bool,
};

export default MultiForm;
