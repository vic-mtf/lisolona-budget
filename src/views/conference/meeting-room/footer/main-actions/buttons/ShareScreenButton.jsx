import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import useLocalStoreData from '../../../../../../hooks/useLocalStoreData';
import React from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import ActionButton from './ActionButton';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateConferenceData } from '../../../../../../redux/conference/conference';
import { useRTCScreenShareClient } from 'agora-rtc-react';
import { useCallback } from 'react';
import { useMemo } from 'react';

const ShareScreenButton = ({ shareScreen }) => {
  const screenShareClient = useRTCScreenShareClient();
  const notifications = useNotifications();
  const userId = useSelector((state) => state.user.id);
  const screenShared = useSelector(
    (state) => state.conference.setup.devices.screen.enabled
  );
  const dispatch = useDispatch();
  const [getData, setData] = useLocalStoreData(
    'conference.setup.devices.screen'
  );
  const [loading, setLoading] = React.useState(false);

  const handleStopScreenShare = useCallback(async () => {
    const localScreenTracks = screenShareClient?.localTracks;
    const stream = getData('stream');
    stream.getTracks().forEach((track) => track.stop());
    dispatch(
      updateConferenceData({
        key: [
          `meeting.participants.${userId}.state.screenShared`,
          `setup.devices.screen.enabled`,
          //'meeting.view.layoutView',
        ],
        data: [
          false,
          false,
          //'liveInteractionGrid'
        ],
      })
    );
    setData({ stream: null });
    if (localScreenTracks?.length)
      await screenShareClient.unpublish(localScreenTracks);
  }, [screenShareClient, userId, dispatch, setData, getData]);

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
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setData({ stream });
      stream.getTracks().forEach((track) => {
        track.addEventListener('ended', handleStopScreenShare);
      });

      dispatch(
        updateConferenceData({
          key: [
            `meeting.participants.${userId}.state.screenShared`,
            `setup.devices.screen.enabled`,
            'meeting.view.layoutView',
          ],
          data: [true, true, 'presentation'],
        })
      );
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

  const disabled = useMemo(() => {
    return !shareScreen || loading;
  }, [shareScreen, loading]);

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
