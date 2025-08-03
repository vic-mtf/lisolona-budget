import React from "react";
import { Box, Fab, ToggleButton, Tooltip } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Stack } from "@mui/system";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import sendData from "./buttons/sendData";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../../../../../redux/data/data";
import AddFilesButton from "./footer-buttons/AddFilesButton";

const EditorAreaFooter = React.memo(
  ({ hideToolbar, isSendable = false, onToggleToolbar, id, filesExist }) => {
    const disabledMic = useSelector(
      (store) => store.data.chatBox.footer.recording
    );
    const limitFiles = useSelector(
      (store) => store.data.chatBox.footer.files[id]?.length === 10
    );
    const dispatch = useDispatch();

    return (
      <Box
        display='flex'
        flexDirection='row'
        p={0.5}
        component='div'
        onMouseDown={(event) => event.preventDefault()}>
        <Stack
          flexGrow={1}
          sx={{
            "& button": { border: "none" },
            "& button:disabled": { border: "none" },
          }}
          spacing={1}
          direction='row'>
          <div>
            <Tooltip title='fichier' placement='bottom' enterDelay={1200}>
              <div>
                <AddFilesButton disabled={limitFiles} />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title="barre d'outils"
              placement='bottom'
              enterDelay={1200}>
              <ToggleButton
                size='small'
                color='primary'
                value='toolbar'
                selected={!hideToolbar}
                onClick={onToggleToolbar}>
                <TextFieldsOutlinedIcon fontSize='small' />
              </ToggleButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip title='Emoji icon' placement='bottom' enterDelay={1200}>
              <div>
                <ToggleButton
                  size='small'
                  color='primary'
                  value='toolbar'
                  disabled>
                  <SentimentSatisfiedOutlinedIcon fontSize='small' />
                </ToggleButton>
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                limitFiles
                  ? "Limite de 10 fichiers atteinte"
                  : "Enregistrer un audio"
              }
              placement='bottom'
              enterDelay={1200}>
              <div>
                <ToggleButton
                  size='small'
                  color='primary'
                  value='voice'
                  disabled={disabledMic || limitFiles}
                  onClick={() => {
                    dispatch(
                      updateData({
                        data: { chatBox: { footer: { recording: true } } },
                      })
                    );
                  }}>
                  <MicOutlinedIcon fontSize='small' />
                </ToggleButton>
              </div>
            </Tooltip>
          </div>
        </Stack>
        <Fab
          color='primary'
          onClick={sendData}
          disabled={filesExist ? false : !isSendable}>
          <SendOutlinedIcon />
        </Fab>
      </Box>
    );
  }
);

EditorAreaFooter.displayName = "EditorAreaFooter";

EditorAreaFooter.propTypes = {
  hideToolbar: PropTypes.bool.isRequired,
  isSendable: PropTypes.bool.isRequired,
  onToggleToolbar: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  filesExist: PropTypes.bool.isRequired,
};

export default EditorAreaFooter;
