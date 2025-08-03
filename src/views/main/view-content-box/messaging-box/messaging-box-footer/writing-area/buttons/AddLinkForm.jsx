import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { EditorState } from "draft-js";
import getLinkInSelection, { getSelectedText } from "./getLinkInSelection";
import addLink from "./addLink";

const AddLinkForm = React.memo(
  ({ editorState, setEditorState, open, onClose, editorRef }) => {
    const { defaultText, defaultLink } = useMemo(() => {
      const data = editorState ? getLinkInSelection(editorState) || {} : {};
      const { text, url } = data;
      return { defaultText: text || "", defaultLink: url || "" };
    }, [editorState]);
    const isLink = Boolean(defaultText || defaultLink);

    const text = useMemo(
      () => (defaultText || editorState ? getSelectedText(editorState) : null),
      [editorState, defaultText]
    );

    return (
      <Dialog
        open={open}
        onClose={onClose}
        disableAutoFocus
        disableEnforceFocus>
        <Toolbar component='div'>
          <Typography variant='h6' flexGrow={1}>
            {isLink ? "Modifier" : "Ajouter"} le lien
          </Typography>
          <IconButton onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        </Toolbar>
        <AddLinkContent
          onClose={onClose}
          onAdd={({ text, link }) => {
            const newEditorState = addLink(editorState, text, link);
            onClose();
            setEditorState(newEditorState);
          }}
          defaultLink={defaultLink}
          defaultText={text}
          editorRef={editorRef}
        />
      </Dialog>
    );
  }
);

const AddLinkContent = ({
  onClose,
  onAdd,
  defaultText = "",
  defaultLink = "",
}) => {
  const [text, setText] = useState(defaultText);
  const [link, setLink] = useState(defaultLink);

  return (
    <>
      <Box p={2} sx={{ "& > div": { my: 1 } }}>
        <TextField
          label='Text'
          name='text'
          fullWidth
          onChange={(event) => setText(event.target.value)}
          value={text}
          size='small'
        />
        <TextField
          label='Lien'
          name='link'
          value={link}
          fullWidth
          onChange={(event) => setLink(event.target.value)}
          size='small'
        />
      </Box>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          disabled={
            text.trim() === defaultText?.trim() &&
            link.trim() === defaultLink?.trim()
          }
          onClick={() => onAdd({ text, link })}>
          Enregistrer
        </Button>
      </DialogActions>
    </>
  );
};

AddLinkForm.displayName = "AddLinkForm";

AddLinkContent.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  defaultText: PropTypes.string,
  defaultLink: PropTypes.string,
  editorRef: PropTypes.object,
};

AddLinkForm.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  setEditorState: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editorRef: PropTypes.object,
};

export default AddLinkForm;
