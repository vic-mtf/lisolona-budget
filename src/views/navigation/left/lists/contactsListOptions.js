import store from "../../../../redux/store";
import getFullName from "../../../../utils/getFullName";
import timeHumanReadable from "../../../../utils/timeHumanReadable";
import CallContactItem from "../items/CallContactItem";
import CurrentCallContactItem from "../items/CurrentCallContactItem";
import HistoryToggleOffRoundedIcon from "@mui/icons-material/HistoryToggleOffRounded";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import Groups3OutlinedIcon from "@mui/icons-material/Groups3Outlined";
import CastRoundedIcon from "@mui/icons-material/CastRounded";
import { addData } from "../../../../redux/data";
import { participantsAppel } from "../../../main/chat-box/chat-area/alert/Profile";
import { getTime } from "../../../../utils/formatTime";
import { isPlainObject } from "lodash";
import ScheduleMeetingItem from "../items/ScheduleMeetingItem";

export function sortMeetings(calls) {
  const meetings = [];
  const user = store?.getState()?.user;
  calls?.forEach((call) => {
    const participants = call?.members?.filter(
      (member) => member?.identity?._id !== user?.id,
    );
    const nativeParticipants =
      call?.members?.map((member) => member?.identity) || [];
    const avatarsSrc = [
      nativeParticipants[0]?.imageUrl,
      nativeParticipants[nativeParticipants?.length - 1]?.imageUrl,
    ];
    const names = participantsAppel(
      participants?.map(({ identity }) =>
        participants.length > 1 ? identity?.fname : getFullName(identity),
      ),
    );
    const name = call?.name || names;
    const type =
      call?.origin?.room || participants?.length > 1 ? "room" : "direct";
    const avatarSrc =
      type === "room"
        ? call?.origin?.room?.imageUrl
        : participants[0]?.identity?.imageUrl;

    const status = ["schedule", "on", "end", "miss", "fail"];
    const location = isPlainObject(call?.location)
      ? call?.location?._id
      : call?.location;
    const data = {
      ...call,
      avatarSrc,
      avatarsSrc,
      names,
      name,
      type,
      groupId: call?.location?.toString(),
      title: timeHumanReadable(call.createdAt, true, { showDetail: false }),
      location,
    };
    if (call?.status === 1) data.key = "on";
    else if (call?.status === 7) data.key = "schedule";
    else data.key = "end";
    data.status = status[call?.status];
    meetings.push(data);
  });
  return groupByTitle(groupByKeys(meetings));
}

export function groupByKeys(arr) {
  const data = sortByCreatedAt(arr);
  const groupMap = new Map();
  data.forEach((obj) => {
    const { groupId, key, title } = obj;
    const keyString = `${groupId}_${key}_${title}`;
    if (groupMap.has(keyString)) {
      const groupObj = groupMap.get(keyString);
      groupObj.count++;
      groupObj.children.push(obj);
    } else {
      const groupObj = {
        ...obj,
        groupId,
        key,
        title,
        count: 1,
        children: [obj],
      };
      groupMap.set(keyString, groupObj);
    }
  });
  return Array.from(groupMap.values());
}

export function groupByTitle(arr) {
  const result = [];
  arr.forEach((obj) => {
    const existingObj = result.find((el) => el.title === obj.title);
    if (existingObj) {
      existingObj.data.push(obj);
      existingObj.count++;
    } else {
      result.push({
        title: obj.title,
        data: [obj],
        count: 1,
      });
    }
  });
  return result;
}

export const callsItems = {
  on: CurrentCallContactItem,
  end: CallContactItem,
  schedule: ScheduleMeetingItem,
};

export function sortByCreatedAt(objects) {
  return objects.sort(
    ({ createdAt: a }, { createdAt: b }) => getTime(b) - getTime(a),
  );
}

export const menuGlobalCall = [
  {
    Icon: MeetingRoomOutlinedIcon,
    label: "Rejoindre une reunion en cours",
    onClick() {
      store.dispatch(
        addData({
          key: "dialog",
          data: "join-meeting-by-code",
        }),
      );
    },
  },
  {
    Icon: Groups3OutlinedIcon,
    label: "Démarrer une réunion instantanée",
    disabled: true,
    onClick() {
      // setAnchorEl(null);
      // handleOpenMeeting('prepare');
    },
  },
  {
    Icon: HistoryToggleOffRoundedIcon,
    label: "Planifier une réunion",
    disabled: true,
  },
  {
    Icon: CastRoundedIcon,
    label: "Diffusion vidéo en direct",
    disabled: true,
  },
];
