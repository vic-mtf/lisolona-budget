import React, { useContext } from "react";
import { MessagingContext } from "../../MessagingBoxProvider";
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
import { Stack } from "@mui/system";

const MediaView = React.memo(() => {
  const [{ user }] = useContext(MessagingContext);
  // const localUser = useMemo(() => store.getState().user, []);
  const medias = useSelector((store) =>
    store.data.app.messages[user?.id]?.filter(({ type }) => type === "media")
  );

  return (
    <Box position='relative'>
      <Stack>
        <ListItemButton>
          <ListItemText
            primary='Medias & Documents'
            primaryTypographyProps={{ color: "text.secondary" }}
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
              {medias?.slice(0, 4)?.map(({ id, content, subType }) => {
                const url = new URL(
                  content,
                  import.meta.env.VITE_SERVER_BASE_URL
                );
                const props =
                  subType === "IMAGE"
                    ? { srcSet: url, src: url, loading: "lazy" }
                    : { preload: "metadata", muted: true };

                return (
                  <ImageListItem
                    key={id}
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
