import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import React, { useEffect, useState, useMemo, useRef } from "react";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../../../../../redux/data/data";
import AudioRecordingViewer from "./AudioRecordingViewer";
import RecordPlugin from "wavesurfer.js/plugins/record";

const AudioRecording = () => {
  const [permission, setPermission] = useState(null);
  const show = useSelector((store) => store.data.chatBox.footer.recording);
  const targetId = useSelector((store) => store.data.discussionTarget?.id);
  const reply = useSelector(
    (store) => store.data.app.actions.messaging.reply[targetId]
  );
  const dispatch = useDispatch();
  const isPromptAllow = permission === "prompt";
  const rootRef = useRef();

  const waveSurferData = useMemo(() => ({ instance: null, plugins: {} }), []);

  useEffect(() => {
    if (show)
      navigator.permissions.query({ name: "microphone" }).then((permission) => {
        setPermission(permission.state);
        if (permission.state === "prompt") {
          const tempoStreamRecording = RecordPlugin.create();
          tempoStreamRecording.startRecording().then(() => {
            tempoStreamRecording.destroy();
          });
        }
        permission.onchange = (e) => setPermission(e.target.state);
      });
    //rootRef.current?.focus();
  }, [show]);

  return (
    <>
      <Slide
        in={permission === "granted" && show}
        direction='up'
        unmountOnExit
        appear={false}>
        <Box
          height={`calc(100% - ${reply ? 50 : 0}px)`}
          //translate='.2s height'
          width='100%'
          display='flex'
          position='absolute'
          component='div'
          tabIndex={1}
          autoFocus
          ref={rootRef}
          bottom={0}
          left={0}
          sx={{
            zIndex: (t) => t.zIndex.tooltip,
            background: (t) =>
              `linear-gradient(transparent, transparent, 40%, ${t.palette.background.paper})`,
          }}>
          <AudioRecordingViewer waveSurferData={waveSurferData} />
        </Box>
      </Slide>
      <Dialog open={show && ["denied", "prompt"].includes(permission)}>
        <DialogTitle display='flex' alignItems='center' gap={1} component='div'>
          {isPromptAllow ? (
            <ArrowUpwardOutlinedIcon sx={{ transform: "rotate(-45deg)" }} />
          ) : (
            <BlockOutlinedIcon />
          )}
          {isPromptAllow
            ? "Accès au microphone requis"
            : "Autoriser le microphone"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isPromptAllow
              ? "Pour envoyer des messages vocaux sur Lisolo, autorisez l’accès à votre microphone en cliquant sur Autoriser. Votre confidentialité est importante."
              : "Lisolo ne peut pas accéder à votre microphone. Pour envoyer des messages vocaux, modifiez ce paramètre dès maintenant. Votre confidentialité est respectée : le micro ne s’active que lorsque vous choisissez d’enregistrer."}
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={() => {
                dispatch(
                  updateData({
                    data: { chatBox: { footer: { recording: false } } },
                  })
                );
              }}>
              {"D'accord, j'ai compris"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(AudioRecording);
