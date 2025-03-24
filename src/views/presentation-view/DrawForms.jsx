import React, { useState } from "react";
import DrawAnchoredPen from "./DrawAnchoredPen";
import DrawArrows from "./DrawArrows";
import DrawCircles from "./DrawCircles";
import DrawLines from "./DrawLines";
import DrawRects from "./DrawRects";
import MultiForm from "./MultiFom";
import { useCallback } from "react";
import PropTypes from "prop-types";

const DrawForms = React.memo(({ stageRef, mode, color }) => {
  const [forms, setForms] = useState([]);

  // const mode = "gum";
  // const color = "blue";
  const updateForms = useCallback((form) => {
    setForms((forms) => {
      const foundForm = forms.find(({ id }) => id === form.id);
      return foundForm
        ? forms
            .filter(({ id }) => id !== form.id)
            .concat([{ ...foundForm, ...form }])
        : [...forms, form];
    });
  }, []);
  const removeForm = useCallback(
    (e) => {
      const shape = e.target;
      if (mode === "gum")
        shape.to({
          opacity: 0,
          duration: 0.2,
          onFinish: () => {
            if (e.target.opacity() === 0)
              setForms((forms) => forms.filter(({ id }) => shape?.id !== id));
          },
        });
    },
    [mode]
  );

  return (
    <>
      {forms.map(({ id, mode: defaultMode, ...props }) => (
        <MultiForm
          key={id}
          id={id}
          mode={defaultMode}
          {...props}
          draggable={mode === defaultMode}
          onDragStart={() => updateForms({ id })}
          onClick={removeForm}
        />
      ))}
      {[DrawAnchoredPen, DrawCircles, DrawArrows, DrawRects, DrawLines].map(
        (Drawn, index) => (
          <Drawn
            key={`drawn-${index}`}
            mode={mode}
            stageRef={stageRef}
            updateForms={updateForms}
            color={color}
          />
        )
      )}
    </>
  );
});

DrawForms.propTypes = {
  stageRef: PropTypes.object,
  mode: PropTypes.string,
  color: PropTypes.string,
};

DrawForms.displayName = "DrawForms";
export default DrawForms;
