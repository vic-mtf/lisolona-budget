import  React, { useCallback } from 'react';
import {
    SpeedDialAction,
    Box as MuiBox
} from '@mui/material';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import CustomSpeedDial from '../../../../../components/CustomSpeedDial';
//import AttachFileIcon from '@mui/icons-material/AttachFile';
import options from './options';
import { uniqWith } from 'lodash';
import getFile from '../../../../../utils/getFile';

export default function AttachFile({setFiles}) {

  const handleClickAction = useCallback((accept='video/*, image/*') => async () => {
      const newFiles = await getFile({
        accept,
        multiple: true,
      });
      setFiles(files => 
        uniqWith(files.concat(
          [...newFiles].map((file, index) => ({
            File: file, 
            id: (Date.now() + files.length + index).toString(16).toLowerCase(),
          }) 
        )), 
      (a, b) =>
          a.File.name === b.File.name &&
          a.File.type === b.File.type &&
          a.File.size === b.File.size &&
          a.File.lastModified === b.File.lastModified
        )
      );
    }, [setFiles]);

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
          ariaLabel="Ajouter"
          icon={
          <SpeedDialIcon 
           // icon={<AttachFileIcon/>}
          />}
          direction="right"
          FabProps={{
            size: 'small',
            color: 'inherit',
            title: 'Ajouter',
            sx:{boxShadow: 0}
          }}
        >
          {options.map((option) => {
            const action = {...option};
            delete action.action;

            return (
              <SpeedDialAction
                key={option.tooltipTitle}
                {...action}
                arrow
                onClick={handleClickAction(option.accept)}
                FabProps={{
                  size: 'small',
                  sx: {right: 0, p: 0}
                }}
              />
          );
        })}
        </CustomSpeedDial>
    </MuiBox>
  );
}