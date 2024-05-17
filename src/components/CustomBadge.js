import { Badge, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import propTypes from 'prop-types';

export const greenColor = '#44b700';
export const greyColor = grey[500];
const shouldForwardProp = (prop) => !['online', 'active'].includes(prop);

const CustomBadge = styled(Badge, { shouldForwardProp })(({ theme, online, active }) => ({
  '& .MuiBadge-badge': {
      zIndex: 0,
      backgroundColor: online ? greenColor : greyColor,
      color: online ? greenColor : greyColor,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: active ? 'ripple 1.2s infinite ease-in-out' : 'none',
        border: '2px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    }
}));

CustomBadge.defaultProps = {
  online: true,
}

CustomBadge.propTypes = {
  onLine: propTypes.bool,
  active: propTypes.bool,
}
export default CustomBadge;