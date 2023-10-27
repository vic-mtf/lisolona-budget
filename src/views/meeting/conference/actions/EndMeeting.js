import { Box as MuiBox, Stack, useTheme, AvatarGroup, Backdrop } from '@mui/material';
import Avatar from "../../../../components/Avatar";
import Typography from '../../../../components/Typography';
import { generateColorsFromId } from "../../../../utils/genColorById";
import { useMemo } from 'react';
import { useMeetingData } from '../../../../utils/MeetingProvider';
import getShort from '../../../../utils/getShort';
import Header from '../../room-call-entry/Header';
import { formatNames } from '../footer/MeetingStatus';
import formatDuration from '../../../../utils/formatDuration';
import { useSelector } from 'react-redux';
import useGetClients from './useGetClients';

export default function EndMeeting({ open, type }) {
    const [{ target, }] = useMeetingData();
    const userId = useSelector(store => store.meeting?.me?.id);
    const startedAt = useSelector(store => store.meeting.startedAt);
    const participants = useGetClients();

    console.log(participants);

    const message = {
        end: `Fin de ${target.type === 'direct' ? "l'appel" : "la reunion"}`,
        quit: `Vous avez quitté cette reunion`
    };

    return (
        <Backdrop
            sx={{
                background: theme => theme.palette.background.paper +
                theme.customOptions.opacity,
                backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                zIndex: theme => theme.zIndex.drawer + 100
            }}
            open={open}
        >
            <Stack
                spacing={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="fixed"
                flex={1}
                height="100%"
                width="100%"
                top={0}
                left={0}
                zIndex={10}
                direction="column"
                sx={{
                    background: theme => `
                    linear-gradient(
                        to bottom, transparent , 
                        ${theme.palette.background.paper + '50'
                    })`
                }}
            >
                <MuiBox
                    sx={{
                        position: 'relative',
                        m: 2,
                    }}
                >
                    {target.type === 'direct' ?
                        (
                            <AvatarGroup>
                                {participants.map((participant) => (
                                        <AvatarProfile
                                            {...participant}
                                            key={participant.id}
                                        />
                                ))}
                            </AvatarGroup>
                        )
                        :
                        ( <Header /> )
                    }
                </MuiBox>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    {target.typpe === 'direct' ?
                        formatNames(participants.map(({ name }) => name)) :
                        target?.name
                    }
                </Typography>
                <Typography
                    maxWidth={300}
                    height={50}
                    align="center"
                    variant="body1"
                    paragraph
                >
                    {message[type]}
                </Typography>
                <Typography>
                    {formatDuration(startedAt)}
                </Typography>
            </Stack>
        </Backdrop>
    );
}

const AvatarProfile = ({ id, avatarSrc, name }) => {
    const theme = useTheme();
    const { background, text } = generateColorsFromId(id, theme.palette.mode);

    const avatarSx = useMemo(() => ({
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 40,
    }), [background, text]);

    return (
        <Avatar
            sx={{
                width: 100,
                height: 100,
                ...avatarSx,
                borderColor: avatarSx.color,
            }}
            src={avatarSrc}
            children={getShort(name)}
        />
    )

}

EndMeeting.defaultProps = {
    type: 'end'
}