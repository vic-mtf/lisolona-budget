import { Fab, Box as MuiBox } from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { useCallback, useLayoutEffect, useState } from "react";
import { Badge, Zoom } from "@mui/material";

export const MAX_OFFSET = 100;

export default function AutoScrollDown({
  rootRef,
  news = 0,
  onViewNewMessages,
}) {
  const [show, setShow] = useState(false);
  const handleScrollDown = useCallback(() => {
    const root = rootRef?.current;
    const name = "_auto-scroll-down";
    const customEvent = new CustomEvent(name, {
      name,
      detail: { type: "manual" },
    });
    if (news) {
      root?.dispatchEvent(customEvent);
      onViewNewMessages();
    } else root?.scrollTo({ top: 0 });
  }, [rootRef, onViewNewMessages, news]);

  useLayoutEffect(() => {
    const root = rootRef?.current;
    if (root)
      root.onscroll = (event) => {
        const root = event.target;
        const offset = Math.abs(root.scrollTop);
        if (offset <= MAX_OFFSET && show) setShow(false);
        if (offset > MAX_OFFSET && !show) setShow(true);
      };
  }, [show, rootRef]);

  return (
    <Zoom in={show}>
      <MuiBox
        position='absolute'
        bottom={15}
        right={15}
        sx={{ zIndex: (theme) => theme.zIndex.drawer }}>
        <Badge
          color='primary'
          badgeContent={news}
          sx={{
            "& .MuiBadge-badge": news
              ? {}
              : {
                  display: "none",
                },
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}>
          <Fab size='small' onClick={handleScrollDown}>
            <ExpandMoreOutlinedIcon fontSize='small' />
          </Fab>
        </Badge>
      </MuiBox>
    </Zoom>
  );
}
