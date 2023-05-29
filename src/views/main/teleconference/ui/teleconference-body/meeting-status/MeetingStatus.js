import {
    Box as MuiBox, 
    createTheme, 
    ThemeProvider,
    Stack,
    CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import Avatar from '../../../../../../components/Avatar';
import Typography from '../../../../../../components/Typography';
import CustomAvatarGroup from '../../../../../../components/CustomAvatarGroup';
import { useMemo } from 'react';

export default function MeetingStatus () {
    const target = useSelector(store => store.teleconference?.target);
    const userId = useSelector(store => store.user.id);
    const from = useSelector(store => store.teleconference?.from);
    const response = useSelector(store => store.teleconference?.response);
    const members = useMemo(() => 
        target?.members?.map(({_id: user, role}) => ({
                ...user,
                role,
                id: user?._id,
                origin: user,
                name: `${user?.fname || ''} ${ user?.lname || ''} ${user?.mname || ''}`.trim(),
            })
        ), 
    [target]);

    const  avatarSrc = useMemo(() => 
        target?.id === userId ? from?.avatarSrc : target?.avatarSrc,
        [target, from, userId]
    );
    
    const firstMember = useMemo(() => {
        const [member] = Array.isArray(members) ? members : [];
        return {
            avatarSrc: member?.imageUrl,
        }
    },[members]);
    const lastMember = useMemo(() => {
        const member =   Array.isArray(members) && members[members.length - 1]
        return {
            avatarSrc: member?.imageUrl,
        };
    },[members]);

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
           {
            target?.type === 'room' ?
            (<CustomAvatarGroup
                    sx={{
                        [`& .MuiAvatarGroup-avatar:nth-of-type(2n+1)`]: {
                            top: '-25px',
                            left: '-8px',
                            width: 40,
                            height: 40,
                        },
                        [`& .MuiAvatarGroup-avatar:nth-of-type(2n)`]: {
                            width: 50,
                            height: 50,
                            bottom: '-2px',
                            right: -5,
                        }
                    }}
                >
                    <Avatar
                        src={firstMember.avatarSrc}
                        
                    />
                    <Avatar
                        src={lastMember.avatarSrc}
                    />
            </CustomAvatarGroup>):
            <Avatar
                src={avatarSrc}
                sx={{
                    width: 80,
                    height: 80,
                }}
            />
           }
           <ThemeProvider theme={createTheme({palette: { mode: 'dark'}})}> 
                {target?.type === 'room' && <Typography align="center">Appel de Lisanga</Typography>} 
                <Typography align="center" variant="h6">
                    {response === 'connexion' && "Connexion..."}
                    {response === 'ringing' && "Appel en cours..."}
                    {response === 'unanswered' && "Pas de reponse"}
                    {response === 'busy' && "En communinication..."}
                    {response === 'rejected' && "Appel réjeté"}
                    {response === 'error' && "Pas de connexion"}
                    {response === 'incoming' && "Appel entrant"}
                    {response === 'join' && 
                    <Stack 
                        spacing={1} 
                        direction="row" 
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CircularProgress
                            size={20}
                            color="inherit"
                        />
                        <Typography align="center" variant="h6">Rejoindre l'appel en cours</Typography>
                    </Stack>}
                </Typography> 
           </ThemeProvider> 
        </MuiBox>
    )
}