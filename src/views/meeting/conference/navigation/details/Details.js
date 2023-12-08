import {
    Box as MuiBox, 
    Toolbar,
    Stack
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import Typography from '../../../../../components/Typography';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import Button from '../../../../../components/Button';
import { useCallback, useRef } from 'react';
import CopyLinkButton from './CopyLinkButton';
import useMeetingUrl from './useMeetingUrl';

export default function Details () {
    const [{origin}] = useMeetingData();
    const elemRef = useRef();
    const url = useMeetingUrl();

    const handleShareLink = useCallback(() => {
        window?.navigator?.share({
            url,
            title: origin?.summary || 'Réunion Lisanga',
            text: origin?.description,
          })
    }, [origin, url]);

    return (
        <>
            <Toolbar 
                variant="dense"
                sx={{mb: 2}}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >Information sur la réunion</Typography>
            </Toolbar>
            <MuiBox
                display="flex"
                flex={1}
                overflow="hidden"
                flexDirection="column"
                gap={1}
                p={1}
                // justifyContent="center"
                // alignItems="center"
                // width="100%"
            >
               <Typography
                    variant="body1"
                    fontWeight="bold"
               >
                    Lien de connexion
               </Typography>
               <Typography
                    variant="body2"
                    color="text.secondary"
                    ref={elemRef}
               >
                    {url}
               </Typography>
               <Stack
                direction="row"
                spacing={1}
               >
                {Boolean(window?.navigator?.share)  &&
                <Button
                    startIcon={<ShareIcon/>}
                    onClick={handleShareLink}
                    fullWidth
                > Partager
                </Button>}
                <CopyLinkButton/>
               </Stack>
            </MuiBox>
        </>
    )
}