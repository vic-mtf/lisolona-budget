import { Toolbar, Box as MuiBox, styled, Stack } from "@mui/material";
import MeetingStatus from "./MeetingStatus";
import CameraButton from "./buttons/CameraButton";
import MicroButton from "./buttons/MicroButton";
import ScreenSharingButton from "./buttons/ScreenSharingButton";
import HangupButton from "./buttons/HangupButton";
import RaiseHandButton from "./buttons/RaiseHandButton";
import MemberButton from "./buttons/ListMemberButton";
import MessageButton from "./buttons/MessageButton";
import AdminOptionsButton from "./buttons/AdminOptionsButton";
import DetailsButton from "./buttons/DetailsButton";

export default function Footer () {

    return (
        <Toolbar
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper'
            }}
            //variant="dense"
        >
            <Container>
            <MeetingStatus/>
            </Container>
            <Container
                justifyContent="center"
                gap={2}
            >  <Stack
                    sx={{
                        border: theme => `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: .2,
                    }}
                    borderRadius={1}
                    spacing={2}
                    direction="row"
                >
                    <CameraButton/>
                    <MicroButton/>
                </Stack>
                <ScreenSharingButton/>
                <HangupButton/>
            </Container>
            <Container
                 justifyContent="right"
                 gap={2}
            >
                <RaiseHandButton/>
                <MemberButton/>
                <MessageButton/>
                <DetailsButton/>
                <AdminOptionsButton/>
            </Container>
        </Toolbar>
    );
}

const Container = styled(MuiBox)(() => ({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
}))