import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import useLocalStoreData from '@/hooks/useLocalStoreData';
import React, { useCallback, useMemo } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import ActionButton from './ActionButton';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '@/hooks/useSocket';
import { updateConferenceData } from '@/redux/conference/conference';
import { useEffect } from 'react';
import { isPlainObject } from 'lodash';
import store from '@/redux/store';
import ringtones from '@/utils/ringtones';
import { canvasStreamComposer } from '@/utils/CanvasStreamComposer';

const ShareScreenButton = ({ shareScreen }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const notifications = useNotifications();
  const socket = useSocket();

  const screenShared = useSelector(
    (state) => state.conference.setup.devices.screen.enabled
  );

  const [getData, setData] = useLocalStoreData(
    'conference.setup.devices.screen'
  );
  const [loading, setLoading] = React.useState(false);

  const handleStopScreenShare = useCallback(() => {
    socket.emit('signal-room', { state: { screenShared: false } });
    canvasStreamComposer.close();
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
  }, [userId, dispatch, setData, getData, socket]);

  const handleShareScreen = async () => {
    setLoading(true);
    if (screenShared) {
      handleStopScreenShare();
      setLoading(false);
      return;
    }

    try {
      const CapCtrl = window.CaptureController;
      const controller = CapCtrl && new CapCtrl();
      const options = {
        video: true,
        audio: true,
        surfaceSwitching: 'include',
        controller,
      };
      const stream = await navigator.mediaDevices.getDisplayMedia(options);
      if (!stream) return;

      const [videoTrack] = stream.getVideoTracks();
      const { displaySurface } = videoTrack.getSettings();

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
      socket.emit('signal-room', { state: { screenShared: true } });
      ringtones.systemAlert.volume = 0.1;
      ringtones.systemAlert.play();
    } catch (e) {
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
        const mss = `Le modérateur a arrêté le partage d'écran.`;
        notifications.show(mss, { key: 'endScreenShared' });

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

export default React.memo(ShareScreenButton);
