import { styled, Box as MuiBox } from "@mui/material";
import screenWidthDivider from "./screenWidthDivider";
import screenHeightDivider from "./screenHeightDivider";

const ItemContainer = styled(({len, rootHeight, ...otherProps}) => {
    const margin = 10;
    return (
      <MuiBox
        {...otherProps}
        sx={{
          flex: 1,
          width: {
            xs: `calc(${100 * screenWidthDivider('xs', len)}% - ${margin}px)`,
            sm: `calc(${100 * screenWidthDivider('sm', len)}% - ${margin}px)`,
            md: `calc(${100 * screenWidthDivider('md', len)}% - ${margin}px)`,
            lg: `calc(${100 * screenWidthDivider('lg', len)}% - ${margin}px)`,
            xl: `calc(${100 * screenWidthDivider('xl', len)}% - ${margin}px)`,
          },
          height: {
            xs: (rootHeight * screenHeightDivider('xs', len)) - margin,
            sm: (rootHeight * screenHeightDivider('sm', len)) - margin,
            md: (rootHeight * screenHeightDivider('md', len)) - margin,
            lg: (rootHeight * screenHeightDivider('lg', len)) - margin,
            xl: (rootHeight * screenHeightDivider('xl', len)) - margin
          }
        }}
      />
    );
  })(({theme}) => ({
      display: 'flex',
      flex: 'none',
      alignContent: 'stretch',
      boxSizing: 'border-box',
      position: 'relative',
      borderRadius: theme.spacing(.3, .3, .3, .33),
      overflow: 'hidden',
      boxShadow: theme.shadows[1],
  }));

export const ListContainer = styled(MuiBox)(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    gap: '5px',
  }));

export default ItemContainer;