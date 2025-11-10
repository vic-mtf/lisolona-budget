import ToggleButton from '@mui/material/ToggleButton';
import FlipToBackOutlinedIcon from '@mui/icons-material/FlipToBackOutlined';
import FlipToFrontOutlinedIcon from '@mui/icons-material/FlipToFrontOutlined';
import Box from '@mui/material/Box';
//import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import { useState, useCallback } from 'react';
import {} from 'react';
import { EVENT_NAMES } from '../../annotationStyles';
import Chip from '@mui/material/Chip';
import RootToggleButtonGroup from './RootToggleButtonGroup';
import useLocalStoreData from '../../../../../../../../../hooks/useLocalStoreData';

const FlipZIndexButtons = ({ shapeNode }) => {
  const [getData] = useLocalStoreData(
    'conference.meeting.actions.localPresentation.annotation.stage'
  );
  const [maxValue] = useState(() => getData('shapes')?.length);

  const [index, setIndex] = useState(() => {
    if (!shapeNode) return 0;
    return getData('shapes').findIndex((s) => s?.data?.id === shapeNode?.id());
  });

  const handleToggle = useCallback(
    (dir = 1) =>
      () => {
        if (!shapeNode) return;
        const name = EVENT_NAMES.updateTool;
        const customEvent = new CustomEvent(name, {
          detail: { index, dir, type: 'flipZIndex' },
        });
        window.dispatchEvent(customEvent);
        setIndex((i) => Math.min(Math.max(i + dir, 0), maxValue));
      },
    [shapeNode, maxValue, index]
  );

  return (
    <RootToggleButtonGroup size="small">
      <Tooltip title="Retourner à l'arrière" placement="top">
        <div>
          <ToggleButton
            value="back"
            aria-label="back"
            disabled={index === 0}
            onClick={handleToggle(-1)}
          >
            <FlipToBackOutlinedIcon fontSize="small" />
          </ToggleButton>
        </div>
      </Tooltip>
      <Tooltip title="Retourner vers l'avant" placement="top">
        <div>
          <ToggleButton
            onClick={handleToggle(1)}
            value="front"
            aria-label="front"
            disabled={index + 1 === maxValue}
          >
            <FlipToFrontOutlinedIcon fontSize="small" />
          </ToggleButton>
        </div>
      </Tooltip>
      <Tooltip title="Position" placement="top">
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Chip label={index + 1} size="small" variant="outlined" />
        </Box>
      </Tooltip>
    </RootToggleButtonGroup>
  );
};

FlipZIndexButtons.propTypes = {
  shapeNode: PropTypes.object,
};

export default FlipZIndexButtons;
