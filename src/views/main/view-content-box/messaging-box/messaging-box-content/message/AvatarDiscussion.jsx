import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useState } from "react";
import SignalBadge from "./SignalBadge";

const AvatarDiscussion = ({
  src,
  id,
  active,
  status,
  invisible,
  ...otherProps
}) => {
  const [opacity, setOpacity] = useState(0);
  const style = useMemo(() => colorFromId(id), [id]);

  return (
    <SignalBadge
      variant='dot'
      invisible={invisible}
      active={active}
      status={status}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}>
      <div style={{ position: "relative" }}>
        <Avatar
          variant='rounded'
          sx={{ ...style, opacity: opacity ? 0 : 1 }}
          {...otherProps}
        />
        <Avatar
          src={src}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          variant='rounded'
          slotProps={{
            img: {
              loading: "lazy",
              onLoad: () => setOpacity(1),
              sx: {
                opacity,
                transition: (theme) =>
                  theme.transitions.create("opacity", {
                    easing: theme.transitions.easing.easeIn,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
              },
            },
          }}
          {...otherProps}
        />
      </div>
    </SignalBadge>
  );
};

AvatarDiscussion.propTypes = {
  src: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  status: PropTypes.oneOf(["online", "offline", "away"]),
  invisible: PropTypes.bool,
};

export default AvatarDiscussion;

function colorFromId(id, mode = "light") {
  const num = parseInt(id?.toString()?.substr(-6), 16);
  let lightness = mode === "light" ? 70 : 30;
  return {
    backgroundColor: `hsl(${num % 360}, 100%, ${lightness}%)`,
    color: `hsl(${num % 360}, 100%, ${lightness - 30}%)`,
  };
}
