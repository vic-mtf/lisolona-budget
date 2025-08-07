import { Box } from "@mui/material";
import MemoryProcesses from "./MemoryProcesses";

const Diagnostic = () => {
  return (
    <Box
      display='flex'
      flex={1}
      overflow='hidden'
      sx={{ overflowY: "auto", p: 2 }}
      flexDirection='column'>
      <MemoryProcesses />
    </Box>
  );
};

export default Diagnostic;
