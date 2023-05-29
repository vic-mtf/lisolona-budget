import { createTheme, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import Typography from '../../../../../components/Typography';
import { useMemo } from 'react';

export default function ContactStatus () {
    const userId = useSelector(store=> store.data.userId)
    const target = useSelector(store => store.teleconference.target);
    const from = useSelector(store => store.teleconference.from);

    const name = useMemo(() => 
        target?.id === userId ? from?.name : target?.name,
        [target, userId]
    );
    
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