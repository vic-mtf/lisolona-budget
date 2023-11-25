import { Card, CardContent, CardHeader, Divider, Box as MuiBox, Paper, Stack, Toolbar, Typography, Tooltip } from "@mui/material";
import Avatar from "../../../../components/Avatar";
import AvatarStatus from "../../../../components/AvatarStatus";
import IconButton from "../../../../components/IconButton";
import Profile from './Profile';
import { useMeetingData } from "../../../../utils/MeetingProvider";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function MeetingBoard({handleAskJoinMeeting}) {
    const [{ meetingData, origin }] = useMeetingData();

    return (
        <Card
            elevation={2}
            component={Stack}
            sx={{
                width: {
                    xs: '100%',
                    md: '90%',
                    lg: '80%',
                },
                height: 400,
                overflow: 'hidden',
                m: 1,
            }}
            divider={<Divider />}
        >
            <CardHeader
                title={origin?.summary || "Réunion Lisanga"}
                subheader={origin?.description}
                action={
                    <Tooltip
                        arrow
                        title="plus d'infos"
                    >
                        <IconButton>
                            <InfoOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                }
            />
            <CardContent>
                <Stack
                    spacing={2}
                >
                    <Typography
                        variant="h6"
                        align="center"
                    >Êtes-vous prêt à vous joindre ?</Typography>
                    <Profile
                        handleAskJoinMeeting={handleAskJoinMeeting}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
}
