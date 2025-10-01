import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { motion, AnimatePresence } from "framer-motion";
import useElementSize from "../hooks/useElementSize";
import getBestGrid from "../utils/getBestGrid";
import PropTypes from "prop-types";

const MotionGrid = motion.create(Grid);
const MotionPaper = motion(Paper);

const GridLayoutView = React.forwardRef(({ data }, ref) => {
  const [parentRef, parentSize] = useElementSize();
  const [activeId, setActiveId] = useState(null);

  const aspectRatio = 16 / 9;
  const nbr = data.length;

  const dimGrid = useMemo(
    () => getBestGrid(parentSize.width, parentSize.height, nbr),
    [nbr, parentSize]
  );

  const columns = dimGrid.cols;
  const rows = dimGrid.rows;

  const height = useMemo(() => {
    const gridHeight = parentSize.height / rows;
    const calcWidth = (gridHeight * 16) / 9;
    const totalWidth = calcWidth * columns;
    return Math.min((totalWidth / parentSize.width) * 100, 100);
  }, [columns, rows, parentSize]);

  const size = 12 / columns;

  return (
    <Box
      width='100%'
      height='100%'
      ref={(node) => {
        parentRef.current = node;
        if (ref && Object.hasOwnProperty.call(ref, "current"))
          ref.current = node;
      }}
      display='flex'
      justifyContent='center'
      alignItems='center'
      overflow='hidden'
      position='relative'>
      <Grid
        container
        spacing={0.5}
        justifyContent='center'
        overflow='hidden'
        width={`${height}%`}>
        {data?.map(({ id, children }) => (
          <MotionGrid
            key={id}
            size={size}
            layoutId={id}
            sx={{ aspectRatio, position: "relative" }}
            layout
            onClick={() => setActiveId(id)}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <Paper
              sx={{
                height: "calc(100% - 2px)",
                width: "calc(100% - 2px)",
                boxShadow: 0,
                overflow: "hidden",
                position: "relative",
                borderRadius: 2,
                cursor: "pointer",
              }}>
              {children}
            </Paper>
          </MotionGrid>
        ))}
      </Grid>

      {/* Fullscreen overlay for active item */}
      <AnimatePresence>
        {activeId && (
          <Box
            component={motion.div}
            key={activeId}
            position='absolute'
            bgcolor='background.default'
            top={0}
            left={0}
            right={0}
            bottom={0}
            display='flex'
            justifyContent='center'
            alignItems='center'
            zIndex={(t) => t.zIndex.tooltip + 100}
            onClick={() => setActiveId(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <MotionPaper
              layout
              layoutId={`paper-${activeId}`}
              sx={{
                width: "90%",
                height: "90%",
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "background.paper",
                cursor: "pointer",
              }}
              transition={{
                layout: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] },
              }}>
              {data.find((d) => d.id === activeId)?.children}
            </MotionPaper>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
});

GridLayoutView.displayName = "GridLayoutView";
export default React.memo(GridLayoutView);

GridLayoutView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      children: PropTypes.node.isRequired,
    })
  ).isRequired,
};
