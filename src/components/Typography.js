import { styled, Typography as MuiTypography } from "@mui/material";

const Typography = styled(MuiTypography)(({theme}) => ({
    //color: theme.palette.text.primary,
}));

Typography.defaultProps = {
    variant: 'body2',
    component: 'div',
    color: 'text.primary'
}

export default Typography;