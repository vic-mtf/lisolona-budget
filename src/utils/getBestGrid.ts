const getBestGrid = (
  containerWidth,
  containerHeight,
  itemCount = 0,
  aspectRatio = 16 / 9
) => {
  let bestGrid = null;
  let minUnusedSpace = Infinity;

  for (let rows = 1; rows <= itemCount; rows++) {
    const cols = Math.ceil(itemCount / rows);

    const cellWidth = containerWidth / cols;
    const cellHeight = cellWidth / aspectRatio;

    if (cellHeight * rows > containerHeight) {
      const altCellHeight = containerHeight / rows;
      const altCellWidth = altCellHeight * aspectRatio;

      if (altCellWidth * cols > containerWidth) continue;

      const usedSpace = altCellWidth * cols * altCellHeight * rows;
      const unusedSpace = containerWidth * containerHeight - usedSpace;
      const balanceScore = Math.abs(rows - cols);

      if (
        unusedSpace < minUnusedSpace ||
        (unusedSpace === minUnusedSpace &&
          balanceScore < bestGrid?.balanceScore)
      ) {
        bestGrid = {
          rows,
          cols,
          cellWidth: altCellWidth,
          cellHeight: altCellHeight,
          emptySlots: rows * cols - itemCount,
          balanceScore,
        };
        minUnusedSpace = unusedSpace;
      }
    } else {
      const usedSpace = cellWidth * cols * cellHeight * rows;
      const unusedSpace = containerWidth * containerHeight - usedSpace;
      const balanceScore = Math.abs(rows - cols);

      if (
        unusedSpace < minUnusedSpace ||
        (unusedSpace === minUnusedSpace &&
          balanceScore < bestGrid?.balanceScore)
      ) {
        bestGrid = {
          rows,
          cols,
          cellWidth,
          cellHeight,
          emptySlots: rows * cols - itemCount,
          balanceScore,
        };
        minUnusedSpace = unusedSpace;
      }
    }
  }

  return (
    bestGrid || {
      rows: 0,
      cols: 0,
      cellWidth: 0,
      cellHeight: 0,
      emptySlots: 0,
      balanceScore: 0,
    }
  );
};

export default getBestGrid;
