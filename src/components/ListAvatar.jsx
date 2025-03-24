import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { colorFromId } from "../utils/color";
import SignalBadge from "./SignalBadge";

const ListAvatar = ({
  src,
  id,
  active,
  status,
  invisible = true,
  SignalBadgeProps,
  sx,
  ...otherProps
}) => {
  const [opacity, setOpacity] = useState(0);
  const style = useMemo(() => colorFromId(id), [id]);

  return (
    <SignalBadge
      variant='dot'
      active={active}
      status={status}
      invisible={active ? false : invisible}
      sx={{ position: "relative", ...SignalBadgeProps?.sx }}
      {...SignalBadgeProps}>
      {!opacity && <Avatar sx={{ ...style, ...sx }} {...otherProps} key={id} />}
      {src && (
        <Avatar
          src={src}
          sx={{
            opacity,
            ...(!opacity && {
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              width: "100%",
              height: "100%",
              zIndex: -10,
            }),
            transition: (theme) =>
              theme.transitions.create("opacity", {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.enteringScreen,
              }),
            ...sx,
          }}
          slotProps={{
            img: {
              loading: "lazy",
              onLoad: () => setOpacity(1),
            },
          }}
          {...otherProps}
        />
      )}
    </SignalBadge>
  );
};

ListAvatar.propTypes = {
  src: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  status: PropTypes.oneOf(["online", "offline", "away"]),
  invisible: PropTypes.bool,
  SignalBadgeProps: PropTypes.object,
  sx: PropTypes.object,
};

export default ListAvatar;
