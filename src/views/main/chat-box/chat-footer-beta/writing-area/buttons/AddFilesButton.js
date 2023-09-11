import React, { useCallback } from 'react';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import IconButton from '../../../../../../components/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { modifyData } from '../../../../../../redux/data';
import fileExtensionBase from '../../../../../../utils/fileExtensionBase';
import getFile from '../../../../../../utils/getFile';
import { uniqWith } from 'lodash';





export default function AddFilesButton ({filesRef}) {
    const files = useSelector(store => store.data.chatBox.footer.files);
    const dispatch = useDispatch();
    const setFiles = useCallback((callback) => {
        if(filesRef && Object.keys(filesRef)[0] === 'current') {
            const files = filesRef.current;
            const newFiles = typeof callback === 'function' ? callback(files) : files;
            filesRef.current = newFiles;
             dispatch(
                modifyData({
                    data: newFiles.map(({id}) => id),
                    key: 'chatBox.footer.files',
                })
            )
        }
    }, [filesRef, dispatch]);

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
        <IconButton
            value=""
            size="small"
            selected={files.length > 0}
            color="primary"
            onClick={handleClickAction(acceptExtension)}
            sx={{
                '& .icon': {
                    transform: 'rotate(-45deg)',
                    transition: '.2s transform'
                },
                '&:hover': {
                    '& .icon': {
                        transform: 'rotate(0deg)',
                    }
                }
            }}
        >
            <AttachFileOutlinedIcon fontSize="small" className="icon"/>
        </IconButton>
    );
}

const acceptExtension = fileExtensionBase.map(({exts}) => exts)
.flat()
.map(ext => `.${ext}`)
.join(',');