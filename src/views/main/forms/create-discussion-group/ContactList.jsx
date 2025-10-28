import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Toolbar,
  AvatarGroup,
  ListSubheader,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import groupContact from '../../navigation/contacts/groupContacts';
import InputSearch from '../../../../components/InputSearch';
import VirtualizedList from '../../../../components/VirtualizedList';
import ContactItem from '../../navigation/contacts/ContactItem';
import ListAvatar from '../../../../components/ListAvatar';

const ContactList = ({ selectedContacts, setSelectedContacts }) => {
  const bulkContacts = useSelector((store) => store.data.app.contacts);
  const [search, setSearch] = useState('');
  const contacts = useMemo(
    () => groupContact(bulkContacts, search),
    [bulkContacts, search]
  );

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = contacts[index];
      const id = data?.id;
      const checked = selectedContacts?.some((contact) => contact?.id === id);

      const onChange = () => {
        const filteredContacts = checked
          ? selectedContacts.filter((contact) => contact.id !== id)
          : [data].concat(selectedContacts);
        setSelectedContacts(filteredContacts);
      };
      return (
        <div key={data?.id} style={style}>
          {data?.type === 'label' ? (
            <ListSubheader sx={{ height: '100%', background: 'none' }}>
              {data?.label}
            </ListSubheader>
          ) : (
            <ContactItem
              selected={checked}
              name={data?.name}
              image={data?.image}
              status={data?.status}
              id={id}
              email={data?.email}
              checkable
              onClick={onChange}
              divider={data?.alpKey === contacts[index - 1]?.alpKey}
              CheckboxProps={{ onChange, checked }}
              search={search}
            />
          )}
        </div>
      );
    },
    [contacts, selectedContacts, setSelectedContacts, search]
  );

  return (
    <>
      <Box pb={1} px={2}>
        <Toolbar variant="dense" disableGutters sx={{ gap: 1 }}>
          <Typography flexGrow={1}>Sélectionner vos collaborateurs</Typography>
          <AvatarGroup
            max={5}
            //variant='rounded'
            total={selectedContacts.length}
            sx={{
              '& .MuiAvatarGroup-avatar': {
                width: 30,
                height: 30,
                fontSize: 16,
              },
            }}
          >
            {selectedContacts.map(({ id, image, firstName }) => (
              <ListAvatar
                id={id}
                src={image}
                key={id}
                invisible
                alt={firstName.charAt(0)?.toUpperCase()}
              >
                {firstName.charAt(0)?.toUpperCase()}
              </ListAvatar>
            ))}
          </AvatarGroup>
        </Toolbar>
        <InputSearch
          placeholder="Recherche de contact"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
        />
      </Box>
      <VirtualizedList
        data={contacts}
        itemContent={itemContent}
        rowHeight={({ index }) => (contacts[index].type === 'label' ? 50 : 69)}
        emptyMessage="Aucun Contact trouvé"
      />
    </>
  );
};

ContactList.propTypes = {
  selectedContacts: PropTypes.array.isRequired,
  setSelectedContacts: PropTypes.func.isRequired,
};

export default ContactList;
