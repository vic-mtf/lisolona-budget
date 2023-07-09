import {
    Stack,
    Box as MuiBox,
    Divider,
} from '@mui/material';
import Typography from '../../../../components/Typography';
import { useMeetingData } from '../../../../utils/MeetingProvider';
import { useMemo } from 'react';
import store from '../../../../redux/store';

export default function MeetingStatus () {
    
    return (
        <Stack
            //spacing={}
        >
            <Name/>
            <MuiBox
                sx={{
                    display: 'flex',
                    width: 'fit-content',
                    '& hr': { mx: 1 },
                    '& > div': {
                        display: 'inline-flex',
                        alignItems: 'center',
                    }
                }}
            >
                <Typography >00:00</Typography>
                <Divider orientation="vertical"  flexItem variant="middle" />
                <Typography >{store.getState().meeting.id}</Typography>
            </MuiBox>
        </Stack>
    )
}

const Name = () => {
    const [{meetingData, participants}] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);

    return (
        <Typography
            variant="body1"
            fontWeight="bold"
            
        >
            {target?.type === 'direct' ? 
            formatNames(participants.map(({name}) => name)):
            target?.name}
        </Typography>
    )
}

function formatNames(namesList) {
    if (namesList.length === 1) {
        return namesList[0];
    } else if (namesList.length === 2) {
        return `${namesList[0]} et ${namesList[1]}`;
    } else {
        const otherNamesCount = namesList.length - 2;
        const otherNames = namesList.slice(2).join(", ");
        return `${namesList[0]}, ${namesList[1]} et ${otherNamesCount} autres (${otherNames})`;
    }
    }