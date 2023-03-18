import React, { useRef } from "react";
import ResizeDragContainer from "./ResizeDragContainer";


export default function Apptest() {
  const coordsRef = useRef({
    width: 300,
    height: 200,
    backgroundColor: 'red',
  })
 
  return (
    <React.Fragment>
      <ResizeDragContainer coordsRef={coordsRef}>

      </ResizeDragContainer>
    </React.Fragment>
  );
}