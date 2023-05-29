import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function useGetUser (uid) {
    const target = useSelector(store => store.teleconference.target);
    const from = useSelector(store => store.teleconference.from);
    const members = useMemo(() => target?.members?.map(
        ({_id: user, role}) => ({
            ...user,
            role,
            id: user?._id,
            origin: user,
            name: `${user?.fname || ''} ${ user?.lname || ''} ${user?.mname || ''}`.trim(),
            avatarSrc: user?.imageUrl
        })
    ));
    const user = target?.type === 'direct' ?
    (target?.id === uid ? target : from):
    (members?.find(({id}) => id === uid))
    return {...user};
}