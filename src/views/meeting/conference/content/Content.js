
import Box from '../../../../components/Box';
import BorderAnimate from './BorderAnimate';
import GridDataDisplay from './GridDataDisplay';
import { useMeetingData } from '../../../../utils/MeetingProvider'
import Participant from './participant/Participant';
import { useMemo } from 'react';
import CameraView from './camera-view/CameraView';
import { useSelector } from 'react-redux';
import ActionsWrapper from '../actions/ActionsWrapper';
import Typography from '../../../../components/Typography';

export default function Content () {
    const [{participants}] = useMeetingData();
    const cameraView = useSelector(store => store.conference.cameraView);
    const data = useMemo((() => [
        cameraView === 'content' && <CameraView mode={cameraView}/>,
        ...participants.map(
            participant => (
                <Participant
                    {...participant}
                    key={participant.id}
                />
            )
        )
    ].filter(e => e)), [cameraView, participants]);
    
    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
            <BorderAnimate
                visible={false}
            />
                <GridDataDisplay
                    data={data}
                />
                {participants.length === 0 &&
                <Typography
                    variant="h4"
                    position="absolute"
                    width="100%"
                    height="100%"
                    display="flex"
                    color="text.secondary"
                    justifyContent="center"
                    align="center"
                    alignItems="center"
                >
                    Merci de patienter, les autres participants arrivent bientôt.
                </Typography>}
                {cameraView === 'float' && <CameraView mode={cameraView} />}
            </Box>
            <ActionsWrapper/>
        </>
    );
}