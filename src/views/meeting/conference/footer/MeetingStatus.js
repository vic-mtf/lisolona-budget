import {
    Stack,
    Box as MuiBox,
    Divider,
} from '@mui/material';
import Typography from '../../../../components/Typography';
import { useMeetingData } from '../../../../utils/MeetingProvider';
import { useEffect, useMemo, useState } from 'react';
import store from '../../../../redux/store';
import { useSelector } from "react-redux";
import formatDuration from '../../../../utils/formatDuration';
import getFullName from '../../../../utils/getFullName';

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
                <Typography color="text.secondary" width={35}>
                    <Timer/>
                </Typography>
                <Divider orientation="vertical" sx={{borderWidth: 1}} flexItem />
                <Typography color="text.secondary">{store.getState().meeting.meetingId}</Typography>
            </MuiBox>
        </Stack>
    )
}

const Name = () => {
    const [
        { meetingData },
        { settersMembers }
    ] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);
    const user = useSelector(store => store.meeting.me);

    const participants = useMemo(() => (
        settersMembers.getTableSubsetByFilter(({id}) => id !== user?.id)
        .map(({identity:target}) => ({
            id: target?._id,
            name: getFullName(target),
            email: target?.email,
            avatarSrc: target?.imageUrl,
        }))
    ), [settersMembers, user?.id]);

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

const Timer = () => {
    const [time, setTime] = useState(formatDuration(Date.now()));
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(formatDuration(store.getState().meeting.startedAt));
        }, 1000);
    
        return () => {
          clearInterval(interval);
        };
      }, []);
    
    return time;
};

export function formatNames(namesList) {
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