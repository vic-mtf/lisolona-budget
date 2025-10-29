import Fab from '@mui/material/Fab';
import React from 'react';
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import ringtones from '../../../../../../utils/ringtones';
import { useRTCClient, useRTCScreenShareClient } from 'agora-rtc-react';
import useSocket from '../../../../../../hooks/useSocket';
import useLocalStoreData from '../../../../../../hooks/useLocalStoreData';
import { useDispatch, useSelector } from 'react-redux';
import streamSegmenterMediaPipe from '../../../../../../utils/StreamSegmenterMediaPipe';

const HangUpButton = () => {
  const [getData, setData] = useLocalStoreData('conference.setup.devices');
  const socket = useSocket();
  const client = useRTCClient();
  const screenShareClient = useRTCScreenShareClient();
  const id = useSelector((store) => store.user.id);
  const dispatch = useDispatch();

  const handleHangUp = async () => {
    socket.emit('leave-room');
    client.leave();
    screenShareClient.leave();
    const streams = ['microphone', 'camera', 'screen'];

    streams.forEach((s) => {
      const { stream } = getData()[s];
      setData({});
      if (!stream) return;
      stream?.getTracks()?.forEach((track) => {
        track.stop();
      });
      setData(s, { stream: null, processedStream: null });
    });

    ringtones.hangUp.volume = 0.2;
    ringtones.hangUp.play();
    dispatch({
      type: 'conference/updateConferenceData',
      payload: {
        key: [`meeting.participants.${id}.state.isInRoom`, 'step'],
        data: [false, 'end'],
      },
    });
    await streamSegmenterMediaPipe.destroy();
    dispatch({
      type: 'conference/updateConferenceData',
      payload: {
        key: [
          'setup.devices.camera.enabled',
          'setup.devices.microphone.enabled',
        ],
        data: [false, false],
      },
    });
  };

  return (
    <Fab
      variant="extended"
      onClick={handleHangUp}
      size="small"
      sx={{ boxShadow: 0 }}
      color="error"
    >
      <CallEndOutlinedIcon />
    </Fab>
  );
};

export default React.memo(HangUpButton);
