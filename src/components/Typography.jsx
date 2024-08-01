import { styled, Typography as MuiTypography } from "@mui/material";

const Typography = styled((props) => (
  <MuiTypography
    variant='body2'
    component='div'
    color='text.primary'
    {...props}
  />
))(() => ({
  //color: theme.palette.text.primary,
}));

export default Typography;
