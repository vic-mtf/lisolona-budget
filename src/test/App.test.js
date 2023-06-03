
import HomePage from "./HomePage";
import TestEmoji from "./TestEmoji";
import AudioRecorder from "./VoiceTest";

export default function AppTest () {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <AudioRecorder/>
    </div>
  );
}