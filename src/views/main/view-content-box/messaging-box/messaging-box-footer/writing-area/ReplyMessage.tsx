import { Box, Button, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";
import getFullName from "../../../../../../utils/getFullName";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function ReplyMessage({
  message: _message,
  onScrollToMessage,
  onCancel,
}) {
  const message = useMemo(() => ({}), []);
  if (_message) message.sender = _message?.sender;
  const name = getFullName(message.sender);

  return (
    <Box
      overflow='auto'
      width='100%'
      flexGrow={1}
      p={1}
      display='flex'
      flexDirection='row'
      alignItems='center'
      component='div'
      onMouseDown={(event) => event.preventDefault()}>
      <Typography color='text.secondary' flexGrow={1}>
        Répondre à{" "}
        <Button
          color='inherit'
          size='small'
          sx={{ fontWeight: 600, m: 0, p: 0 }}
          onClick={onScrollToMessage}>
          {name}
        </Button>
      </Typography>
      <IconButton size='small' onClick={onCancel}>
        <CloseOutlinedIcon fontSize='small' />
      </IconButton>
    </Box>
  );
}
