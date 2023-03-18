import {
    Box as MuiBox, createTheme, ThemeProvider
} from '@mui/material'
import { Stack } from '@mui/system'
import { useSelector } from 'react-redux'
import Avatar from '../../../../../components/Avatar'
import Typography from '../../../../../components/Typography'
import { useTeleconference } from '../../../../../utils/TeleconferenceProvider'

export default function MeetingStatus () {
    const {type, members, response} = useSelector(store => {
        const type = store.teleconference?.type;
        const contacts = store.data?.contacts;
        const conversations = store.data?.conversations;
        const meetingId = store.teleconference.meetingId;
        const response = store.teleconference.response;
        const contact = conversations?.find(({id}) => id === meetingId) || 
        contacts?.find(({id}) => id === meetingId);
        return {
            ...contact, 
            type,
            members: contact?.origin?.members?.map(
                ({_id: user, role}) => store.user?.id !== user?._id && ({
                    ...user,
                    role,
                    id: user?._id,
                    origin: user,
                    name: `${user?.fname || ''} ${ user?.lname || ''} ${user?.mname || ''}`.trim(),
                })
            )?.filter(name => name),
            response,
        };
    });
    console.log(response);
    return (
        <MuiBox
            position="absolute"
            display="flex"
            height="100%"
            width="100%"
            component={Stack}
            justifyContent="center"
            alignItems="center"
            drection="column"
            spacing={1}
            sx={{
                zIndex: theme => theme.zIndex.drawer,
            }}
        >
           <Avatar
                sx={{
                    width: 100,
                    height: 100,
                }}
           />
           <ThemeProvider theme={createTheme({palette: { mode: 'dark'}})}> 
                {type === 'room' &&
                <Typography align="center">
                    Membres de Lisanga: <br/> {members?.map(({name}) => name).join(', ') }
                </Typography>} 
                <Typography align="center" variant="h6">
                    {response === 'connexion' && "Connexion..."}
                    {response === 'ringing' && "Appel en cours..."}
                    {response === 'unanswered' && "Pas de reponse"}
                    {response === 'busy' && "En communinication..."}
                    {response === 'rejected' && "Appel réjeté"}
                    {response === 'error' && "Pas de connexion"}
                    {response === 'incoming' && "Appel entrant"}
                </Typography> 
           </ThemeProvider> 
        </MuiBox>
    )
}