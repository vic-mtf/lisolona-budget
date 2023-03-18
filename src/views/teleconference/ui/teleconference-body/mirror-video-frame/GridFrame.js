import {
    Box as MuiBox,
    Grid,
} from '@mui/material';

export default function GridFrame ({gridProps, children}) {
    return (
        <Grid
            item
            {...gridProps}
            display="flex"
            sx={{
                border: theme => 
                `.1px solid ${theme.palette.background.paper}`,
            }}
        >
        <MuiBox
            display="flex"
            flex={1}
            borderRadius={1}
            justifyContent="center"
            alignItems="center"
            sx={{
                overflow: 'hidden',
                bgcolor: '#09162a',
            }}
        >
            {children}
        </MuiBox>
    </Grid>
    )
}