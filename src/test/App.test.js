
// import HomePage from "./HomePage";
// import TestEmoji from "./TestEmoji";
import  { VoiceTest } from "./VoiceTest";
import urlSrc from '../assets/Htc-blues.mp3';
import Dexie from "dexie";
import dbConfig from '../configs/database-config.json';
import store from "../redux/store";
import InputCode from "../components/InputCode";

export default function AppTest () {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
    <div>
      <InputCode
        values={[0, 1, 5, 6, 7, 8, 9]}
        length={9}
      />
    </div>
    </div>
  );
}