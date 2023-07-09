import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

function App() {
  const rootRef = useRef();

  const [size, setSize] = useState(0);
  const handleGetSize = useCallback(() => {
    if (rootRef.current) {
      const style = window.getComputedStyle(rootRef.current, null);
      setSize(parseFloat(style.width));
    }
  }, []);
  const parentStyles = {
    width: "100%",
    height: 200,
    position: "relative",
    border: "1px solid black",
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  };

  const childStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    paddingBottom: "50%",
    border: "1px solid black"
  };

  useLayoutEffect(() => {
    handleGetSize();
    window.addEventListener("resize", handleGetSize);
    return () => {
      window.removeEventListener("resize", handleGetSize);
    };
  }, [handleGetSize]);

  return (
    <div style={parentStyles}>
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "50%",

        }}
      >
        <div style={childStyles} ref={rootRef} onResize={handleGetSize}></div>
      </div>
      <div
        style={{
          //background: 'red',
          border: "1px solid black",
          width: size,
          height: size
        }}
        children="1"
      />
    </div>
  );
}

export default App;
