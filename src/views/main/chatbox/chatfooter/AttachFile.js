import * as React from 'react';
import {
    SpeedDialAction,
    Box as MuiBox
} from '@mui/material';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import CustomSpeedDial from '../../../../components/CustomSpeedDial';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

const actions = [
  { icon: <PhotoCameraOutlinedIcon fontSize="small"  />, name: 'Photos' },
  { icon: <SlideshowOutlinedIcon  fontSize="small" />, name: 'Vidéos' },
  { icon: <ArticleOutlinedIcon fontSize="small"  />, name: 'Documents' },
  { icon: <InsertDriveFileOutlinedIcon fontSize="small"  />, name: 'Autre type de documents' },
];

export default function AttachFile() {

  return (
    <MuiBox
          position="relative"
          width={25}
          height={35}
          display="flex"
          justifyContent="center"
          alignItems="center"
    >
        <CustomSpeedDial
          ariaLabel="Joindre un document"
          icon={<SpeedDialIcon fontSize="5px" />}
          direction="right"
          FabProps={{
            size: 'small',
            color: 'inherit',
            title: 'Joindre un document',
            sx:{
                boxShadow: 0,
            }
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              arrow
              FabProps={{
                size: 'small',
                sx: { right: 0, p:0,}
              }}
            />
          ))}
        </CustomSpeedDial>
    </MuiBox>
  );
}