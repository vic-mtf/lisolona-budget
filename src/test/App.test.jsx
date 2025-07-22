import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useState } from "react";
import song from "../assets/incoming_call.mp3";
import WaveformPreview from "./WaveformPreview";
import LiveWaveformRecorder from "../components/LiveWaveformRecorder";
import VoiceRecorder from "./VoiceRecorder";
import LiveWaveformTest from "./LiveWaveformTest";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`test-tabpanel-${index}`}
      aria-labelledby={`test-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const App = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflowY: "auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label='test tabs'>
          <Tab label='🎤 Enregistreur Simple' />
          <Tab label='🎵 Waveform Amélioré' />
          <Tab label='📊 Waveform Preview' />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <VoiceRecorder />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <LiveWaveformTest />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <WaveformPreview />
      </TabPanel>
    </div>
  );
};

export default App;
