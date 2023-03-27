import { useSelector } from "react-redux";

export default function useGetUser (uid) {
    const user = useSelector(store => {
        const {chatGroups, contacts} = store.data;
        const meetingId = store.teleconference.meetingId;
        const type = store.teleconference.type;
        const contact = type === 'direct' ? 
        contacts?.find(({id}) => id === uid) : 
        chatGroups?.find(({_id: id}) => id === meetingId);
        const members = contact?.members?.map(
            ({_id: user, role}) => store.user?.id !== user?._id && ({
                ...user,
                role,
                id: user?._id,
                origin: user,
                name: `${user?.fname || ''} ${ user?.lname || ''} ${user?.mname || ''}`.trim(),
            })
        )?.filter(name => name);
        const user = (type === 'direct' ? contact : members?.find(({id}) => id === uid));
        const name = user?.name;
        const avatarSrc = user?.imageUrl || user?.avatarSrc;
        return {name, avatarSrc};
    });

    return {...user};
}