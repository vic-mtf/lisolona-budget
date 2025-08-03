import { useMemo } from "react";
import CopyLinkButton from "../../../../components/CopyLinkButton";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useCallback } from "react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PropTypes from "prop-types";

export default function ScheduledActionButtonItem({
  code,
  title,
  description,
  name,
}) {
  const url = useMemo(
    () => `${window.location.toString()}?code=${code}`,
    [code]
  );

  const handlerSharingLink = useCallback(async () => {
    try {
      await navigator.share({
        url,
        title: name || title,
        text: description,
      });
    } catch (e) {
      console.error(e);
    }
  }, [title, description, name, url]);

  return (
    <CopyLinkButton
      text={description}
      url={url}
      title={title || name}
      render={({ copied, handleCopyLink }) => (
        <Tooltip
          title={
            navigator.share ? "Partager le lien" : copied ? "Copié" : "Copier"
          }>
          <IconButton
            onClick={navigator.share ? handlerSharingLink : handleCopyLink}
            edge='end'>
            {navigator.share ? (
              <ShareOutlinedIcon />
            ) : copied ? (
              <CheckOutlinedIcon />
            ) : (
              <ContentCopyOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
      )}
    />
  );
}

ScheduledActionButtonItem.propTypes = {
  code: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
};
