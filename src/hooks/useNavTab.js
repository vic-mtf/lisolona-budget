import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";

export default function useNavTab() {
  const { state } = useLocation();
  const navigateTo = useNavigate();

  const navTabValue = useMemo(
    () => state?.navTab?.value || "chats",
    [state?.navTab?.value]
  );
  const onChangeTabNav = useCallback(
    (event, value) => {
      event?.preventDefault();
      navigateTo("", { state: { navTab: { value } } });
    },
    [navigateTo]
  );

  return [{ navTabValue }, { onChangeTabNav }];
}
