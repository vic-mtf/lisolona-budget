import { ToggleButtonGroup as TBG, styled } from "@mui/material";

const ToggleButtonGroup = styled(TBG)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0, 0.125, 0, 0.125),
        border: `.01px solid transparent`,
        flexWrap: "nowrap",
        '&.Mui-disabled': { border: `.01px solid transparent`},
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

ToggleButtonGroup.defaultProps = {
    size: 'small',
    onMouseDown: event => event.preventDefault(),
    onMouseUp: event => event.preventDefault()
};

export default ToggleButtonGroup;