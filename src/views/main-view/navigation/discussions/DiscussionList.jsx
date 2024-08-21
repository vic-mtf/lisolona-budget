import { Box, List as MUIList, Stack, Zoom } from "@mui/material";
import useScrollEnd from "../../../../hooks/useScrollEnd";
import { Virtuoso } from "react-virtuoso";
import React from "react";
import PropTypes from "prop-types";
import Typography from "../../../../components/Typography";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import DiscussionItem from "./DiscussionItem";
import { useState } from "react";

const DiscussionList = React.memo(({ data, itemContent }) => {
  const [showBoxShadow, setShowBoxShadow] = useState(false);

  return (
    <Box
      overflow='hidden'
      height='100%'
      sx={{
        position: "relative",
        boxShadow: (theme) =>
          `inset 0 5px 5px -5px ${
            showBoxShadow ? theme.palette.divider : "transparent"
          }`,
        "&  > #virtuoso-container-list": {
          overflow: "hidden",
          overflowY: "auto",
          height: "100%",
        },
      }}>
      {data.length === 0 ? (
        <Zoom
          unmountOnExit
          in
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            left: 0,
          }}>
          <Stack>
            <Typography color='text.secondary'>
              Aucune discussion trouvée
            </Typography>
          </Stack>
        </Zoom>
      ) : (
        <AutoSizer>
          {({ width, height }) => (
            <List
              height={height}
              width={width}
              rowCount={data.length}
              rowHeight={72.5}
              rowRenderer={itemContent}
              noContentRenderer={MUIList}
              style={{ overflowX: "hidden" }}
              onScroll={({ scrollTop }) => {
                if (showBoxShadow && scrollTop <= 0) setShowBoxShadow(false);
                if (!showBoxShadow && scrollTop > 0) setShowBoxShadow(true);
              }}
            />
          )}
        </AutoSizer>
      )}
    </Box>
  );
});

DiscussionList.displayName = "DiscussionList";
DiscussionList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  itemContent: PropTypes.func,
};

export default DiscussionList;
