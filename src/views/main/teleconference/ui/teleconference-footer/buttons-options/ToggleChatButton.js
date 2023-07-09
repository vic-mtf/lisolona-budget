import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { BottomNavigationAction } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '../../../../../../components/Typography';
import { addData } from '../../../../../../redux/data';
import { useTeleconferenceUI } from '../../TeleconferenceUI';

export default function ToggleChatButton () {
    const [{openChatBox},{
        setOpenChatBox,
        setOpenNavMembers
    }] = useTeleconferenceUI();
    const targetId = useSelector(store => store.data.targetId);
    const modeId = useSelector(store => store.teleconference.meetingId);
    const type = useSelector(store => store.teleconference.type);
    const from = useSelector(store => store.teleconference.from);

    const callerId = useMemo(() => 
        type === 'direct' ? from : modeId,
        [type, from, modeId]
    );

    const dispatch = useDispatch();
    const hanldeClick = useCallback(() => {
        setOpenChatBox(state => {
            const toggleState = !state;
            if(toggleState && targetId !== callerId)
                dispatch(addData({key: 'targetId', data: targetId}));
            return toggleState;
        });
        setOpenNavMembers(false);
    },[dispatch, targetId, setOpenChatBox, callerId]);

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