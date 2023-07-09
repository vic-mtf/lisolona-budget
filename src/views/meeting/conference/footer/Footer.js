import { Toolbar, Box as MuiBox, styled } from "@mui/material";
import MeetingStatus from "./MeetingStatus";
import CameraButton from "./buttons/CameraButton";
import MicroButton from "./buttons/MicroButton";
import ScreenSharingButton from "./buttons/ScreenSharingButton";
import HangupButton from "./buttons/HangupButton";
import RaiseHandButton from "./buttons/RaiseHandButton";
import MemberButton from "./buttons/ListMemberButton";
import MessageButton from "./buttons/MessageButton";

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
            >
                <CameraButton/>
                <MicroButton/>
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
            </Container>
        </Toolbar>
    );
}

const Container = styled(MuiBox)(() => ({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
}))