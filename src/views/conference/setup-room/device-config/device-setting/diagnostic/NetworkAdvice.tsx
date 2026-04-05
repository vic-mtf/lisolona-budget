import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const NetworkAdvice = () => {
  const tips = [
    {
      icon: <VideocamOutlinedIcon />,
      primary: "Réduisez la résolution de votre caméra à l’envoi",
      secondary:
        "Une qualité vidéo plus basse consomme moins de bande passante.",
    },
    {
      icon: <WifiOutlinedIcon />,
      primary: "Utilisez une connexion Wi-Fi stable ou un câble Ethernet",
    },
    {
      icon: <BlockOutlinedIcon />,
      primary: "Fermez les applications gourmandes en bande passante",
      secondary: "Streaming, jeux en ligne, visioconférences multiples, etc.",
    },
    {
      icon: <CloudDownloadOutlinedIcon />,
      primary: "Évitez les téléchargements ou mises à jour en arrière-plan",
    },
  ];

  return (
    <Box elevation={3} sx={{ margin: "auto", mt: 2, px: 1 }}>
      <Box display='flex' alignItems='center' mb={2}>
        <InfoOutlinedIcon sx={{ mr: 1 }} />
        <Typography variant='body1'>
          Conseils pour une connexion stable
        </Typography>
      </Box>

      <Typography variant='body2' gutterBottom>
        Si vous rencontrez des problèmes de réseau pendant une vidéoconférence,
        voici quelques recommandations :
      </Typography>

      <List>
        {tips.map((tip, index) => (
          <ListItem key={index} alignItems='flex-start'>
            <ListItemIcon>{tip.icon}</ListItemIcon>
            <ListItemText
              primary={tip.primary}
              secondary={tip.secondary || null}
              slotProps={{
                primary: {
                  variant: "body2",
                },
                secondary: {
                  variant: "caption",
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NetworkAdvice;
