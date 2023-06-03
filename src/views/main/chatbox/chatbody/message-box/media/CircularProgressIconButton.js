import {
    CircularProgress,
    Box as MuiBox,
    alpha,
    useTheme,
} from '@mui/material';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

export default function CircularProgressIconButton ({
    CircularProgressProps, 
    IconButtonProps, 
    loading, 
    bgcolor, 
    isMine, 
    outerLabel,
    ...otherProps
}) {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <MuiBox 
            {...otherProps}
            sx={{ 
                position: 'relative',
                backdropFilter: 'blur(2px)',
                ...otherProps?.sx || {},
            }}
            component="div"
        >
            <MuiBox 
                borderRadius={5} 
                boxShadow={10}
                overflow="hidden"
                // bgcolor="#00000050"
            >
                <MuiBox
                    {...IconButtonProps}
                    component="div"
                    sx={{
                        backdropFilter: `blur(${theme.customOptions.blur})`,
                        ...styles.iconButton,
                        ...IconButtonProps?.sx || {}}}
                >
                {loading ?  <ClearOutlinedIcon /> : <VerticalAlignBottomIcon />} 
                {outerLabel && '+ ' + outerLabel}
                </MuiBox>
                {loading && (
                <CircularProgress
                    {...CircularProgressProps}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
                )}
              </MuiBox>
      </MuiBox>
    )
}

CircularProgressIconButton.defaultProps = {
    CircularProgressProps: {},
    loading: false,
}

const useStyles = (theme) => ({
    iconButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(1),
      borderRadius: '50%',
      backgroundColor: alpha(theme.palette.common[theme.palette.mode === 'light' ? 'white' : 'black'], 0.5),
      color: theme.palette.text.primary,
      boxShadow: theme.shadows[1],
      transition: theme.transitions.create(['background-color', 'box-shadow'], {
        duration: theme.transitions.duration.short,
      }),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common[theme.palette.mode === 'light' ? 'white' : 'black'], 0.25),
        boxShadow: theme.shadows[3],
      },
      '&:active': {
        boxShadow: theme.shadows[5],
        backgroundColor: alpha(theme.palette.common[theme.palette.mode === 'light' ? 'white' : 'black'], 0.35),
      },
      '&:focus': {
        outline: 'none',
        boxShadow: `0 0 0 0.2rem ${alpha(theme.palette.primary.main, 0.5)}`,
      },
    },
});