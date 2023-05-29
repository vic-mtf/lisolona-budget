
import {
    CircularProgress,
    Box as MuiBox,
    Paper,
} from '@mui/material';
import IconButton from '../../../../../../components/IconButton';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

export default function CircularProgressIconButton ({CircularProgressProps, IconButtonProps, loading, bgcolor, ...otherProps}) {
    return (
        <MuiBox 
        {...otherProps}
            sx={{ 
                position: 'relative',
                ...otherProps?.sx || {},
            }}
        >
            <MuiBox 
                borderRadius={5} 
                bgcolor={bgcolor}
                boxShadow={5}
            >
                <IconButton
                    {...IconButtonProps}
                    size="medium"
                    sx={{
                        ...IconButtonProps?.sx || {},
                    }}
                >
                {loading ?  <ClearOutlinedIcon /> : <GetAppOutlinedIcon />}
                </IconButton>
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