import { Box } from "@mui/material";

const App = () => {
  return (
    <div style={{ position: "relative", height: "600px", overflowY: "auto" }}>
      <Box
        sx={{
          backgroundColor: "red",
          height: 400,
          aspectRatio: 9 / 16,
        }}></Box>
    </div>
  );
};

export default App;
