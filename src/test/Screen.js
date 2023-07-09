import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Grid, Card, CardHeader, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
}));

const CardWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: 'calc(100% / 4 - 16px)',
  margin: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    zIndex: 1,
    boxShadow: theme.shadows[8],
  },
}));

const App = () => {
  const [client, setClient] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);

  const joinChannel = async () => {
    // Créez une instance du client AgoraRTC
    const agoraClient = AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' });
    setClient(agoraClient);

    // Initialisez le client avec votre clé d'application Agora.io
    agoraClient.init('YOUR_APP_ID', () => {
      console.log('AgoraRTC client initialized');
    }, (err) => {
      console.log('AgoraRTC client init failed', err);
    });

    // Joignez le canal de communication
    await agoraClient.join('YOUR_TOKEN_OR_KEY', 'test-channel', null, null);

    // Écoutez l'événement user-published pour détecter quand un flux audio ou vidéo est publié par un participant
    agoraClient.on('user-published', async (user, mediaType) => {
      if (mediaType === 'audio' || mediaType === 'video') {
        // Abonnez-vous au flux audio ou vidéo publié par le participant
        await agoraClient.subscribe(user, mediaType);

        // Ajoutez le participant à la liste des utilisateurs distants
        setRemoteUsers([...remoteUsers, user]);

        console.log(`Subscribed to remote ${mediaType} track ${user.uid}`);
      }
    });

    console.log('Client joined channel');
  };

  const leaveChannel = async () => {
    // Quittez le canal de communication
    await client.leave();

    console.log('Client left channel');
  };

  return (
    <Container>
      <button onClick={joinChannel}>Join Channel</button>
      <button onClick={leaveChannel}>Leave Channel</button>

      <Grid container spacing={2}>
        {remoteUsers.map((user, index) => (
          <Grid item key={user.uid} xs={12} sm={6} md={4} lg={3}>
            <CardWrapper style={{ transform: `translateY(${index * 50}px)` }}>
              <Card>
                <CardHeader title={`Participant ${user.uid}`} />
                <CardMedia component="video" srcObject={user.videoTrack?.playbackStream} autoPlay />
                <CardContent>
                  <audio srcObject={user.audioTrack?.playbackStream} autoPlay />
                </CardContent>
              </Card>
            </CardWrapper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
