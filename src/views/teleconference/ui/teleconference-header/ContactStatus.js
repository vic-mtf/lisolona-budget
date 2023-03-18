import { createTheme, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import Typography from '../../../../components/Typography';

export default function ContactStatus () {
    const {name} = useSelector(store => {
        const { contacts, conversations } = store.data;
        const type = store.teleconference.type;
        const meetingId = store.teleconference.meetingId;
        const from = store.teleconference.from;
        const {name} = type === 'direct' ? 
        contacts.find(({id}) => id === from) :
        conversations.find(({id}) => id === meetingId)
        return {name};
    } );
    
    return (
        <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
            <Typography
                sx={{flexGrow: 1, mx: 2}}
                children={name}
                variant="h6"
                fontWeight="bold"
            />
        </ThemeProvider>
    )
}