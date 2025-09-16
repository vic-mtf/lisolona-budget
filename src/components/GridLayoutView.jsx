import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { motion, AnimatePresence } from "framer-motion";
import useElementSize from "../hooks/useElementSize";
import getBestGrid from "../utils/getBestGrid";
import PropTypes from "prop-types";

const MotionGrid = motion.create(Grid);

const GridLayoutView = React.forwardRef(({ data }, ref) => {
  const [parentRef, parentSize] = useElementSize();

  const aspectRatio = useMemo(() => 16 / 9, []);

  const nbr = useMemo(() => data.length, [data]);

  const dimGrid = useMemo(
    () => getBestGrid(parentSize.width, parentSize.height, nbr),
    [nbr, parentSize]
  );

  const columns = useMemo(() => dimGrid.cols, [dimGrid]);
  const rows = useMemo(() => dimGrid.rows, [dimGrid]);

  const height = useMemo(() => {
    const gridHeight = parentSize.height / rows;
    const calcWidth = (gridHeight * 16) / 9;
    const totalWidth = calcWidth * columns;
    return Math.min((totalWidth / parentSize.width) * 100, 100);
  }, [columns, rows, parentSize]);

  const size = useMemo(() => 12 / columns, [columns]);

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
      overflow='hidden'>
      <Grid
        container
        display='flex'
        spacing={0.5}
        justifyContent='center'
        overflow='hidden'
        width={`${height}%`}>
        <AnimatePresence>
          {data?.map(({ id, children }) => (
            <MotionGrid
              key={id}
              size={size}
              sx={{ aspectRatio, position: "relative" }}
              layout
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}>
              <Paper sx={{ height: "100%", width: "100%", boxShadow: 0 }}>
                {children}
              </Paper>
            </MotionGrid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
});

GridLayoutView.displayName = "GridLayoutView";
export default React.memo(GridLayoutView);
GridLayoutView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
