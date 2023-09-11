import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import IconButton from '../../../../../components/IconButton';
import { Badge, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { setConferenceData } from '../../../../../redux/conference';
import useAudio from '../../../../../utils/useAudio';
import message_signal_audio from '../../../../../assets/miui12dr_m5r75343.mp3';

export default function MessageButton ({getVideoStream}) {
    const nav = useSelector(store => store.conference.nav);
    const selected = useMemo(() => /message-open/.test(nav), [nav]);
    const [messagesCounter, setMessagesCounter] = useState(0);
    const dispatch = useDispatch();
    const newMessageSignal = useAudio(message_signal_audio);

    useEffect(() => {
        const name = '_new-message';
        const root = document.getElementById('root');
        const handleAddMessageCounter = () => {
            setMessagesCounter(counter => counter +1);
            newMessageSignal.audio.play();
            newMessageSignal.audio.volume = .5;
        };
        if(!selected) root.addEventListener(name, handleAddMessageCounter);
        if(messagesCounter && selected) 
            setMessagesCounter(0);
        return () => {
            root.removeEventListener(name, handleAddMessageCounter);
        }
    },[selected, messagesCounter, newMessageSignal]);

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={.1}
        >
                <IconButton
                    size="small"
                    color="primary"
                    selected={selected}
                    // disabled
                    onClick={() => dispatch(
                        setConferenceData({
                             data :{ nav: selected ? 'message-close' : 'message-open' }
                        })
                    )}
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                >
                     <Badge
                        sx={{
                            '& .MuiBadge-badge': {
                                border: theme => `1px solid ${theme.palette.background.paper}`,
                              },
                        }}
                        badgeContent={messagesCounter} 
                        color="primary"
                    >
                        <MessageOutlinedIcon/>
                    </Badge>
                </IconButton>
        </Stack>
    );
}
