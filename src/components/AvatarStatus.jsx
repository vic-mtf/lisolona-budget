import { ListItemAvatar, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";
import Avatar from "./Avatar";
import CustomBadge from "./CustomBadge";
import { generateColorsFromId } from "../utils/genColorById";
import getShort from "../utils/getShort";
import useSocket from "../hooks/useSocket";
import { useSelector } from "react-redux";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

const AvatarStatus = React.memo(
  ({
    type = "direct",
    name,
    avatarSrc,
    id,
    invisible,
    sx = {},
    size,
    active = false,
    online,
    BadgeProps,
    mode,
  }) => {
    const status = useSelector((store) => store.status[id]);
    const isEmittedRef = useRef(true);
    const socket = useSocket();
    const theme = useTheme();
    const { background, text } = generateColorsFromId(
      id,
      mode
        ? typeof mode === "function"
          ? mode(theme.palette.mode)
          : mode
        : "light"
    );

    const avatarSx = useMemo(
      () => ({
        ...sx,
        color: text,
        bgcolor: background,
        fontWeight: "bold",
        fontSize: 15,
      }),
      [background, text, sx]
    );

    useEffect(() => {
      if (!status && !invisible && online === undefined) {
        isEmittedRef.current = true;
        if (type === "direct" && isEmittedRef.current) {
          socket?.emit("status", { who: id });
          isEmittedRef.current = false;
        }
      }
    }, [type, socket, id, status, invisible, online]);

    return (
      <ListItemAvatar>
        <CustomBadge
          overlap='rectangular'
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant='dot'
          active={active}
          online={Boolean(online) || status === "online"}
          invisible={invisible}
          {...BadgeProps}>
          <AvatarFadeLoading
            src={avatarSrc}
            srcSet={avatarSrc}
            alt={name}
            children={
              type === "direct" ? (
                getShort(name)?.toUpperCase() || undefined
              ) : (
                <GroupsOutlinedIcon
                  fontSize='medium'
                  sx={{
                    ...(size
                      ? {
                          fontSize: size / (8 / 6),
                        }
                      : {}),
                  }}
                />
              )
            }
            sx={{
              ...avatarSx,
              ...(size
                ? {
                    height: size,
                    width: size,
                    // fontSize: size / (8/6)
                  }
                : {}),
              textTransform: "capitalize",
              ...(invisible
                ? {
                    border: "none",
                  }
                : {}),
            }}
          />
        </CustomBadge>
      </ListItemAvatar>
    );
  }
);

const AvatarFadeLoading = React.memo(({ ...props }) => {
  return (
    <Avatar
      variant='rounded'
      {...props}
      slotProps={{
        img: { loading: "lazy" },
      }}
    />
  );
});

AvatarStatus.displayName = "AvatarStatus";
export default AvatarStatus;
