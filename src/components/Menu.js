import {
    Menu as MuiMenu, styled,
} from "@mui/material";

const Menu = styled((props) => (
    <MuiMenu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({theme}) => ({
    '& .MuiMenu-paper': {
        background: theme.palette.background.paper + 
        theme.customOptions.opacity,
        border: `1px solid ${theme.palette.divider}`,
        backdropFilter: `blur(${theme.customOptions.blur})`,
        overflow: 'auto',
    }
}));

Menu.defaultProps = {
    MenuListProps: { dense: true }
}
export default Menu

