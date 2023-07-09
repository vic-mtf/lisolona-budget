import React from 'react';
import { Fab } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';

const FabButton = ({ newMessagesCount }) => {
  const handleClick = () => {
    // Gérer le défilement vers le bas ici
  };

  return (
    <Fab onClick={handleClick} color="primary">
      <ArrowDownward />
      {newMessagesCount > 0 && <span>{newMessagesCount}</span>}
    </Fab>
  );
};

export default FabButton;
