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
import React, { useLayoutEffect, useState } from "react";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../../../../../redux/data/data";
import AudioRecordingViewer from "./AudioRecordingViewer";

const AudioRecording = () => {
  const [permission, setPermission] = useState(null);
  const recording = useSelector((store) => store.data.chatBox.footer.recording);
  const targetId = useSelector((store) => store.data.discussionTarget?.id);
  const reply = useSelector(
    (store) => store.data.app.actions.messaging.reply[targetId]
  );
  const dispatch = useDispatch();
  const isPromptAllow = permission === "prompt";
  const openAlert = ["denied", "prompt"].includes(permission);

  useLayoutEffect(() => {
    let permission;
    const onChange = (e) => setPermission(e.target.state);
    const getPermission = async () => {
      permission = await navigator.permissions.query({ name: "microphone" });
      setPermission(permission.state);
      permission?.addEventListener("change", onChange);
    };
    if (!permission) getPermission();
  }, [recording]);

  return (
    <>
      <Slide
        in={permission === "granted" && recording}
        direction='up'
        unmountOnExit
        appear={false}>
        <Box
          height={`calc(100% - ${reply ? 50 : 0}px)`}
          width='100%'
          display='flex'
          position='absolute'
          component='div'
          tabIndex={1}
          autoFocus
          bottom={0}
          left={0}
          sx={{
            zIndex: (t) => t.zIndex.tooltip,
            background: (t) =>
              `linear-gradient(transparent, transparent, 40%, ${t.palette.background.paper})`,
          }}>
          <AudioRecordingViewer />
        </Box>
      </Slide>
      <Dialog open={recording && openAlert}>
        <DialogTitle display='flex' alignItems='center' gap={1} component='div'>
          {["prompt", "granted"].includes(permission) ? (
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
              onClick={async () => {
                let stream;
                try {
                  stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                  });
                } catch (err) {
                  console.log("err", err);
                  dispatch(
                    updateData({
                      data: { chatBox: { footer: { recording: false } } },
                    })
                  );
                }
                stream?.getTracks()?.forEach((track) => track.stop());
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
