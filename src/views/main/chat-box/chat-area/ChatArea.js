import {
    Box as MuiBox
} from '@mui/material';
import InfiniteLoaderMessage from './infinite-loader-message/InfiniteLoaderMessage';

export default function ChatArea ({ target, messages, small }) {
    return ( 
        <MuiBox
            overflow="hidden"
            display="flex"
            position="relative"
            sx={{zIndex: theme => theme.zIndex.drawer}}
            flex={1}
            width="100%"
        >
            <InfiniteLoaderMessage
                data={messages}
                target={target}
                small={small}
            />
        </MuiBox>
    )
}
