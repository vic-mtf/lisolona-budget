import React, { useEffect, useRef } from "react"
import {
  Grid as _Grid,
  WindowScroller as _WindowScroller,
  AutoSizer as _AutoSizer
} from "react-virtualized";
import { styled } from "@mui/material";

import { useWindowSize } from "./useWindowSize"

const Grid = _Grid
const WindowScroller = _WindowScroller
const AutoSizer = _AutoSizer


const Container = styled('div')(() => ({
    flex: 1,
    "& > div": {
      height: 'unset !important',
    },
    [`.ReactVirtualized__Grid,
    .ReactVirtualized__Grid__innerScrollContainer`]: {
      overflow: 'visible !important',
    }
  }))


export function VirtualizedGrid({
  items,
  renderItem,
  itemHeight,
  itemMinWidth,
  numColumns
}) {
  const gridRef = useRef(null)
  const containerRef = useRef(null)
  const containerWidth = containerRef?.current?.clientWidth

  const windowSize = useWindowSize()

  useEffect(() => {
    gridRef.current?.recomputeGridSize()
  }, [windowSize])

  function calculateColumnCount(width) {
    return Math.floor(width / itemMinWidth)
  }

  function calculateItemWidth(width, columnCount) {
    return width / columnCount
  }

  return (
    <Container ref={containerRef}>
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {() => {
              const columnCount =
                numColumns ?? calculateColumnCount(containerWidth)
              const rowCount = Math.ceil(items.length / columnCount)
              const itemWidth = calculateItemWidth(containerWidth, columnCount)

              return (
                <Grid
                  ref={gridRef}
                  autoHeight
                  columnCount={columnCount}
                  columnWidth={itemWidth}
                  width={containerWidth || 0}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={itemHeight}
                  isScrolling={isScrolling}
                  scrollTop={scrollTop}
                  onScroll={onChildScroll}
                  cellRenderer={props => {
                    const fullProps = {
                      ...props,
                      items,
                      columnCount: columnCount
                    }
                    return renderItem(fullProps)
                  }}
                />
              )
            }}
          </AutoSizer>
        )}
      </WindowScroller>
    </Container>
  )
}
