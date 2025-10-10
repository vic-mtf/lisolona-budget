import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { motion, AnimatePresence } from 'framer-motion';
import useElementSize from '../hooks/useElementSize';
import getBestGrid from '../utils/getBestGrid';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Fade from '@mui/material/Fade';

const MotionGrid = motion.create(Grid);

const GridLayoutView = React.forwardRef(({ data }, ref) => {
  const [parentRef, parentSize] = useElementSize();
  const fullScreen = useSelector(
    (state) => state.conference.meeting.actions.liveInteractionGrid.fullScreen
  );

  const aspectRatio = 16 / 9;
  const nbr = data.length;

  const dimGrid = useMemo(
    () => getBestGrid(parentSize.width, parentSize.height, nbr),
    [nbr, parentSize]
  );

  const columns = dimGrid.cols;
  const rows = dimGrid.rows;

  const height = useMemo(() => {
    if (columns === 0 || rows === 0) return 100;
    const gridHeight = parentSize.height / rows;
    const calcWidth = (gridHeight * 16) / 9;
    const totalWidth = calcWidth * columns;
    return Math.min((totalWidth / parentSize.width) * 100, 100);
  }, [columns, rows, parentSize]);

  const size = 12 / (columns || 1);

  return (
    <Box
      width="100%"
      height="100%"
      ref={(node) => {
        parentRef.current = node;
        if (ref && Object.hasOwnProperty.call(ref, 'current'))
          ref.current = node;
      }}
      display="flex"
      overflow="hidden"
      position="relative"
    >
      <Fade
        in={!fullScreen}
        unmountOnExit
        appear={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid
            container
            spacing={0.5}
            justifyContent="center"
            overflow="hidden"
            width={`${height}%`}
            sx={{
              borderRadius: 2,
            }}
          >
            <AnimatePresence key="content-grid-layout">
              {data?.map(({ id, children }) => (
                <MotionGrid
                  key={id}
                  size={size}
                  layoutId={id}
                  sx={{
                    aspectRatio,
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  layout
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                >
                  <Paper
                    sx={{
                      height: 'calc(100% - 2px)',
                      width: 'calc(100% - 2px)',
                      boxShadow: 0,
                      overflow: 'hidden',
                      position: 'relative',
                      borderRadius: 2,
                      cursor: 'pointer',
                    }}
                  >
                    {children}
                  </Paper>
                </MotionGrid>
              ))}
            </AnimatePresence>
          </Grid>
        </div>
      </Fade>
    </Box>
  );
});

GridLayoutView.displayName = 'GridLayoutView';
export default React.memo(GridLayoutView);

GridLayoutView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      children: PropTypes.node.isRequired,
    })
  ).isRequired,
};
