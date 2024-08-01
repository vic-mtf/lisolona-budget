import { styled, Typography as MuiTypography } from "@mui/material";
import { forwardRef } from "react";

const Typography = styled(
  forwardRef((props, ref) => (
    <MuiTypography
      variant='body2'
      component='div'
      color='text.primary'
      ref={ref}
      {...props}
    />
  ))
)(() => ({
  //color: theme.palette.text.primary,
}));

export default Typography;
