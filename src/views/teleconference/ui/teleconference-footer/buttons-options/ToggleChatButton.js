import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { BottomNavigationAction } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '../../../../../components/Typography';
import { addData } from '../../../../../redux/data';
import { useTeleconferenceUI } from '../../TeleconferenceUI';

export default function ToggleChatButton () {
    const [{openChatBox},{setOpenChatBox}] = useTeleconferenceUI();
    const {targetId, chatId} = useSelector(store => { 
        const modeId = store.teleconference.meetingId;
        const type = store.teleconference.type;
        const from = store.teleconference.from;
        const targetId = type === 'direct' ? from : modeId;
        const chatId = store.data.chatId;
        return {targetId, chatId};
        
    });
    const dispatch = useDispatch();
    const hanldeClick = useCallback(() => {
        setOpenChatBox(state => {
            const toggleState = !state;
            if(toggleState && targetId !== chatId)
                dispatch(addData({key: 'chatId', data: targetId}));
            return toggleState;
        });
    },[dispatch, targetId, setOpenChatBox, chatId]);

    return (
       <div>
            <BottomNavigationAction
                onClick={hanldeClick}
                icon={<ChatOutlinedIcon fontSize="small" />} 
                selected={openChatBox}
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