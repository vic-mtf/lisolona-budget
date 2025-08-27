import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useMemo } from "react";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import useElementSize from "../../../../../hooks/useElementSize";

const LiveInteractionGridView = React.forwardRef((_, ref) => {
  const grids = Array.from({ length: 20 }, (_, i) => i);
  const matches = useSmallScreen();
  const [parentRef, parentSize] = useElementSize();

  const maxColumnsMd = useMemo(() => {
    if (grids.length <= 1) return 1;
    if (grids.length <= 2) return 2;
    if (grids.length <= 4) return 2;
    if (grids.length <= 9) return 3;
    if (grids.length <= 16) return 4;
    if (grids.length <= 20) return 5;
    if (grids.length <= 24) return 6;
    if (grids.length <= 35) return 7;
    if (grids.length <= 48) return 8;
    if (grids.length <= 54) return 9;
    if (grids.length <= 70) return 10;
    if (grids.length <= 88) return 11;
    if (grids.length <= 108) return 12;
  }, [grids]);

  const height = useMemo(() => {
    const rows = Math.ceil(grids.length / maxColumnsMd);
    const gridHeight = parentSize.height / rows;
    const calcWidth = (gridHeight * 16) / 9;
    const totalWidth = calcWidth * maxColumnsMd;
    return Math.min((totalWidth / parentSize.width) * 100, 100);
  }, [grids, maxColumnsMd, parentSize]);

  const maxColumnsXs = useMemo(() => {
    if (grids.length <= 2) return 1;
    if (grids.length <= 4) return 2;
    return 2;
  }, [grids]);

  const size = 12 / (matches ? maxColumnsXs : maxColumnsMd);

  const aspectRatioXs = useMemo(() => {
    if (grids.length <= 1) return 9 / 16;
    if (grids.length <= 2) return 4 / 3;
    if (grids.length <= 4) return 3 / 4;
    return 0.85;
    // if (grids.length <= 4) return 9 / 16;
  }, [grids]);

  return (
    <Box
      width={"100%"}
      height={"100%"}
      bgcolor='lightblue'
      ref={(node) => {
        parentRef.current = node;
        if (parentRef && Object.hasOwnProperty.call(parentRef, "current"))
          parentRef.current = node;
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
        {grids.map((grid, index) => (
          <Grid
            item
            key={grid}
            bgcolor='orange'
            size={size}
            sx={{
              aspectRatio: {
                md: 16 / 9,
                xs: aspectRatioXs,
              },
            }}>
            {index + 1} gird
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

LiveInteractionGridView.displayName = "LiveInteractionGridView";
export default React.memo(LiveInteractionGridView);
