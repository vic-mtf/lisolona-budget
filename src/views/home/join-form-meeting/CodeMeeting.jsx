import React, { useCallback /*,useLayoutEffect*/ } from "react";
import InputCode from "../../../components/InputCode";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../../../hooks/useSnackbar";
import messages from "./messages";
import IconButton from "../../../components/IconButton";
import { Box, FormLabel, Toolbar } from "@mui/material";
import PropTypes from "prop-types";

const CodeMeeting = ({ values, loading, refetch }) => {
  const navigateTo = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleCompleteCode = useCallback(
    async (code) => {
      console.log("Joining meeting with code:", code);
      if (!loading) {
        console.log("Joining meeting with code:", code);
        try {
          const { data: meeting } = await refetch({
            url: "api/chat/room/call/" + code.join(""),
          });
          navigateTo("/home", { replace: true, state: { meeting } });
        } catch (error) {
          const status = error?.request?.status;
          const { message, severity } = messages[status] || {};
          if (severity)
            enqueueSnackbar({
              message,
              severity,
              action: (key) => (
                <IconButton onClick={() => closeSnackbar(key)}>
                  <CloseOutlinedIcon />
                </IconButton>
              ),
            });
        }
      }
    },
    [closeSnackbar, enqueueSnackbar, refetch, loading, navigateTo]
  );

  return (
    <Box display='flex' gap={1} width='100%' flexDirection='column'>
      <Toolbar variant='dense' disableGutters>
        <FormLabel mb={1}>
          Entrez le code de la réunion pour participer
        </FormLabel>
      </Toolbar>
      <div style={{ width: "auto", display: "inline-flex" }}>
        <InputCode
          length={9}
          size={35}
          values={values}
          onComplete={handleCompleteCode}
        />
      </div>
    </Box>
  );
};

CodeMeeting.propTypes = {
  values: PropTypes.array,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};

export default CodeMeeting;
