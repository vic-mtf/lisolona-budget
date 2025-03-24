import {
    Stack,
    Box as MuiBox,
    Divider,
} from '@mui/material';
import Typography from '../../../../components/Typography';
import { useMeetingData } from '../../../../utils/MeetingProvider';
import { useEffect, useState } from 'react';
import store from '../../../../redux/store';
import formatDuration from '../../../../utils/formatDuration';
import useGetClients from '../actions/useGetClients';

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
    const [{ target }] = useMeetingData();
    const participants = useGetClients();
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

export function formatNames(names, includeRemainingCount = false) {
    if (names.length === 0) {
      return "";
    } else if (names.length === 1) {
      return names[0];
    } else if (names.length === 2) {
      return names[0] + " et " + names[1];
    } else if (names.length === 3) {
        return names[0] + ', ' + names[1] + " et " + names[2];
    } else {
      let remainingCount = names.length - 2;
      let remainingString = "";
      if (includeRemainingCount) {
        remainingString += "(";
      }
      remainingString += names.slice(2, names.length).join(", ");
      if (includeRemainingCount) {
        remainingString += ")";
      }
      return names[0] + ", " + names[1] + " et " + remainingCount + " autres " + remainingString;
    }
}
  