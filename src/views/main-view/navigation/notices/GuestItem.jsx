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
  CardActions,
  Stack,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PropTypes from "prop-types";
import ListAvatar from "../../../../components/ListAvatar";
import { timeElapses } from "../../../../utils/formatDate";
// import { LoadingButton } from "@mui/lab";
import useAxios from "../../../../hooks/useAxios";
import { useEffect } from "react";
// import getFullName from "../../../../utils/getFullName";

const GuestItem = React.memo(
  ({ name, image, status, id, divider, createdAt, isRemote }) => {
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
                <Box flexGrow={1}>
                  <Typography component='span' variant='body1'>
                    {name}
                  </Typography>{" "}
                  <Typography
                    component='span'
                    color='text.secondary'
                    variant='body2'>
                    {isRemote
                      ? "souhaite entrer en contact avec vous"
                      : " a reçu votre invitation"}{" "}
                    —{" "}
                    <Typography
                      variant='caption'
                      component='span'
                      color='currentColor'>
                      <Timer createdAt={createdAt} />
                    </Typography>
                  </Typography>
                </Box>
              </Stack>
            }
            secondary={
              <div>
                <ButtonActions id={id} isRemote={isRemote} />
              </div>
            }
            slotProps={{
              primary: { component: "div" },
              secondary: { component: "div" },
            }}
          />
        </ListItem>
        <Divider variant='inset' sx={{ opacity: divider ? 1 : 0 }} />
      </div>
    );
  }
);

const ButtonActions = ({ id: _id, isRemote }) => {
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
    <CardActions sx={{ justifyContent: "flex-end", display: "flex" }}>
      {isRemote ? (
        <>
          <Button
            variant='outlined'
            disabled={loading}
            onClick={() => handleSubmitResponse("accept")}>
            Supprimer
          </Button>
          <Button
            variant='contained'
            disabled={loading}
            onClick={() => handleSubmitResponse("reject")}>
            Confitmer
          </Button>
        </>
      ) : (
        <>
          <Button
            variant='outlined'
            //variant='contained'
            disabled={loading}
            onClick={() => handleSubmitResponse("reject")}>
            Annuler
          </Button>
        </>
      )}
    </CardActions>
  );
};

const Timer = ({ createdAt }) => {
  const [elapsed, setElapsed] = React.useState(
    timeElapses({ date: createdAt })
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(timeElapses({ date: createdAt }));
    }, 30000);
    return () => clearInterval(interval);
  }, [createdAt]);
  return elapsed;
};

ButtonActions.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isRemote: PropTypes.bool,
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
  checkable: PropTypes.bool,
  status: PropTypes.oneOf(["online", "offline", "away"]),
  isRemote: PropTypes.bool,
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
};

export default GuestItem;
