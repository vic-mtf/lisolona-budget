import  React, { useCallback } from 'react';
import {
    Tooltip
} from '@mui/material';
import { uniqWith } from 'lodash';
import getFile from '../../../../../utils/getFile';
import IconButton from '../../../../../components/IconButton';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import fileExtensionBase from '../../../../../utils/fileExtensionBase';

const docExts = [];
fileExtensionBase.forEach(item => {
  docExts.push(...item.exts);
});
const acceptExtension = docExts.map(ext => `.${ext}`).join(',')

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
    <Tooltip title="Attacher un fichier" arrow>
        <div>
            <IconButton
              sx={{
                transform: 'rotate(-45deg)',
                transition: '200ms transform',
                "&:hover": {
                  transform: 'rotate(0)',
                }
              }}
              onClick={() => handleClickAction(acceptExtension)()}
            >
                <AttachFileOutlinedIcon fontSize="small"/>
            </IconButton>
        </div>
    </Tooltip>
  );
}