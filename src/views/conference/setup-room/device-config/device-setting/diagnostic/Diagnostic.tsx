import Box from "@mui/material/Box";
import MemoryProcesses from "./MemoryProcesses";
import NetworkDiagnostic from "./NetworkDiagnostic";
import scrollBarSx from "../../../../../../utils/scrollBarSx";

const Diagnostic = () => {
  return (
    <Box
      display='flex'
      flex={1}
      overflow='hidden'
      sx={{ overflowY: "auto", ...scrollBarSx }}
      flexDirection='column'>
      <NetworkDiagnostic />
      <MemoryProcesses />
    </Box>
  );
};

export default Diagnostic;
