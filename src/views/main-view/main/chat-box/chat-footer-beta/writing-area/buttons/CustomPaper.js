import { Paper, alpha, styled } from "@mui/material";

const CustomPaper = styled(props => (
    <Paper
        elevation={0}
        {...props}
    />)
    )(({ theme }) => ({
    display: 'flex',
    borderRadius: 0,
    padding: theme.spacing(0.5, 0, 0.5, 0),
    background: alpha(
        theme.palette.common[ 
            theme.palette.mode === 'light' ? 
            'black' : 'white'
    ], 0.08
    ),
    flexWrap: 'wrap',
}));

export default CustomPaper;