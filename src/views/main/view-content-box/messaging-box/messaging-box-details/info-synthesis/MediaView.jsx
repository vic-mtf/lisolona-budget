import React, { useMemo } from "react";
import {
  Box,
  CardActionArea,
  ImageList,
  ImageListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import Stack from "@mui/material/Stack";
import useMessagingContext from "../../../../../../hooks/useMessagingContext";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";

const MediaView = React.memo(() => {
  const [{ user }] = useMessagingContext();
  const [getData] = useLocalStoreData();
  const bulkMedias = useSelector((store) =>
    store.data.app.messages[user?.id]?.filter(({ type }) => type === "media")
  );

  const medias = useMemo(() => {
    const downloads = getData("app.downloads");
    const uploads = getData("app.uploads");
    const files = {};

    Object.keys(downloads).forEach((key) => {
      Object.keys(downloads[key]).forEach((k) => {
        const download = downloads[key][k];
        const upload = uploads[key][k];
        if (files[k] === undefined) {
          if (download !== undefined) files[k] = download;
          if (upload !== undefined) files[k] = upload;
        }
      });
    });

    return bulkMedias?.map((d) => {
      const file = files[d?.clientId || d?.id];
      const src = new URL(d?.content, import.meta.env.VITE_SERVER_BASE_URL);
      const url = file?.src || src;
      return { ...d, url };
    });
  }, [bulkMedias, getData]);

  return (
    <Box position='relative'>
      <Stack>
        <ListItemButton>
          <ListItemText
            primary='Medias & Documents'
            slotProps={{ primary: { color: "text.secondary" } }}
          />
          <ListItemIcon sx={{ justifyContent: "end" }}>
            <Typography
              component='span'
              px={2}
              color='text.secondary'
              display='flex'
              alignItems='center'>
              {medias?.length || 0}
            </Typography>
            <NavigateNextOutlinedIcon />
          </ListItemIcon>
        </ListItemButton>
        {medias?.length > 0 && (
          <Box px={2}>
            <ImageList sx={{ m: 0, p: 0, mt: 1 }} cols={4}>
              {medias?.slice(0, 4)?.map(({ id, clientId, subType, url }) => {
                const props =
                  subType === "IMAGE"
                    ? { srcSet: url, src: url, loading: "lazy" }
                    : { preload: "metadata", muted: true };

                return (
                  <ImageListItem
                    key={clientId || id}
                    sx={{
                      bgcolor: (theme) => theme.palette.divider,
                      borderRadius: (theme) => theme.shape.borderRadius / 4,
                      aspectRatio: 1,
                      position: "relative",
                      overflow: "hidden",
                    }}>
                    <CardActionArea
                      sx={{
                        width: "100%",
                        aspectRatio: 1,
                        borderRadius: (theme) => theme.shape.borderRadius / 16,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "10%",
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, " +
                            "rgba(0,0,0,0) 100%)",
                          zIndex: 1,
                        },
                      }}>
                      <Box
                        component={subType === "IMAGE" ? "img" : "video"}
                        src={url}
                        {...props}
                        sx={{
                          objectFit: "cover",
                          width: "100%",
                          aspectRatio: 1,
                          // borderRadius: (theme) => theme.shape.borderRadius / 8,
                        }}
                      />
                    </CardActionArea>
                  </ImageListItem>
                );
              })}
            </ImageList>
          </Box>
        )}
      </Stack>
    </Box>
  );
});

MediaView.displayName = "MediaView";

export default MediaView;
