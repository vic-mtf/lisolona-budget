import React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import useToken from "../../../../hooks/useToken";
import {
  Box,
  Button,
  IconButton,
  ListItem,
  // ListItemButton,
  Stack,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PropTypes from "prop-types";
import ListAvatar from "../../../../components/ListAvatar";
import { timeElapses } from "../../../../utils/formatDate";
// import { LoadingButton } from "@mui/lab";
import useAxios from "../../../../hooks/useAxios";
// import getFullName from "../../../../utils/getFullName";

const GuestItem = React.memo(
  ({
    name,
    image,
    status,
    id,
    //  / email,
    divider,
    createdAt,
    // sender = { name: "sender name" },
  }) => {
    return (
      <div>
        <ListItem
          //   disablePadding
          alignItems='flex-start'
          secondaryAction={
            <Tooltip title='Datail'>
              <IconButton edge='end'>
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          }>
          <ListItemAvatar>
            <ListAvatar
              src={image}
              alt={name}
              id={id}
              status={status}
              invisible>
              {name?.toUpperCase()?.charAt(0)}
            </ListAvatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Stack direction='row' spacing={1}>
                <Typography
                  flexGrow={1}
                  textOverflow='ellipsis'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  fontWeight={550}>
                  {name}
                </Typography>
                <Typography
                  variant='caption'
                  component='div'
                  display='flex'
                  whiteSpace='nowrap'
                  color='text.secondary'
                  justifyContent='end'>
                  {timeElapses({ date: createdAt })}
                </Typography>
              </Stack>
            }
            secondary={
              <Stack spacing={1}>
                <Typography
                  alignItems='center'
                  flexGrow={1}
                  textOverflow='ellipsis'
                  overflow='hidden'
                  color='text.secondary'
                  variant='body2'
                  display='-webkit-box'
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                  Cette personne souhaite entrer en contact avec vous
                </Typography>
                <Box display='flex' flexDirection='row' gap={1}>
                  <ButtonActions id={id} />
                </Box>
              </Stack>
            }
            primaryTypographyProps={{ component: "div" }}
            secondaryTypographyProps={{ component: "div" }}
          />
        </ListItem>
        <Divider variant='inset' sx={{ opacity: divider ? 1 : 0 }} />
      </div>
    );
  }
);

const ButtonActions = ({ id: _id }) => {
  const Authorization = useToken();
  const [{ loading }, refetch] = useAxios(
    { method: "POST", headers: { Authorization } },
    { manual: true }
  );

  const handleSubmitResponse = async (rep) => {
    try {
      await refetch({ url: "api/chat/" + rep, data: { _id } });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Button
        fullWidth
        sx={{ flex: 1 }}
        variant='outlined'
        disabled={loading}
        onClick={() => handleSubmitResponse("accept")}>
        Supprimer
      </Button>
      <Button
        fullWidth
        sx={{ flex: 1 }}
        variant='contained'
        disabled={loading}
        onClick={() => handleSubmitResponse("reject")}>
        Confitmer
      </Button>
    </>
  );
};
ButtonActions.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
GuestItem.displayName = "GuestItem";

GuestItem.propTypes = {
  selected: PropTypes.bool,
  src: PropTypes.string,
  name: PropTypes.string,
  sender: PropTypes.object,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  email: PropTypes.string,
  divider: PropTypes.bool,
  status: PropTypes.oneOf(["online", "offline", "away"]),
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
};

export default GuestItem;
