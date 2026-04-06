import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useDispatch } from "react-redux";
import { updateConferenceData } from "@/redux/conference/conference";
import InputSearch from "@/components/InputSearch";
import FilterCategoryButtons from "./FilterCategoryButtons";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import store from "@/redux/store";

const ParticipantsHeader = ({
  category,
  setCategory,
  handRaisedCount,
  waitingCount,
}) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      raiseHand: handRaisedCount,
      waiting: waitingCount,
    }),
    [handRaisedCount, waitingCount]
  );

  useEffect(() => {
    if (store.getState().conference.meeting.actions.search !== search)
      dispatch(
        updateConferenceData({
          key: ["meeting.actions.search"],
          data: [search],
        })
      );
  }, [dispatch, search]);

  return (
    <Box>
      <Toolbar sx={{ gap: 2, px: 1 }}>
        <IconButton
          edge='start'
          onClick={() =>
            dispatch(
              updateConferenceData({
                key: ["meeting.nav.open"],
                data: [false],
              })
            )
          }>
          <CloseOutlinedIcon />
        </IconButton>
        <Typography variant='h6' fontSize={18}>
          Participants
        </Typography>
      </Toolbar>
      <Box
        display='flex'
        flex='row'
        px={1}
        gap={2}
        justifyContent='center'
        alignItems='center'>
        <InputSearch
          placeholder='Recherche un participant'
          sx={{ flexGrow: 1 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Box>
        <FilterCategoryButtons
          category={category}
          setCategory={setCategory}
          counts={counts}
        />
      </Box>
    </Box>
  );
};

export default ParticipantsHeader;
