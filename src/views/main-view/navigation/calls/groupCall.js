import store from "../../../../redux/store";
import formatDate from "../../../../utils/formatDate";
import JoinMeeting from "../../forms/join-meeting/JoinMeeting";
import ScanMeeting from "../../forms/scan-meeting/ScanMeeting";
import InstantMeeting from "../../forms/instant-meeting/InstantMeeting";
import ScheduledMeeting from "../../forms/scheduled-meeting/ScheduledMeeting";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import CastOutlinedIcon from "@mui/icons-material/CastOutlined";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";

const groupCall = (calls = [], type = "all") => {
  const groupedCalls = [];
  const id = store.getState().user.id;

  ////////////////////////////////////////////////////////////////////////////////////////////////
  const meetings = calls.map((call) => ({
    ...call,
    status: setStatus(call.status),
  }));
  ////////////////////////////////////////////////////////////////////////////////////////////////

  sortBy(meetings, "createdAt", (value) => new Date(value).getTime()).forEach(
    (call, index, calls) => {
      const location = getLocation(call);
      const previousCall = calls[index - 1];
      const incoming = call.createdBy !== id;
      const createdBy = getCreator(call);

      const meeting = {
        ...call,
        location,
        incoming,
        createdBy,
      };
      const foundMeeting = groupedCalls.find(
        (call) =>
          call?.location?.id === location.id &&
          getLocation(previousCall)?.id === location.id &&
          getCallDate(call.createdAt) === getCallDate(previousCall.createdAt) &&
          call.status === previousCall.status
      );

      if (foundMeeting) foundMeeting.calls.push(meeting);
      else if (type === "all" ? true : call?.status === type)
        groupedCalls.push({
          ...meeting,
          calls: [],
        });
    }
  );
  return type === "all" ? addLabelInData(groupedCalls) : groupedCalls;
};

const sortBy = (data, key = "createdAt", treat = (value) => value) =>
  [...data].sort((a, b) => treat(b[key]) - treat(a[key]));

const getLocation = (call) => {
  const id = store.getState().user.id;
  const contacts = store.getState().data.app.contacts;
  const participants =
    call?.participants
      ?.map(({ identity }) => identity)
      ?.filter((user) => user.id !== id) || [];
  const searchContact = contacts.find(({ id }) =>
    participants?.find((user) => user.id === id)
  );
  const contact = searchContact || participants[0];
  return call?.room ? call.location : contact;
};

const getCreator = (call) => {
  const user = store.getState().user;
  const contacts = store.getState().data.app.contacts;
  const participants = call?.participants;
  return (
    [...participants, ...contacts].find(({ id }) => id === call?.createdBy) ||
    user
  );
};

const getCallDate = (date) =>
  formatDate({
    date,
    lang: "en",
    options: { hour: undefined, minute: undefined },
  }).toLocaleLowerCase();

////////////////////////////////////////////////////////////////////////
const setStatus = (status) =>
  ["started", "scheduled", "running", "fail", "ended"].includes(status)
    ? status
    : { 0: "started", 1: "running", 7: "scheduled" }[status] || "ended";
////////////////////////////////////////////////////////////////////////

const addLabelInData = (calls = []) => {
  const runningList = [];
  const scheduledList = [];
  const othersList = [];
  calls.forEach((call) => {
    if (call.status === "running") runningList.push(call);
    else if (call.status === "scheduled") scheduledList.push(call);
    else othersList.push(call);
  });

  if (runningList.length)
    runningList.unshift({
      label: "Réunion en cours",
      id: "running",
      type: "label",
    });
  if (scheduledList.length)
    scheduledList.unshift({
      label: "Réunions planifiées",
      id: "scheduled",
      type: "label",
    });
  if (othersList.length)
    othersList.unshift({
      label: "Historique d'appels",
      id: "history",
      type: "label",
    });

  return [...runningList, ...scheduledList, ...othersList];
};

export const groupTypes = [
  {
    id: "all",
    label: "Tous",
    icon: "div",
  },
  {
    id: "scheduled",
    label: "Réunions planifiées",
    icon: "div",
  },
  {
    id: "running",
    label: "Réunion en cours",
    icon: "vid",
  },
];

export const options = [
  {
    label: "Démarrer une réunion instantanée",
    icon: HistoryToggleOffOutlinedIcon,
    id: "start-meeting",
    content: InstantMeeting,
  },
  {
    label: "Planifier une réunion",
    icon: DateRangeOutlinedIcon,
    id: "schedule-meeting",
    content: ScheduledMeeting,
  },
  {
    label: "Démarrer une diffusion en direct",
    icon: CastOutlinedIcon,
    id: "start-live-streaming",
    disabled: true,
    content: "div",
  },
];

export const joinOptions = [
  {
    id: "join-meeting",
    content: JoinMeeting,
    closed: true,
    label: "Participer à une reunion par le code",
    icon: PasswordOutlinedIcon,
  },
  {
    id: "scan-code",
    icon: QrCodeScannerIcon,
    content: ScanMeeting,
    label: "Rejoindre une reunion par le code QR",
    // closed: true,
    //disabled: true,
  },
];
export default groupCall;
