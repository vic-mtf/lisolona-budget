import React, { useState, useEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import { Scanner } from '@yudiel/react-qr-scanner';

const CodeScanner = React.memo(({ onScan, paused, onError }) => {
  const [permissionState, setPermissionState] = useState(null);
  const permission = useMemo(() => ({ status: null }), []);
  const rootRef = useRef();

  useEffect(() => {
    const video = rootRef.current?.querySelector('video');

    if (video) video.disablePictureInPicture = true;

    if (!permissionState)
      (async () => {
        try {
          const status = await navigator?.permissions?.query({
            name: 'camera',
          });
          permission.status = status;
          setPermissionState(status.state);
        } catch (e) {
          console.error(e);
        }
      })();

    const onChange = () => setPermissionState(permission.status?.state);
    permission.status?.addEventListener('change', onChange);
    return () => permission.status?.removeEventListener('change', onChange);
  }, [permissionState, permission]);

  return (
    <Box width="100%" px={4} pb={4}>
      <Box
        flexGrow={1}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '& > div': {
            border: (theme) => '4px solid ' + theme.palette.divider,
            borderRadius: 1,
          },
          '& video': {
            position: 'absolute',
            objectFit: 'cover',
            background: 'none',
            aspectRatio: 16 / 9,
          },
          '& path': {
            stroke: (theme) => theme.palette.primary.main,
            fill: (theme) => theme.palette.primary.main,
            borderRadius: 1,
          },
        }}
        flex={1}
        ref={rootRef}
      >
        <Scanner
          onScan={onScan}
          paused={paused}
          formats={['qr_code']}
          allowMultiple
          sound={false}
          key={permissionState}
          onError={onError}
          scanDelay={10000}
          styles={{
            container: {
              overflow: 'hidden',
              width: 300,
              minWidth: 300,
              aspectRatio: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            },
          }}
          components={{
            finder: true,
            zoom: false,
            onOff: false,
            audio: false,
            torch: true,
          }}
        >
          {permissionState === 'granted' && (
            <Box
              width="100%"
              height={10}
              sx={{
                opacity: 0.8,
                position: 'absolute',
                top: -10,

                animation: paused
                  ? 'none'
                  : 'scanBar 1.8s infinite linear alternate .2s',
                animationDelay: '1s',
                background: (theme) =>
                  `linear-gradient(transparent,${theme.palette.primary.main}, transparent)`,
                '@keyframes scanBar': {
                  '0%': {
                    top: -10,
                    opacity: 0.4,
                  },
                  '50%': { opacity: 1 },
                  '100%': {
                    top: '100%',
                    opacity: 0.4,
                  },
                },
              }}
            />
          )}
        </Scanner>
      </Box>
    </Box>
  );
});

CodeScanner.displayName = 'CodeScanner';

export default CodeScanner;
