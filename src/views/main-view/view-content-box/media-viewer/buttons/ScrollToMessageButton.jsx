import { Tooltip, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

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
