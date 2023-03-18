import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { BottomNavigationAction } from '@mui/material';
import Typography from '../../../../../components/Typography';

export default function ToggleChatButton () {
    //const [turnOn, setTurnOn] = useState(false);

    return (
       <div>
            <BottomNavigationAction
                disabled
                icon={<ChatOutlinedIcon fontSize="small" />} 
                label={
                    <Typography
                        variant="caption" 
                        fontSize="10px" 
                        color="inherit"
                    >
                        Discussions
                    </Typography>
                }
                showLabel
                //onClick={() => setTurnOn(state => !state)}
                sx={{borderRadius: 1}}
            />
        </div>
    )
}