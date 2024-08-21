import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import PropTypes from "prop-types";

const props = ["status", "active"];

const colors = {
  online: "#44b700",
  offline: "#bdbdbd",
  away: "#ff3d00",
};

const SignalBadge = styled(Badge, {
  shouldForwardProp: (prop) => !props.includes(prop),
})(({ theme, status = "offline", active = false }) => ({
  "& .MuiBadge-badge": {
    color: colors[status],
    backgroundColor: "currentColor",
    ...(active && {
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.5s infinite ease-in-out",
        border: ".5px solid currentColor",
        content: '""',
      },
      "@keyframes ripple": {
        "0%": {
          transform: "scale(.5)",
          opacity: 1,
        },
        "100%": {
          transform: "scale(2.5)",
          opacity: 0,
        },
      },
    }),
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

SignalBadge.propTypes = {
  status: PropTypes.oneOf(["online", "offline", "away"]),
  active: PropTypes.bool,
};

export default SignalBadge;
