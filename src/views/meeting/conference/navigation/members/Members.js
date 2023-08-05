import Box from '../../../../../components/Box';
import Header from "./Header";
import MemberItem from './MemberItem';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import CustomListItemsGroup from '../../../../../components/CustomListItemsGroup';
import { Divider, ListSubheader, Zoom } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import Typography from '../../../../../components/Typography';
import { escapeRegExp } from 'lodash';
import useGetClients from '../../actions/useGetClients';

export default function Members () {
    const members =  useGetClients(true);
    const [keyword, setKeyword] = useState('');

    const participants = useMemo(() => 
        filterObjectsByKeyword(members, keyword),
        [members, keyword]
    );

    const [actives, outsides] = useMemo(() => {
        const actives = participants.filter(({active}) => active);
        const outsides = participants.filter(({active}) => !active);
        return [actives, outsides];
    }, [participants])

    const {titles, counts} = useMemo(() => {
        const data = getTitlesAndCounts([], actives, outsides);
        const titles = data.map(({title}) => title);
        const counts = data.map(({count}) => count);
        return {titles, counts};
    }, [actives, outsides]);

    const groupContent = useCallback(index => {
        return (
            <ListSubheader
                sx={{
                    fontWeight: 'bold',
                    height: 50,
                    top: 0,
                    position: 'sticky',
                    display: 'flex',
                    flexDirection: 'row',
                    zIndex: 2,
                    background: theme => `linear-gradient(transparent 0%, ${theme.palette.background.default} 100%)`,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                }}
            >
                <div style={{flexGrow: 1}}>
                    {titles[index]}
                </div>
                <div>{counts[index]} / {counts.reduce((acc, curr) => acc + curr, 0)}</div>
        </ListSubheader>
        )
    }, [titles, counts]);
    const participantsMeeting = useMemo(() => [actives, outsides].flat(), [actives, outsides]);

    const itemContent = useCallback ((index) => {
        const member = participantsMeeting[index];
        const next = participantsMeeting[index + 1];
        const isDivisible = Boolean(next) && member?.active === next?.active;
        return (
            <div>
                <MemberItem
                    {...member}
                    type={member.key}
                />
                {isDivisible && 
                <Divider variant="inset" component="div" />}
            </div>
        )
    }, [participantsMeeting]);

    return (
        <Box
           sx={{
            bgcolor: 'background.default',
           }} 
        >
            <Header
                keyword={keyword}
                setKeyword={setKeyword}
            />
            {participantsMeeting?.length === 0 ?
            (
                <Zoom in>
                    <Typography
                        variant="body1"
                        display="flex"
                        flex={1}
                        color="text.secondary"
                        justifyContent="center"
                        alignItems="center"
                        align="center"
                    >
                        Désolé, nous n'avons trouvé aucun participant 
                        correspondant à votre recherche. 
                    </Typography>
                </Zoom>
            ): 
            (
                <CustomListItemsGroup
                    groupContent={groupContent}
                    groupCounts={counts}
                    itemContent={itemContent}
                />
            )}
        </Box>
    );
}

function getTitlesAndCounts(unknownObjects, foundObjects, notFoundObjects, findId) {
    const titlesAndCount = [
        {
            title: 'Participants invités',
            count: unknownObjects?.length,
            id: 'unknown'
        },
        {
            title: 'Participants actifs',
            count: foundObjects?.length,
            id: 'found',
        },
        {
            title:'Participants hors réunion',
            count: notFoundObjects?.length,
            id: 'notFound',
        }
    ];
    return titlesAndCount?.filter(({count, id}) => 
        Boolean(count) && (findId ? findId === id : true)
    );
}

function filterObjectsByKeyword(objects, keyword) {
    const regex = new RegExp(escapeRegExp(keyword), 'i');
    return objects.filter(obj => {
      const {fname, mname, lname, email} = obj || {};
      return regex.test(fname) || regex.test(mname) || regex.test(lname) || regex.test(email);
    });
  }
  

  