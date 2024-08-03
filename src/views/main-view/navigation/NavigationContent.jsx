import { Fade, Box } from "@mui/material";
import tabs from "./tabs";
import useNavTab from "../../../hooks/useNavTab";
import { createElement } from "react";

export default function NavigationContent() {
  const [{ navTabValue }] = useNavTab();

  return tabs.map(({ id, component }) => (
    <Fade key={id} unmountOnExit in={navTabValue === id}>
      <Box display='flex' flex={1} overflow='hidden' flexDirection='column'>
        {createElement(component)}
      </Box>
    </Fade>
  ));
}
