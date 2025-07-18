import { Box } from "@mui/material";
import WaveLoader from "../components/WaveLoader";

const App = () => {
  return (
    <div style={{ position: "relative", height: "600px", overflowY: "auto" }}>
      <Box
        sx={{
          height: 400,
        }}>
        <div>
          <WaveLoader />
        </div>
      </Box>
    </div>
  );
};

export default App;
