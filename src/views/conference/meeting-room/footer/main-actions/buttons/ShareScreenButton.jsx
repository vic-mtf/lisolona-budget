import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import useLocalStoreData from '../../../../../../hooks/useLocalStoreData';
import React, { useCallback, useMemo, useRef } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import ActionButton from './ActionButton';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '../../../../../../hooks/useSocket';
import { updateConferenceData } from '../../../../../../redux/conference/conference';
import { useRTCScreenShareClient } from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-react';
import { useEffect } from 'react';
import { isPlainObject } from 'lodash';
import store from '../../../../../../redux/store';
import ringtones from '../../../../../../utils/ringtones';
import { canvasStreamComposer } from '../../../../../../utils/CanvasStreamComposer';

const ShareScreenButton = ({ shareScreen }) => {
  const joinedRef = useRef(false);
  const localTracksRef = useRef([]);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const userScreenShareClient = useRTCScreenShareClient();
  const notifications = useNotifications();
  const socket = useSocket();

  const AGORA_DATA = useSelector((store) => store.conference.AGORA_DATA);
  const SCREEN_ID = useSelector(
    (store) => store.conference.meeting.participants?.[userId]?.screenId
  );

  const screenShared = useSelector(
    (state) => state.conference.setup.devices.screen.enabled
  );

  const [getData, setData] = useLocalStoreData(
    'conference.setup.devices.screen'
  );
  const [loading, setLoading] = React.useState(false);

  const handlePublishScreen = useCallback(
    async (stream) => {
      if (!(stream instanceof MediaStream)) return false;

      if (!joinedRef.current) {
        const { TOKEN, APP_ID, CHANNEL } = AGORA_DATA;
        try {
          await userScreenShareClient.join(APP_ID, CHANNEL, TOKEN, SCREEN_ID);
          joinedRef.current = true;
        } catch (e) {
          console.error(e);
          notifications.show(
            "Service de partage d'écran indisponible. Réessayez plus tard.",
            {
              severity: 'error',
              key: 'shareScreenError',
            }
          );
          return false;
        }
      }

      const localTracks = localTracksRef.current;
      if (localTracks.length)
        try {
          await userScreenShareClient.unpublish(localTracks);
        } catch (e) {
          console.error(e);
        }

      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });

      localTracksRef.current = [];
      const [videoTrack] = stream.getVideoTracks();
      // const [audioTrack] = stream.getAudioTracks();

      if (videoTrack)
        localTracksRef.current.push(
          AgoraRTC.createCustomVideoTrack({
            mediaStreamTrack: videoTrack,
          })
        );

      // if(audioTrack)
      //   localTracksRef.current.push(
      //     AgoraRTC.createCustomAudioTrack({
      //       mediaStreamTrack: audioTrack,
      //     })
      //   );

      if (localTracksRef.current.length)
        try {
          await userScreenShareClient.publish(localTracksRef.current);
        } catch (e) {
          console.error(e);
          notifications.show(
            "Un problème est survenu lors du partage d'écran. Veuillez recommencer.",
            {
              severity: 'error',
              key: 'shareScreenError',
            }
          );
          return false;
        }
      return true;
    },
    [AGORA_DATA, userScreenShareClient, SCREEN_ID, notifications]
  );

  const handleStopScreenShare = useCallback(async () => {
    socket.emit('signal-room', { screenShared: false });
    const localScreenTracks = localTracksRef.current;
    canvasStreamComposer.close();
    if (localScreenTracks?.length)
      await userScreenShareClient.unpublish(localScreenTracks);
    localScreenTracks?.forEach((track) => {
      track.stop();
      track.close();
    });
    if (joinedRef.current) {
      await userScreenShareClient.leave();
      joinedRef.current = false;
    }
    const stream = getData('stream');
    stream.getTracks().forEach((track) => {
      if (track.readyState === 'live') track.stop();
    });
    dispatch(
      updateConferenceData({
        key: [
          'meeting.actions.localPresentation.view.activeId',
          `meeting.participants.${userId}.state.screenShared`,
          `setup.devices.screen.enabled`,
          'setup.devices.screen.displaySurface',
          //'meeting.view.layoutView',
        ],
        data: [
          null,
          false,
          false,
          null,
          //'liveInteractionGrid'
        ],
      })
    );
    setData({ stream: null, controller: null });
  }, [userId, dispatch, setData, getData, userScreenShareClient, socket]);

  const handleShareScreen = async () => {
    setLoading(true);
    if (screenShared) {
      try {
        await handleStopScreenShare();
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
      return;
    }
    try {
      const controller =
        window.CaptureController && new window.CaptureController();
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
        surfaceSwitching: 'include',
        controller,
      });

      const [videoTrack] = stream.getVideoTracks();
      const displaySurface = videoTrack?.getSettings()?.displaySurface;

      setData({ stream, controller });
      stream.getTracks().forEach((track) => {
        track.addEventListener('ended', handleStopScreenShare);
      });

      dispatch(
        updateConferenceData({
          key: [
            `meeting.participants.${userId}.state.screenShared`,
            `setup.devices.screen.enabled`,
            'setup.devices.screen.displaySurface',
            'meeting.view.layoutView',
            'meeting.actions.localPresentation.view.activeId',
          ],
          data: [true, true, displaySurface, 'presentation', userId],
        })
      );
      socket.emit('signal-room', { screenShared: true });
      ringtones.systemAlert.volume = 0.1;
      ringtones.systemAlert.play();
    } catch (e) {
      if (e.name !== 'NotAllowedError')
        notifications.show(displayMediaErrors[e.name], {
          severity: 'error',
          key: e.name,
        });
      console.error(e);
    }
    setLoading(false);
  };

  const title = useMemo(() => {
    if (!shareScreen)
      return "Le modérateur n'a pas autorisé le partage d'écran.";
    if (!navigator.mediaDevices.getDisplayMedia)
      return "Votre appareil ne supporte pas la fonctionnalité de partage d'écran.";
    return screenShared ? "Arrêter le partage d'écran" : 'Partager votre écran';
  }, [shareScreen, screenShared]);

  const disabled = useMemo(
    () => !shareScreen || loading,
    [shareScreen, loading]
  );

  useEffect(() => {
    const handleStopeScreenShare = ({ state, participants = [], author }) => {
      if (!isPlainObject(state) || !Array.isArray(participants) || !author)
        return;
      const storeState = store.getState();
      const id = storeState.user.id;
      const isLocalUser = participants.includes(id);

      if (isLocalUser && 'screenShared' in state && author) {
        const localDevice = storeState.conference.setup.devices.screen;
        if (localDevice.enabled === state.screenShared) return;

        notifications.close('endScreenShared');
        const message = `Le modérateur a arrêté le partage d'écran.`;
        notifications.show(message, { key: 'endScreenShared' });

        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            data: {
              meeting: {
                participants: { [id]: { state: { screenShared: false } } },
              },
              setup: { devices: { screen: { enabled: false } } },
            },
          },
        });
      }
    };

    socket.on('signal-room', handleStopeScreenShare);
    return () => {
      socket.off('signal-room', handleStopeScreenShare);
    };
  }, [socket, handleStopScreenShare, notifications]);

  return (
    Boolean(navigator.mediaDevices.getDisplayMedia) && (
      <ActionButton
        id="share-screen"
        title={title}
        disabled={disabled}
        onClick={handleShareScreen}
        selected={screenShared}
      >
        <ScreenShareOutlinedIcon />
      </ActionButton>
    )
  );
};

const displayMediaErrors = {
  NotAllowedError: 'Vous devez autoriser le partage d’écran pour continuer.',
  NotFoundError: 'Aucun écran ou fenêtre n’a été détecté pour le partage.',
  AbortError: 'Le partage d’écran a été interrompu avant de commencer.',
  NotReadableError:
    'Le partage d’écran a échoué à cause d’un problème avec votre système.',
  OverconstrainedError:
    'Les paramètres demandés pour le partage d’écran ne sont pas disponibles.',
  SecurityError: 'Le partage d’écran est bloqué pour des raisons de sécurité.',
};

ShareScreenButton.propTypes = {
  shareScreen: PropTypes.bool,
};

export default React.memo(ShareScreenButton);
