import {
    Box as MuiBox
} from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';
import interact from 'interactjs';

export default function ResizeDragContainer({children, coordsRef}) {
    const containerRef = useRef();
    const handleResizableMoveListener = useCallback(event => {
        const target = event.target
        let x = parseFloat(target.getAttribute('data-x')) || 0;
        let y = parseFloat(target.getAttribute('data-y')) || 0;
        // update the element's style
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        target.style.transform = `translate(${x}px,${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        if(typeof coordsRef?.current === 'object')
            coordsRef.current.width = event.rect.width;
            coordsRef.current.width = event.rect.height;
            coordsRef.current.transform = `translate(${x}px,${y}px)`;
    }, [coordsRef]);
    const handleDragMoveListener = useCallback(event  => {
        var target = event.target
        // keep the dragged position in the data-x/data-y attributes
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      
        // translate the element
        target.style.transform = `translate(${x}px,${y}px)`;
        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        if(typeof coordsRef?.current === 'object')
            coordsRef.current.width = event.rect.width;
            coordsRef.current.width = event.rect.height;
            coordsRef.current.transform = `translate(${x}px,${y}px)`;
      }, [coordsRef]);
      
    useEffect(() => {
        interact(containerRef.current)
        .resizable({
            edges: { 
                left: true, 
                right: true, 
                bottom: true, 
                top: true 
            },
            listeners: { move: handleResizableMoveListener },
            modifiers: [
            // keep the edges inside the parent
            interact.modifiers.restrictEdges({
                outer: 'parent'
            }),
            // minimum size
            interact.modifiers.restrictSize({
                min: {width: 100, height: 50},
                max: {width: 500, height: 300}
            })
            ],
            inertia: true
        })
        .draggable({
            listeners: { move: handleDragMoveListener},
            inertia: true,
            modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
            ]
        })
    }, [
        handleDragMoveListener, 
        handleResizableMoveListener
    ]);

    return (
        <MuiBox 
            ref={containerRef}
            sx={{...coordsRef?.current}}
        >{children}</MuiBox>
    )
}