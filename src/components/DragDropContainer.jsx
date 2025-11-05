import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import interact from 'interactjs';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import useSmallScreen from '../hooks/useSmallScreen';

const MARGIN = 5;

const DragDropContainer = React.forwardRef(
  ({ children, smallView, showSmallView, onShowSmallViewChange }, ref) => {
    const matches = useSmallScreen();
    const aspectRatio = useMemo(() => (matches ? 9 / 16 : 16 / 9), [matches]);
    const initWidth = hDims.initHeight * aspectRatio;
    const initHeight = wDims.initWidth / aspectRatio;

    const containerRef = useRef();

    const autoDrag = useCallback((event) => {
      const container = containerRef.current;
      if (!container) return;
      const parent = container.parentNode;
      const target = event.target;
      const parentRect = parent.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const corners = {
        topLeft: { x: parentRect.left + MARGIN, y: parentRect.top + MARGIN },
        topRight: {
          x: parentRect.right - targetRect.width - MARGIN,
          y: parentRect.top + MARGIN,
        },
        bottomLeft: {
          x: parentRect.left + MARGIN,
          y: parentRect.bottom - targetRect.height - MARGIN,
        },
        bottomRight: {
          x: parentRect.right - targetRect.width - MARGIN,
          y: parentRect.bottom - targetRect.height - MARGIN,
        },
      };

      const current = { x: targetRect.left, y: targetRect.top };
      const distances = Object.entries(corners).map(([key, corner]) => {
        const dx = current.x - corner.x;
        const dy = current.y - corner.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return { key, distance, corner };
      });

      const closest = distances.reduce((a, b) =>
        a.distance < b.distance ? a : b
      );
      const finalX = closest.corner.x - parentRect.left;
      const finalY = closest.corner.y - parentRect.top;

      target.style.transition = 'transform 0.1s ease';
      target.style.transform = `translate(${finalX}px, ${finalY}px)`;
      target.setAttribute('data-x', finalX);
      target.setAttribute('data-y', finalY);

      target.ontransitionend = () => {
        target.style.transition = '';
        target.ontransitionend = null;
      };
    }, []);

    const manuelResize = useCallback(
      (newWidth, newHeight) => {
        const el = containerRef.current;
        if (!el) return;

        el.style.transition = 'width, height 0.3s ease';
        el.style.width = `${newWidth}px`;
        el.style.height = `${newHeight}px`;

        const isSmall = matches
          ? newWidth <= wDims.minWidthThreshold
          : newHeight <= hDims.minHeightThreshold;
        if (
          showSmallView !== isSmall &&
          typeof onShowSmallViewChange === 'function'
        )
          onShowSmallViewChange(isSmall);
        el.ontransitionend = () => {
          autoDrag({ target: el });
        };
      },
      [autoDrag, showSmallView, onShowSmallViewChange, matches]
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      interact(container)
        .resizable({
          edges: { left: false, right: false, bottom: false, top: false },
          preserveAspectRatio: true,
          listeners: {
            move(event) {
              const target = event.target;
              let x = parseFloat(target.getAttribute('data-x')) || 0;
              let y = parseFloat(target.getAttribute('data-y')) || 0;

              target.style.width = `${event.rect.width}px`;
              target.style.height = `${event.rect.height}px`;

              x += event.deltaRect.left;
              y += event.deltaRect.top;

              target.style.transform = `translate(${x}px, ${y}px)`;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
            },
            end: (event) => {
              const height = parseFloat(event.target.style.height);
              const width = parseFloat(event.target.style.width);
              const cond = matches
                ? width <= wDims.minWidthThreshold
                : height <= hDims.minHeightThreshold;
              if (cond) {
                const newHeight = matches ? initHeight - 50 : 50;
                const newWidth = matches ? 40 : initWidth;
                manuelResize(newWidth, newHeight);
              } else autoDrag(event);
            },
          },
          modifiers: [
            interact.modifiers.restrictEdges({
              outer: 'parent',
              offset: {
                top: MARGIN,
                left: MARGIN,
                bottom: MARGIN,
                right: MARGIN,
              },
              endOnly: true,
            }),
            interact.modifiers.aspectRatio({ ratio: 'preserve' }),
            interact.modifiers.restrictSize({
              min: {
                width: hDims.minHeight * aspectRatio,
                height: hDims.minHeight,
              },
              max: {
                width: hDims.maxHeight * aspectRatio,
                height: hDims.maxHeight,
              },
            }),
          ],
          inertia: true,
        })
        .draggable({
          listeners: {
            move: (event) => {
              const target = event.target;
              const dataX = target.getAttribute('data-x') || 0;
              const dataY = target.getAttribute('data-y') || 0;
              const x = parseFloat(dataX) + event.dx;
              const y = parseFloat(dataY) + event.dy;
              target.style.transform = `translate(${x}px, ${y}px)`;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
            },
            end: autoDrag,
          },
          inertia: true,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true,
              offset: {
                top: MARGIN,
                left: MARGIN,
                bottom: MARGIN,
                right: MARGIN,
              },
            }),
          ],
        });

      let interactive;
      const onActiveInteract = () => {
        interact(container).resizable({
          edges: { top: true, left: true, bottom: true, right: true },
        });
      };
      const onDeactivateInteract = () => {
        interact(container).resizable({
          edges: { top: false, left: false, bottom: false, right: false },
        });
      };

      if (!showSmallView)
        corners.forEach((dir) => {
          interactive = interact(container.querySelector(`.corner-${dir}`));
          interactive.on('down', onActiveInteract);
        });

      document.addEventListener('mouseup', onDeactivateInteract);
      document.addEventListener('touchend', onDeactivateInteract);
      document.addEventListener('pointerdown', onDeactivateInteract);

      return () => {
        corners.forEach((dir) => {
          interactive = interact(container.querySelector(`.corner-${dir}`));
          interactive.off('down', onActiveInteract);
        });
        document.removeEventListener('mouseup', onDeactivateInteract);
        document.removeEventListener('touchend', onDeactivateInteract);
        document.removeEventListener('pointerdown', onDeactivateInteract);
      };
    }, [
      aspectRatio,
      autoDrag,
      manuelResize,
      initWidth,
      showSmallView,
      matches,
      initHeight,
    ]);

    useEffect(() => {
      const child = containerRef.current;
      if (!child) return;
      const parent = child.parentNode;

      const observer = new ResizeObserver(() => {
        const parentRect = parent.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();

        const current = { x: childRect.left, y: childRect.top };
        const corners = {
          topLeft: { x: parentRect.left + MARGIN, y: parentRect.top + MARGIN },
          topRight: {
            x: parentRect.right - childRect.width - MARGIN,
            y: parentRect.top + MARGIN,
          },
          bottomLeft: {
            x: parentRect.left + MARGIN,
            y: parentRect.bottom - childRect.height - MARGIN,
          },
          bottomRight: {
            x: parentRect.right - childRect.width - MARGIN,
            y: parentRect.bottom - childRect.height - MARGIN,
          },
        };

        const distances = Object.entries(corners).map(([key, corner]) => {
          const dx = current.x - corner.x;
          const dy = current.y - corner.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return { key, distance, corner };
        });
        const closest = distances.reduce((a, b) =>
          a.distance < b.distance ? a : b
        );
        const finalX = closest.corner.x - parentRect.left;
        const finalY = closest.corner.y - parentRect.top;

        child.style.transform = `translate(${finalX}px, ${finalY}px)`;
        child.setAttribute('data-x', finalX);
        child.setAttribute('data-y', finalY);
      });

      observer.observe(parent);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      const child = containerRef.current;
      const parent = child?.parentNode;
      if (!child || !parent) return;

      const parentRect = parent.getBoundingClientRect();
      const childRect = child.getBoundingClientRect();

      const x = parentRect.width - childRect.width - MARGIN;
      const y = MARGIN;

      child.style.transform = `translate(${x}px, ${y}px)`;
      child.setAttribute('data-x', x);
      child.setAttribute('data-y', y);
    }, []);

    useEffect(() => {
      const child = containerRef.current;
      if (!child) return;
      const childRect = child.getBoundingClientRect();
      const height = parseFloat(childRect.height);
      const width = parseFloat(childRect.width);
      const cond = matches
        ? width > wDims.minWidthThreshold
        : height > hDims.minHeightThreshold;

      const newHeight = matches ? initHeight - 50 : 50;
      const newWidth = matches ? 40 : initWidth;
      if (showSmallView && cond) manuelResize(newWidth, newHeight);
    }, [showSmallView, initWidth, manuelResize, matches, initHeight]);

    return (
      <Box
        ref={(node) => {
          containerRef.current = node;
          if (ref && Object.hasOwnProperty.call(ref, 'current'))
            ref.current = node;
        }}
        display="flex"
        height={{ md: hDims.initHeight, xs: initHeight }}
        width={{ md: initWidth, xs: wDims.initWidth }}
        data-x={0}
        data-y={0}
        position="absolute"
        borderRadius={1}
        zIndex={(t) => t.zIndex.speedDial + 100}
        sx={{
          aspectRatio: { md: 16 / 9, sm: 3 / 4, xs: 9 / 16 },
          touchAction: 'none',
          zIndex: (t) => t.zIndex.speedDial + 100,
        }}
      >
        {corners.map((corner) => (
          <div
            key={corner}
            className={`corner-${corner}`}
            style={{
              ...cornerStyles[corner],
              position: 'absolute',
              zIndex: 10,
              width: 10,
              aspectRatio: 1,
              display: showSmallView && 'none',
            }}
          />
        ))}
        <Box
          display="flex"
          flexDirection="column"
          elevation={5}
          component={Paper}
          position="absolute"
          overflow="hidden"
          height="100%"
          width="100%"
        >
          <Fade
            in={!showSmallView}
            unmountOnExit
            appear={false}
            className="fadeContainer"
            style={{ display: 'flex', flex: 1 }}
          >
            <Box>{children}</Box>
          </Fade>
          <Fade
            in={showSmallView}
            unmountOnExit
            appear={false}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Toolbar
              sx={{
                px: { xs: 0, md: 1 },
                gap: 1,
                flexDirection: { xs: 'column', md: 'row' },
              }}
              variant="dense"
              disableGutters
            >
              <Box
                flexGrow={1}
                display="inline-flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                alignItems="center"
                pt={{ xs: 1, md: 0 }}
                gap={1}
              >
                {smallView}
              </Box>
              <Tooltip title="Agrandir">
                <Box pb={{ xs: 1, md: 0 }}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const height = matches ? initHeight : hDims.initHeight;
                      const width = matches ? wDims.initWidth : initWidth;
                      manuelResize(width, height);
                    }}
                  >
                    <OpenInFullOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Tooltip>
            </Toolbar>
          </Fade>
        </Box>
      </Box>
    );
  }
);

const corners = ['nw', 'ne', 'sw', 'se'];
const cornerStyles = {
  nw: { top: 0, left: 0, cursor: 'nw-resize' },
  ne: { top: 0, right: 0, cursor: 'ne-resize' },
  sw: { bottom: 0, left: 0, cursor: 'sw-resize' },
  se: { bottom: 0, right: 0, cursor: 'se-resize' },
};

const hDims = {
  initHeight: 120,
  minHeight: 60,
  maxHeight: 200,
  minHeightThreshold: 70,
};

const wDims = {
  initWidth: 120,
  minWidth: 60,
  maxWidth: 200,
  minWidthThreshold: 70,
};

DragDropContainer.propTypes = {
  children: PropTypes.node,
  smallView: PropTypes.node,
  onShowSmallViewChange: PropTypes.func,
  showSmallView: PropTypes.bool,
  aspectRatio: PropTypes.number,
};

DragDropContainer.displayName = 'DragDropContainer';
export default React.memo(DragDropContainer);
