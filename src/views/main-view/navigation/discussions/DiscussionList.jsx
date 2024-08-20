import { Box, List, Stack, Zoom } from "@mui/material";
import useScrollEnd from "../../../../hooks/useScrollEnd";
import { Virtuoso } from "react-virtuoso";
import React from "react";
import PropTypes from "prop-types";
import Typography from "../../../../components/Typography";

const DiscussionList = React.memo(({ data, itemContent }) => {
  const [show, { onScroll }] = useScrollEnd();

  console.log(data.length);

  return (
    <Box
      overflow='hidden'
      height='100%'
      sx={{
        position: "relative",
        boxShadow: (theme) =>
          !show ? `inset 0 5px 5px -5px ${theme.palette.divider}` : 0,
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
        <Virtuoso
          style={{ height: "100%" }}
          id='virtuoso-container-list'
          components={{ List }}
          data={data}
          itemContent={itemContent}
          // topItemCount={2}
          onScroll={onScroll}
        />
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
