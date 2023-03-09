import { useState } from "react";
import IconButton from "../../../components/IconButton";
import { Tooltip } from "@mui/material";
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

export default function MembersButton () {
  const [turnOn, setTurnOn] = useState(false);

 return (
  <Tooltip
    arrow
    title="Afficher les membres de Lisanga"
  >
    <IconButton
        onClick={() => setTurnOn(turnOn => !turnOn)}
        sx={{mx: .5}}
        size="medium"
    >
      <GroupsOutlinedIcon/>
    </IconButton>
  </Tooltip>
 )
}