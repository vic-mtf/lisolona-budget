import { styled, ToggleButtonGroup } from "@mui/material";

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
      margin: theme.spacing(0.5),
      border: `.01px solid transparent`,
      //borderColor: 'transparent',
      '&.Mui-disabled': {
        border: `.01px solid transparent`,
        //borderColor: 'transparent',
      },
      '&:not(:first-of-type)': {
        borderRadius: theme.shape.borderRadius,
      },
      '&:first-of-type': {
        borderRadius: theme.shape.borderRadius,
      },
    },
  }));

  export default CustomToggleButtonGroup;