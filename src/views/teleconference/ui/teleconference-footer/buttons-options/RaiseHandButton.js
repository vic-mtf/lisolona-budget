import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import { BottomNavigationAction } from '@mui/material';
import Typography from '../../../../../components/Typography';

export default function RaiseHandButton () {

    return (
            <div>
                <BottomNavigationAction
                    disabled
                    icon={<PanToolOutlinedIcon fontSize="small" />} 
                    label={
                        <Typography
                            variant="caption" 
                            fontSize="10px" 
                            color="inherit"
                        >
                            Lever la main
                        </Typography>
                    }
                    color="inherit"
                    showLabel
                    //onClick={() => setTurnOn(state => !state)}
                    sx={{
                        borderRadius: 1,
                    }}
                />
            </div>
    )
}