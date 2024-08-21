import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useState } from "react";

import { colorFromId } from "../../../../utils/color";
import SignalBadge from "../../../../components/SignalBadge";

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
          variant='rounded'
          sx={{
            opacity,
            position: "absolute",
            top: 0,
            left: 0,
            transition: (theme) =>
              theme.transitions.create("opacity", {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
          slotProps={{
            img: {
              loading: "lazy",
              onLoad: () => setOpacity(1),
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
