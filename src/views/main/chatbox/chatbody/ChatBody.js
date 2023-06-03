import {
    Box as MuiBox
} from '@mui/material';
import { useMemo } from 'react';
import MessagesContent from './messages-content/MessagesContent';
import observeLastModification from '../../../../utils/observeLastModification';
import store from '../../../../redux/store';

export default function ChatBody ({target}) {
    const id = useMemo(() => target?.id, [target?.id]);

    return ( 
        <MuiBox
            overflow="hidden"
            display="flex"
            position="relative"
            sx={{
                zIndex: theme => theme.zIndex.drawer,
            }}
            flex={1}
            key={id}
        >
            <MessagesContent target={target}/>  
        </MuiBox>
    )
}

function dispatchMessage (message, updated = false) {
    const target = store.getState().data.target;
    if(target.id === message.targetId) {
        const name = '_new-message';
        const root = document.getElementById('root');
        const customEvent = new CustomEvent(name, {
            detail: {name, message, updated}
        });
        root.dispatchEvent(customEvent);
    }
}
observeLastModification('messages', dispatchMessage);
