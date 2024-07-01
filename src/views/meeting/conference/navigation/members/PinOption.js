import { useLayoutEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import IconButton from "../../../../../components/IconButton";
// import CustomZoom from "../../../../../components/CustomZoom";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";

export default function PinOption({ pined, onPin, rootRef }) {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef?.current;
    const onMouseEnter = () => {
      if (!show) setShow(true);
    };
    const onMouseLeave = () => {
      if (show) setShow(false);
    };
    root?.addEventListener("mouseenter", onMouseEnter);
    root?.addEventListener("mouseleave", onMouseLeave);
    return () => {
      root?.removeEventListener("mouseenter", onMouseEnter);
      root?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [rootRef, show]);

  return (
    <Tooltip
      title={
        pined ? "Retirer sur la présentation" : "Mettre sur la présentation"
      }
      arrow>
      <div>
        <IconButton onClick={onPin} selected={pined}>
          {pined ? (
            <CancelPresentationOutlinedIcon />
          ) : (
            <CoPresentOutlinedIcon />
          )}
        </IconButton>
      </div>
    </Tooltip>
  );
}
