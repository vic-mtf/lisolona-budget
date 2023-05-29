import { useSelector } from "react-redux";
import Lists from "../../../../navigation/left/lists/Lists";
import { useMemo } from "react";
import NavigationRight from "../mini-chatbox/navigation/right/NavigationRight";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import Typography from "../../../../../components/Typography";
import ContactItem from "../../../../navigation/left/items/ContactItem";

export default function MembersList ({open}) {
    const target = useSelector(store => store.teleconference.target);
    const [{participants}] = useTeleconference();
    const members = useMemo(() => 
        target?.members?.map(({_id: user, role}) => ({
            ...user,
            name: `${user?.fname} ${user?.lname} ${user?.mname}`.trim(),
            role,
            id: user._id,
            avatarSrc: user.imageUrl,
            origin: user,
        })), 
    [target]);

    return (
    <NavigationRight
        anchor="right" 
        variant="persistent" 
        open={open}
    >   {participants?.length === 0 && 
        <Typography
            height="100%"
            width="100%"
            align="center"
            alignItems="center"
            justifyContent="center"
            display="flex"
        >Aucun participant</Typography>}
        <Lists>
            {participants?.map(({uid}) => (
                <ContactItem
                    {...members?.find(({id}) => uid === id) || []}
                />
            ))}
        </Lists>
    </NavigationRight>
    );
}