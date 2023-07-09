
import Box from '../../../../components/Box';
import BorderAnnimate from './BorderAnnimate';
import GridDataDisplay from './GridDataDisplay';
import { useMeetingData } from '../../../../utils/MeetingProvider'
import Participant from './participant/Participant';
import { useMemo } from 'react';
import CameraView from './camera-view/CameraView';
import { useSelector } from 'react-redux';

export default function Content () {
    const [{participants}] = useMeetingData();
    const cameraView = useSelector(store => store.conference.cameraView);
    const data = useMemo((() => [
        cameraView === 'content' && <CameraView
                mode={cameraView}
            />
            ,...participants.map(
                participant => (
                    <Participant
                        {...participant}
                        key={participant.id}
                    />
                )
            )
    ].filter(e => e)), [cameraView, participants]);
    
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
          <BorderAnnimate
            visible={false}
          />
            <GridDataDisplay
                data={data}
            />
            {cameraView === 'float' && <CameraView mode={cameraView} />}
        </Box>
    );
}