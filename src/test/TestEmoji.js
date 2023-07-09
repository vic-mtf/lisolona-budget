import { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Box, IconButton, Paper, useTheme } from '@mui/material';
import { Close, InsertEmoticon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles(theme => ({
//   emojiPicker: {
//     position: 'absolute',
//     bottom: '70px',
//     right: '10px',
//     zIndex: 1,
//   },
//   pickerPaper: {
//     backgroundColor: theme.palette.background.paper,
//     borderRadius: '8px',
//     padding: '8px',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: '8px',
//     right: '8px',
//     color: theme.palette.primary.contrastText,
//   },
// }));

export default function EmojiPicker() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const theme = useTheme();
  //const classes = useStyles(theme);
  const customTheme = {
    // Couleur d'arrière-plan du sélecteur d'emoji
    backgroundColor: theme.palette.background.paper,
    // Couleur de fond de la zone de prévisualisation de l'emoji
    previewBackgroundColor: theme.palette.background.paper,
    // Couleur de fond de la barre de recherche
    searchBackgroundColor: theme.palette.background.paper,
    // Couleur du texte de la barre de recherche
    searchTextColor: theme.palette.text.primary,
    // Couleur de fond de la barre d'onglets
    categoryBackgroundColor: theme.palette.background.paper,
    // Couleur du texte de la barre d'onglets
    categoryTextColor: theme.palette.text.secondary,
    // Couleur de fond des onglets actifs
    categoryActiveColor: theme.palette.background.default,
    // Couleur du texte des onglets actifs
    categoryActiveTextColor: theme.palette.text.primary,
    // Couleur de la bordure des onglets actifs
    categoryBorderColor: theme.palette.divider,
    // Couleur de fond des emojis sélectionnés
    emojiBackgroundColor: theme.palette.primary.main,
    // Couleur de bordure des emojis sélectionnés
    emojiBorderColor: theme.palette.primary.main,
    // Couleur de texte des emojis sélectionnés
    emojiTextColor: theme.palette.primary.contrastText,
  };

  const CustomEmoji = props => {
    const { emoji, ...other } = props;
    return (
      <IconButton {...other}>
        <span role="img" aria-label={emoji.name}>
          {emoji.native}
        </span>
      </IconButton>
    );
  };

  return (
    <>
      <IconButton
        aria-label="Insérer un emoji"
        onClick={() => setShowEmojiPicker(true)}
      >
        <InsertEmoticon />
      </IconButton>
      {showEmojiPicker && (
        <Box >
          <Paper 
            sx={{
              "& em-emoji-picker": {
                "--background-rgb": "85, 170, 255",
                "--border-radius": "24px",
                "--category-icon-size": "24px",
                "--color-border-over": "rgba(0, 0, 0, 0.1)",
                "--color-border": "rgba(0, 0, 0, 0.05)",
                "--font-family": "'Comic Sans MS', 'Chalkboard SE', cursive",
                "--font-size": "20px",
                "--rgb-accent": "255, 105, 180",
                "--rgb-background": "262, 240, 283",
                "--rgb-color": "102, 51, 153",
                "--rgb-input": "255, 235, 235",
                "--shadow": "5px 5px 15px -8px rebeccapurple",
                height: "50vh",
                minHeight: 400,
                maxHeight: 800,
              }
            }}
          >
            <Picker
              set="native"
              onSelect={emoji => console.log(emoji)}
              showPreview={false}
              data={data}
              local="fr"
              emoji={CustomEmoji}
            />
            <IconButton
              onClick={() => setShowEmojiPicker(false)}
            >
              <Close />
            </IconButton>
          </Paper>
        </Box>
      )}
    </>
  );
}
