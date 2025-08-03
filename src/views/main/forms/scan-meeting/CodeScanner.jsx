import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";

const CodeScanner = React.memo(() => {
  const [permissionState, setPermissionState] = useState(null);
  const permission = useMemo(() => ({ status: null }), []);

  useEffect(() => {
    if (!permissionState)
      (async () => {
        try {
          const status = await navigator?.permissions?.query({
            name: "camera",
          });
          permission.status = status;
          setPermissionState(status.state);
        } catch (e) {
          console.error(e);
        }
      })();

    const onChange = () => setPermissionState(permission.status?.state);
    permission.status?.addEventListener("change", onChange);
    return () => permission.status?.removeEventListener("change", onChange);
  }, [permissionState, permission]);

  return (
    <Box width='100%' px={4} pb={4}>
      <Box
        flexGrow={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& > div": {
            border: (theme) => "4px solid " + theme.palette.divider,
            borderRadius: 1,
          },
          "& video": {
            position: "absolute",
            objectFit: "cover",
            background: "none",
            aspectRatio: 16 / 9,
          },
          "& path": {
            stroke: (theme) => theme.palette.primary.main,
            borderRadius: 1,
          },
        }}
        flex={1}>
        <Scanner
          onScan={(result) => console.log(result)}
          key={permissionState}
          styles={{
            container: {
              overflow: "hidden",
              width: 300,
              minWidth: 300,
              aspectRatio: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            },
          }}
          components={{
            finder: true,
            zoom: false,
            onOff: false,
            audio: true,
          }}>
          {permissionState === "granted" && (
            <Box
              width='100%'
              height={10}
              sx={{
                opacity: 0.8,
                position: "absolute",
                top: -10,
                animation: "scanBar 1.8s infinite linear alternate .2s",
                background: (theme) =>
                  `linear-gradient(transparent,${theme.palette.primary.main}, transparent)`,
                "@keyframes scanBar": {
                  "0%": {
                    top: -10,
                    opacity: 0.4,
                  },
                  "50%": { opacity: 1 },
                  "100%": {
                    top: "100%",
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

CodeScanner.displayName = "CodeScanner";

export default CodeScanner;
