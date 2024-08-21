import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Badge, Box, ListItemButton, Stack } from "@mui/material";
import PropTypes from "prop-types";
import AvatarDiscussion from "./AvatarDiscussion";
import formatDate from "../../../../utils/formatDate";
import MessageItemContent from "./MessageItemContent";

const DiscussionItem = React.memo(
  ({
    selected,
    name,
    image,
    type,
    message,
    status,
    id,
    updatedAt,
    news = 10,
    divider,
    createdAt,
    createdBy,
    ...otherProps
  }) => {
    return (
      <>
        <ListItemButton
          alignItems='flex-start'
          selected={selected}
          {...otherProps}>
          <ListItemAvatar>
            <AvatarDiscussion
              src={image}
              alt={name}
              id={id}
              status={status}
              invisible={type === "room"}>
              {name?.toUpperCase()?.charAt(0)}
            </AvatarDiscussion>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Stack direction='row' spacing={1}>
                <Typography
                  flexGrow={1}
                  textOverflow='ellipsis'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  fontWeight={550}>
                  {name}
                </Typography>
                <Typography
                  variant='caption'
                  component='div'
                  display='flex'
                  whiteSpace='nowrap'
                  justifyContent='end'>
                  {formatDate(updatedAt)}
                </Typography>
              </Stack>
            }
            secondary={
              <Stack direction='row' spacing={1}>
                <Typography
                  alignItems='center'
                  flexGrow={1}
                  textOverflow='ellipsis'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  variant='body2'>
                  <MessageItemContent message={message} id={id} type={type} />
                </Typography>
                <Badge
                  badgeContent={news}
                  color='primary'
                  sx={{
                    "& .MuiBadge-badge": {
                      right: 12,
                      top: 12,
                      // border: (theme) =>
                      //   `2px solid ${theme.palette.background.paper}`,
                      // padding: "0 4px",
                    },
                  }}>
                  <Box
                    minWidth={news ? 20 : 0}
                    height={20}
                    display='inline-block'
                  />
                </Badge>
              </Stack>
            }
            primaryTypographyProps={{ component: "div" }}
            secondaryTypographyProps={{ component: "div" }}
          />
        </ListItemButton>
        {divider && <Divider variant='inset' />}
      </>
    );
  }
);

DiscussionItem.displayName = "DiscussionItem";

DiscussionItem.propTypes = {
  selected: PropTypes.bool,
  src: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(["room", "direct"]),
  divider: PropTypes.bool,
  news: PropTypes.number,
  status: PropTypes.oneOf(["online", "offline", "away"]),
  invisible: PropTypes.bool,
  message: PropTypes.object,
  updatedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
};

// const DiscussionItem = React.memo(
//   forwardRef(
//     (
//       {
//         dataIndex,
//         src,
//         name,
//         id,
//         type,
//         news = 10,
//         divider,
//         message,
//         updatedAt,
//         status,
//         ...otherProps
//       },
//       ref
//     ) => {
//       return (
//         <div ref={ref} data-index={dataIndex}>
//           <ListItemButton alignItems='flex-start' {...otherProps}>
//             <ListItemAvatar>
//               <AvatarDiscussion
//                 src={src}
//                 alt={name}
//                 id={id}
//                 status={status}
//                 invisible={type === "room"}>
//                 {name?.toUpperCase()?.charAt(0)}
//               </AvatarDiscussion>
//             </ListItemAvatar>
//             <ListItemText
//               primary={
//                 <Stack direction='row' spacing={1}>
//                   <Typography
//                     flexGrow={1}
//                     textOverflow='ellipsis'
//                     whiteSpace='nowrap'
//                     overflow='hidden'
//                     fontWeight={550}>
//                     {name}
//                   </Typography>
//                   <Typography
//                     variant='caption'
//                     component='div'
//                     display='flex'
//                     justifyContent='end'>
//                     {formatDate(updatedAt)}
//                   </Typography>
//                 </Stack>
//               }
//               secondary={
//                 <Stack direction='row' spacing={1}>
//                   <Typography
//                     alignItems='center'
//                     flexGrow={1}
//                     textOverflow='ellipsis'
//                     whiteSpace='nowrap'
//                     overflow='hidden'
//                     variant='body2'>
//                     <MessageItemContent message={message} id={id} type={type} />
//                   </Typography>
//                   <Badge
//                     badgeContent={news}
//                     color='primary'
//                     sx={{
//                       "& .MuiBadge-badge": {
//                         right: 12,
//                         top: 12,
//                         // border: (theme) =>
//                         //   `2px solid ${theme.palette.background.paper}`,
//                         // padding: "0 4px",
//                       },
//                     }}>
//                     <Box
//                       minWidth={news ? 20 : 0}
//                       height={20}
//                       display='inline-block'
//                     />
//                   </Badge>
//                 </Stack>
//               }
//               primaryTypographyProps={{ component: "div" }}
//               secondaryTypographyProps={{ component: "div" }}
//             />
//           </ListItemButton>
//           {divider && <Divider variant='inset' />}
//         </div>
//       );
//     }
//   )
// );

export default DiscussionItem;
