import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { BottomNavigationAction } from '@mui/material';
import Typography from '../../../../../components/Typography';
import { useTeleconferenceUI } from '../../TeleconferenceUI';

export default function ToggleChatButton () {
    //const [turnOn, setTurnOn] = useState(false);
    const [,{setOpenChatBox}] = useTeleconferenceUI();
    return (
       <div>
            <BottomNavigationAction
                onClick={() =>setOpenChatBox(state => !state)}
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
                sx={{
                    borderRadius: 1, 
                    color: 'inherit'
                }}
            />
        </div>
    )
}