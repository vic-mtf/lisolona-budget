import { useEffect } from "react";
import { useData } from "../../../utils/DataProvider";
import { useDispatch } from "react-redux";
import { setData } from "../../../redux/meeting";
import { useMemo } from "react";

export default function useCallChannel () {
    const [{secretCodeRef}] = useData();
    const dispatch = useDispatch();

    const channel = useMemo(() => 
        new BroadcastChannel(`_geid_call_window_${secretCodeRef.current}`),
        [secretCodeRef]
    );
    useEffect(() => {
        const onChangeMode = ({data}) => {
            if(data?.type === 'mode') {
                const { mode } = data;
                dispatch(setData({
                    data: { mode }
                }));
            }
        };
        channel.addEventListener('message', onChangeMode);
        return () => {
            channel.removeEventListener('message', onChangeMode);
        }
    },[secretCodeRef, dispatch, channel]);
}