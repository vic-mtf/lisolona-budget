import Box from '@mui/material/Box';
import filterCategory from './filterCategory';
import Chip from '@mui/material/Chip';
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
                fontSize: 9,
                top: 6,
                right: 4,
                border: (t) =>
                  `2px solid ${(t.vars ?? t).palette.background.paper}`,
                padding: '0 2px',
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

export default FilterCategoryButtons;
