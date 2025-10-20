import store from '../../../../redux/store';
import formatDate, { formatTime } from '../../../../utils/formatDate';
import JoinMeeting from '../../forms/join-meeting/JoinMeeting';
import ScanMeeting from '../../forms/scan-meeting/ScanMeeting';
import InstantMeeting from '../../forms/instant-meeting/InstantMeeting';
import ScheduledMeeting from '../../forms/scheduled-meeting/ScheduledMeeting';
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import CastOutlinedIcon from '@mui/icons-material/CastOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import OnlinePredictionOutlinedIcon from '@mui/icons-material/OnlinePredictionOutlined';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';

const groupCall = (calls = [], type = 'all') => {
  const groupedCalls = [];
  const id = store.getState().user.id;

  ////////////////////////////////////////////////////////////////////////////////////////////////
  const meetings = calls.map((call) => ({
    ...call,
    status: setStatus(call.status),
  }));
  ////////////////////////////////////////////////////////////////////////////////////////////////

  sortBy(meetings, 'createdAt', (value) => new Date(value).getTime()).forEach(
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
          getDate(call.createdAt) === getDate(previousCall.createdAt) &&
          call.status === previousCall.status
      );

      if (foundMeeting) foundMeeting.calls.push(meeting);
      else if (type === 'all' ? true : call?.status === type)
        groupedCalls.push({
          ...meeting,
          calls: [meeting],
        });
    }
  );
  return addDateLabel(groupedCalls);
};

const sortBy = (data, key = 'createdAt', treat = (value) => value) =>
  [...data].sort((a, b) => treat(b[key]) - treat(a[key]));

const getLocation = (call) => {
  if (call?.room) return call.location;
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
  return contact;
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

const getDate = (d) => new Date(d).toLocaleDateString();

////////////////////////////////////////////////////////////////////////
export const setStatus = (status) =>
  ['started', 'scheduled', 'running', 'fail', 'ended'].includes(status)
    ? status
    : { 0: 'started', 1: 'running', 7: 'scheduled' }[status] || 'ended';
////////////////////////////////////////////////////////////////////////

const addLabelInData = (calls = []) => {
  const runningList = [];
  const scheduledList = [];
  const othersList = [];
  calls.forEach((call) => {
    if (call.status === 'running') runningList.push(call);
    else if (call.status === 'scheduled') scheduledList.push(call);
    else othersList.push(call);
  });

  if (runningList.length)
    runningList.unshift({
      label: 'Réunion en cours',
      id: 'running',
      type: 'label',
    });
  if (scheduledList.length)
    scheduledList.unshift({
      label: 'Réunions planifiées',
      id: 'scheduled',
      type: 'label',
    });
  if (othersList.length)
    othersList.unshift({
      label: "Historique d'appels",
      id: 'history',
      type: 'label',
    });

  return [...runningList, ...scheduledList, ...othersList];
};

const addDateLabel = (calls = []) => {
  const labels = [];
  const callsWithLabel = [];
  calls.forEach((call) => {
    const { createdAt } = call;
    const date = formatTime({ date: createdAt, sameDayOption: 'day' });
    if (!labels.includes(date)) {
      labels.push(date);
      callsWithLabel.push({
        label: date,
        id: createdAt,
        type: 'label',
      });
    }
    callsWithLabel.push(call);
  });
  return callsWithLabel;
};

export const groupTypes = [
  {
    id: 'all',
    label: 'Tous les appels',
    icon: 'div',
  },
  {
    id: 'scheduled',
    label: 'Réunions planifiées',
    icon: ScheduleOutlinedIcon,
  },
  {
    id: 'running',
    label: 'Réunion en cours',
    icon: OnlinePredictionOutlinedIcon,
  },
  {
    id: 'ended',
    label: "Historique d'appels",
    icon: CallSplitOutlinedIcon,
  },
];

export const options = [
  {
    label: 'Démarrer une réunion instantanée',
    icon: HistoryToggleOffOutlinedIcon,
    id: 'start-meeting',
    content: InstantMeeting,
    action(_, user) {
      window.open(import.meta.env.BASE_URL + '/conference/create', '_blank');
      store.dispatch({
        type: 'conference/updateConferenceData',
        payload: {
          key: 'callTarget',
          data: {
            id: user?.id,
            name: user.name,
            type: user?.type,
            image: user?.image,
            description: user?.description,
          },
        },
      });
    },
  },
  {
    label: 'Planifier une réunion',
    icon: DateRangeOutlinedIcon,
    id: 'schedule-meeting',
    content: ScheduledMeeting,
  },
  {
    label: 'Démarrer une diffusion en direct',
    icon: CastOutlinedIcon,
    id: 'start-live-streaming',
    disabled: true,
    content: 'div',
  },
];

export const joinOptions = [
  {
    id: 'join-meeting',
    content: JoinMeeting,
    closed: true,
    label: 'Participer à une reunion par le code',
    icon: PasswordOutlinedIcon,
  },
  {
    id: 'scan-code',
    icon: QrCodeScannerIcon,
    content: ScanMeeting,
    label: 'Rejoindre une reunion par le code QR',
    // closed: true,
    //disabled: true,
  },
];
export default groupCall;
