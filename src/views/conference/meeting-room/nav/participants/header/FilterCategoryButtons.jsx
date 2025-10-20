import Box from '@mui/material/Box';
import filterCategory from './filterCategory';
import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Badge } from '@mui/material';

const FilterCategoryButtons = ({ category, setCategory, counts }) => {
  const isOrganizer = useSelector(
    (store) =>
      store.conference.meeting.participants[store.user.id].state.isOrganizer
  );

  return (
    <Box gap={1} display="flex" flexDirection="row" p={1} pb={1.5}>
      {filterCategory
        .filter(({ id }) => (isOrganizer ? true : id !== 'waiting'))
        .map(({ id, label, disabled }) => (
          <Badge
            key={id}
            color="primary"
            badgeContent={counts[id] || 0}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: 10,
                top: 15,
                right: 0,
                border: (t) =>
                  `2px solid ${(t.vars ?? t).palette.background.paper}`,
                padding: '0 4px',
              },
            }}
          >
            <Chip
              label={label}
              color={category === id ? 'primary' : 'default'}
              onClick={() =>
                setCategory((currentId) => (currentId === id ? null : id))
              }
              disabled={disabled}
            />
          </Badge>
        ))}
    </Box>
  );
};

FilterCategoryButtons.propTypes = {
  category: PropTypes.string,
  setCategory: PropTypes.func.isRequired,
  counts: PropTypes.object,
};

export default FilterCategoryButtons;
