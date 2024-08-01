import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { setData } from "../../../redux/meeting";
import { useMemo } from "react";

export default function useCallChannel() {
  const [{ secretCode }] useLocalStoreData();
  const dispatch = useDispatch();

  const channel = useMemo(
    () => new BroadcastChannel(`_geid_call_window_${secretCode}`),
    [secretCode]
  );
  useEffect(() => {
    const onChangeMode = ({ data }) => {
      if (data?.type === "mode") {
        const { mode } = data;
        dispatch(
          setData({
            data: { mode },
          })
        );
      }
    };
    channel.addEventListener("message", onChangeMode);
    return () => {
      channel.removeEventListener("message", onChangeMode);
    };
  }, [secretCode, dispatch, channel]);
}
