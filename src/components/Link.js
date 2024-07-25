import { styled, Typography as MuiTypography } from "@mui/material";

const Link = styled((props) => (
  <MuiTypography variant='body2' component='a' fontWeight='bold' {...props} />
))(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

export default Link;
