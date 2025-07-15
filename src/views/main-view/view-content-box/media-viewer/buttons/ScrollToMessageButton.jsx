import { Tooltip, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import store from "../../../../../redux/store";

const ScrollToMessageButton = ({ VListRef, messages, data, onClose }) => {
  return (
    <Tooltip title='Aller au message' placement='top' disableFocusListener>
      <span>
        <IconButton
          onClick={() => {
            onClose();
            VListRef?.current?.scrollToIndex(
              messages?.findIndex(({ clientId, id }) =>
                clientId ? clientId === data?.clientId : id === data?.id
              )
            );

            store.dispatch({
              type: "data/updateData",
              payload: {
                key: `app.actions.messaging.blink.${
                  data?.id || data?.clientId
                }`,
                data: true,
              },
            });
          }}>
          <ChatBubbleOutlineOutlinedIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

ScrollToMessageButton.propTypes = {
  VListRef: PropTypes.object,
  messages: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ScrollToMessageButton;
