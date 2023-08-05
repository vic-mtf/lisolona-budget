
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
import useGetClients from '../actions/useGetClients';

export default function Content () {
    const [{contentRootRef}] = useMeetingData();
    const cameraView = useSelector(store => store.conference.cameraView);
    const members = useGetClients();
    const participants = useMemo(() => members.filter(({active}) => active), [members]);
    
    const data = useMemo(() => {
        const data = [];
        if(cameraView === 'content')
            data.push(<CameraView mode={cameraView}/>);
        return data.concat(
            participants.map(
                participant => (
                    <Participant
                        {...participant}
                        key={participant.id}
                    />
                )
            )
        );
      }, [cameraView, participants]);

    
    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                ref={contentRootRef}
            >
                <GridDataDisplay
                    data={data}
                />
                <RaiseHandWrapper/>
                {participants.length === 0 &&
                <Typography
                    variant="h5"
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

const RaiseHandWrapper = () => {
    const handRaised = useSelector(store => store.conference.handRaised);
    return (
        <BorderAnimate
            visible={handRaised}
        />
    );
}