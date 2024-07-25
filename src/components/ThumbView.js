import { Box as MuiBox, Tabs } from "@mui/material";
import { FixedSizeList } from "react-window";
import { useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";

export default function ThumbView({ size = 100, data = [], ...otherProps }) {
  const rootRef = useRef();

  const Column = ({ index, style }) => (
    <MuiBox sx={style} key={index}>
      {data[index]}
    </MuiBox>
  );

  return (
    <MuiBox
      position='relative'
      overflow='hidden'
      width='100%'
      sx={{
        ...otherProps?.sx,
        height: size + 15,
        "& > .auto-sizer-container": {
          overflow: "hidden",
        },
        "& > .container": {
          //...scrollBarSx,
          overflow: "hidden",
          overflowY: "auto",
          display: "flex",
          gap: 1,
        },
      }}
      p={0.5}
      {...otherProps}
      ref={rootRef}>
      <AutoSizer className='auto-sizer-container'>
        {({ height, width }) => (
          <FixedSizeList
            style={{
              cursor: "auto",
              overflowY: "hidden",
              overflowX: "auto",
            }}
            height={height}
            itemCount={data?.length}
            itemSize={size}
            className='container'
            layout='horizontal'
            width={width}>
            {Column}
          </FixedSizeList>
        )}
      </AutoSizer>
    </MuiBox>
  );
}
