import store from "../redux/store";

// export function structureMeetingData ({meeting, userId, isUpdate = false}) {
//     const name = meeting?.room?.name;
//     const avatarSrc = meeting?.room?.imageUrl;
//     const id = userId || store?.getState()?.user?.id;
//     const data =  {
//         ...isUpdate ? {} : {
//             id: meeting?._id,
//             title: meeting?.title,
//             description: meeting?.description,
//             duration: meeting?.duration,
//             isMine: id === meeting?.createdBy?._id,
//             options: meeting?.callDetails,
//             location: meeting?.location,
//             createdAt: new Date(meeting?.createdAt),
//             createdBy: meeting?.createdBy,
//             startedAt: meeting?.start,
//             name,
//         },
//         members: meeting?.participants || meeting.members,
//         avatarSrc,
//         status: meeting?.status,
//         origin: meeting?.origin || meeting,
//         updatedAt: new Date(meeting?.updatedAt),
//     };
//     Object.keys(data).forEach(key => {
//         if(data[key] === undefined) delete data[key];
//     });
//     return data;
// };
// export function structureMessageData({message, userId, isUpdated}) {};
// export function structureDiscussionData({discussion, userId, isUpdated}) {};