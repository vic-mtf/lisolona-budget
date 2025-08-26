import {
  Box,
  Button,
  DialogActions,
  IconButton,
  Toolbar,
  Typography,
  ListItemText,
  Dialog,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemIcon,
  ListItem,
  ListItemAvatar,
  List,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
// import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import React, { useCallback, useMemo, useRef } from "react";
import formatDate, { timeElapses } from "../../../../utils/formatDate";
import LinearProgressLayer from "../../../../components/LinearProgressLayer";
import ListAvatar from "../../../../components/ListAvatar";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import useSmallScreen from "../../../../hooks/useSmallScreen";
import { updateData } from "../../../../redux/data/data";
import getFullName from "../../../../utils/getFullName";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
//import generateQRImage from "../../../../utils/generateQRImage";
import scrollBarSx from "../../../../utils/scrollBarSx";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";

const CallDetailsView = ({ onCallAction }) => {
  const { open, call } = useSelector(
    (store) => store.data.app.actions.calls.info
  );
  const dispatch = useDispatch();
  const matches = useSmallScreen();
  // const qrCodeRef = useRef();

  const onClose = useCallback(() => {
    const key = "app.actions.calls.info.open";
    dispatch(updateData({ key, data: false }));
  }, [dispatch]);

  const location = useMemo(() => call?.location, [call]);
  const name = useMemo(() => getFullName(location), [location]);
  // const theme = useTheme();
  const isExistingCall = ["running", "scheduled"].includes(call?.status);
  const buttonActionProps = useMemo(() => getButtonProps(call), [call]);

  return (
    <Dialog open={open} fullScreen={matches}>
      <Box
        component='form'
        overflow='hidden'
        height='100%'
        width='100%'
        display='flex'
        flexDirection='column'>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            //disabled={loading}
            aria-label='close'
            onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Détail de {call?.room ? "la reunion" : "l'appel"}
          </Typography>
        </Toolbar>
        <Box
          overflowY='auto'
          position='relative'
          minHeight={{ md: 250 }}
          flex={1}
          width={{ md: 450, xs: "100%" }}>
          <Box
            overflow='hidden'
            position='relative'
            minHeight={{ md: 500, lg: 550, xl: 700, xs: "100%" }}
            flex={1}
            width={{ md: 450 }}
            sx={{
              "& > div": {
                display: "flex",
                overflow: "hidden",
                overflowY: "auto",
                position: "absolute",
                height: "100%",
                width: "100%",
                flexDirection: "column",
                top: 0,
                left: 0,
                ...scrollBarSx,
                scrollbarGutter: "stable",
              },
            }}>
            <Box>
              <Toolbar
                sx={{
                  position: "sticky",
                  top: 0,
                  backdropFilter: "blur(10px)",
                  zIndex: (theme) => theme.zIndex.appBar,
                  gap: 2,
                  px: 1,
                }}
                disableGutters>
                <ListAvatar src={location?.image} id={location?.id} invisible>
                  {name?.charAt(0)}
                </ListAvatar>
                <ListItemText
                  primary={name}
                  secondary={secondaryText(call)}
                  slotProps={{
                    primary: {
                      variant: "body1",
                    },
                    secondary: { variant: "body2" },
                  }}
                />
                {["running", "scheduled"].includes(call?.status) &&
                  window.navigator?.share && (
                    <IconButton>
                      <ShareOutlinedIcon />
                    </IconButton>
                  )}
              </Toolbar>

              <Box
                my={2}
                display='flex'
                alignItems='center'
                flexDirection='column'
                px={1}>
                {call?.title && (
                  <Typography variant='h6' fontSize={16} align='center'>
                    {call.title}
                  </Typography>
                )}
                {isExistingCall && <CodeQRBox value='Bonjour les amis' />}
              </Box>
              <MoreInfos call={call} isExistingCall={isExistingCall} />
            </Box>
          </Box>
        </Box>
        <DialogActions>
          <Button
            variant='outlined'
            endIcon={React.createElement(buttonActionProps.Icon)}
            //type='submit'
            onClick={() => {
              onCallAction(call)();
              onClose();
            }}>
            {buttonActionProps.text}
          </Button>
        </DialogActions>
      </Box>
      <LinearProgressLayer open={false} />
    </Dialog>
  );
};
// const svgElement = qrCodeRef.current;
// if (svgElement)
//   generateQRImage({
//     svgElement,
//     title: `Les jeunes entrepreneurs d’Afrique francophone`,
//     description: `GEID | Lisolo connecte, forme et propulse les talents en leur offrant des outils numériques accessibles et puissants, au service d’une communauté engagée dans l’innovation et le partage.`,
//     theme,
//   }).then((blob) => {
//     window.open(URL.createObjectURL(blob), "_blank");
//     console.log(blob);
//   });

const secondaryText = (call) => {
  if (call?.status === "running")
    return `Reunion en cours ${timeElapses({
      date: call?.createdAt,
    }).toLocaleLowerCase()}`;
  else if (call?.status === "scheduled")
    return `Reunion planifiée   ${formatDate({
      date: call?.createdAt,
    }).toLocaleLowerCase()}`;
  else if (!call?.room)
    return `${call?.incoming ? "Appel entrant" : "Appel sortant"} ${formatDate({
      date: call?.createdAt,
    }).toLocaleLowerCase()}`;
  else
    return formatDate({
      date: call?.createdAt,
    });
};

const MoreInfos = ({ call, isExistingCall }) => {
  const user = useSelector((store) => store.user);
  const [expanded, setExpanded] = React.useState(
    !isExistingCall
      ? call?.description
        ? "description"
        : "participants"
      : null
  );

  const participants = useMemo(
    () =>
      [
        {
          ...user,
          name: "Vous",
        },
      ].concat(
        call?.participants
          ?.map(({ identity }) => identity)
          ?.filter(({ id }) => id !== user.id)
      ) || [],
    [call, user]
  );
  const nbr = useMemo(() => participants?.length, [participants]);
  const maxShow = 10;

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : null);
  };
  return (
    <Box px={1}>
      {call?.description && (
        <Accordion
          expanded={expanded === "description"}
          onChange={handleChange("description")}>
          <AccordionSummary
            expandIcon={<ExpandMoreOutlinedIcon />}
            aria-controls='description'
            id='description'>
            <ListItemIcon sx={{ alignItems: "center" }}>
              <LightbulbOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Déscription de la reunion' />
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body1'>{call.description}</Typography>
          </AccordionDetails>
        </Accordion>
      )}
      {(call?.room || nbr > 2) && (
        <Accordion
          expanded={expanded === "participants"}
          onChange={handleChange("participants")}>
          <AccordionSummary
            LinkComponent={ListItem}
            expandIcon={<ExpandMoreOutlinedIcon />}
            aria-controls='panel4bh-content'
            id='panel4bh-header'>
            <ListItemIcon sx={{ alignItems: "center" }}>
              <GroupOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary='Participants'
              secondary={`${nbr} personne${nbr > 1 ? "s" : ""}`}
              sx={{ width: "33%", flexShrink: 0 }}
              slotProps={{
                primary: {
                  sx: { width: "33%", flexShrink: 0 },
                  component: "span",
                },
              }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {participants
                ?.slice(0, maxShow)
                ?.map((participant, index, participants) => (
                  <>
                    <ParticipantItem key={participant.id} user={participant} />
                    {participants.length - 1 !== index && <Divider />}
                  </>
                ))}
              {nbr > maxShow && (
                <Button>
                  Voir tous les participants ({nbr - maxShow} de plus)
                </Button>
              )}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};
const CodeQRBox = ({ value }) => {
  const theme = useTheme();
  return (
    <>
      <Box
        component={QRCode}
        bgColor='transparent'
        fgColor={theme.palette.text.primary}
        onLoad={console.log}
        radius={10}
        m={2}
        sx={{
          borderRadius: 2,
          "& path": {
            strokeWidth: 100,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          },
        }}
        value={value}
      />
      <Typography variant='caption' color='text.secondary'>
        Vous pouvez scanner ce code pour rejoindre la reunion
      </Typography>
    </>
  );
};
MoreInfos.propTypes = {
  call: PropTypes.object,
  isExistingCall: PropTypes.bool,
};
CodeQRBox.propTypes = {
  value: PropTypes.string,
};

const ParticipantItem = ({ user }) => {
  const name = getFullName(user);
  return (
    <ListItem disableGutters>
      <ListItemAvatar>
        <ListAvatar src={user?.image} alt={name} id={user?.id} invisible>
          {name?.charAt(0)}
        </ListAvatar>
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItem>
  );
};

ParticipantItem.propTypes = {
  user: PropTypes.object,
};
const getButtonProps = ({ status, room } = {}) => {
  if (room) {
    if (status === "ended" || status === "running")
      return {
        text:
          status === "ended" ? "Relancer la reunion" : "Rejoindre la reunion",
        Icon: CoPresentOutlinedIcon,
      };
    if (status === "scheduled")
      return {
        text: "Aller à la salle d'attente",
        Icon: MeetingRoomOutlinedIcon,
      };
  } else
    return {
      text: "Rappeler",
      Icon: CallOutlinedIcon,
    };
};

CallDetailsView.propTypes = {
  onClose: PropTypes.func,
  onCallAction: PropTypes.func,
  room: PropTypes.object,
};
export default React.memo(CallDetailsView);
