import { Avatar, } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useData } from "../utils/DataProvider";
import AgoraRTC from "agora-rtc-sdk-ng";
import React from 'react';
import { AudioVisualizer } from "./VoiceTest";
const APP_ID = "9862b79e43aa45c9aaa10097085988b0";
const TOKEN = "007eJxTYFDeecd7cnX59Ne1L9zjT7imCd863lq+wsng5xU+w47aKC8FBksLM6Mkc8tUE+PERBPTZMvExERDAwNLcwMLU0sLiySDrmOLUhoCGRmWmwszMjJAIIjPxpCTWZyfk8/AAACmgyAK";
const CHANNEL = 'lisolo';

export default function AgoraTest () {
    const [{videoStreamRef, audioStreamRef, client}] = useData();
    const [participants, setParticipants] = useState([]);
    const [streams, setStreams] = useState([]);
    const [videoActive, setVideoActive] = useState(false);
    const [audioActive, setAudioActive] = useState(false);
    const [join, setJoin] = useState(false);
    const inputRef = useRef();
    const videoRef = useRef();
    const rootRef = useRef();

    const toggleStream = (stream, state, setState) => {
      const tracks = stream.getTracks();
      const [track] = tracks;
      const toggleState = !state;
      track.enabled = toggleState;
      setState(toggleState);
    }

    const handleJoin = async () => {
      if(inputRef.current.value) {
        const id = parseInt(inputRef.current.value);
        try {
          await client.join(APP_ID,CHANNEL, TOKEN, id);
        } catch (e) {
        }
        setJoin(true);
        if((audioActive && audioStreamRef.current) || true) {
          const audioTracks = audioStreamRef.current?.getAudioTracks();
          const [mediaStreamTrack] = audioTracks;
          const track = AgoraRTC.createCustomAudioTrack({ mediaStreamTrack });
          track.tag = 'test de mon app audio'
          streams.push(
            track
          );
      }
      if((videoActive && videoStreamRef.current) || true) {
          const videoTracks = videoStreamRef.current.getVideoTracks();
          const [mediaStreamTrack] = videoTracks;
          const track = AgoraRTC.createCustomVideoTrack({ mediaStreamTrack });
          track.tag = 'test de mon app video'
          streams.push(track);
      }
      if(streams.length)
        try {
          await client.publish(streams)
        } catch(e) {
        }
      } else {
        alert("Il n'y a pas de ID")
      }
    };

    useEffect(() => {
      navigator.mediaDevices.getUserMedia({
        video: true,
      }).then(stream => {
        videoStreamRef.current = stream;
        videoRef.current.srcObject = videoStreamRef.current;
        setVideoActive(true);
      });
      navigator.mediaDevices.getUserMedia({
        audio: true,
      }).then(stream => {
        audioStreamRef.current = stream;
        setAudioActive(true);
      });
    }, [audioStreamRef, videoStreamRef]);

    useEffect(() => {
 
      const onUserPiblished =  async (user, mediaType) => {
        const stream = await client.subscribe(user, mediaType);
        const userId = user.uid;
        setParticipants(participants => {
          const index = participants.findIndex(participant => participant.id === userId);
          const members = [...participants];
          const streamKey = mediaType + 'Stream';
          const dataKey = mediaType + 'Track';
          const track = user[dataKey];
      
          if(index !== -1) 
            members[index] = {
              ...members[index], 
              [streamKey]: stream,
              [dataKey]: user[dataKey]
            };
          else members.push({
            id: userId,
            [streamKey]: stream,
            [dataKey]: user[dataKey]
          });
          return members;
        });
      }

      const onUserUnPiblished = async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        // console.log(user, mediaType);
        const userId = user.uid;
        setParticipants(participants => {
          const index = participants.findIndex(participant => participant.id === userId);
          const members = [...participants];
          const key = mediaType + 'Track';
          if(index !== -1) 
            members[index] = {...members[index], [key]: null};
          return members;
        });
      };

      client.on('user-mute-audio', (user) => {
        console.log(user.uid);
      }
      );
      client.on('user-unmute-audio', (user) => {
        console.log(user.uid);
      });
      client.on('user-published', onUserPiblished);
      client.on('user-unpublished', onUserUnPiblished);

     return () => {
      client.off('user-published', onUserPiblished);
      client.off('user-unpublished', onUserUnPiblished);
     }
    },[client]);

    useEffect(() => {
      console.log(participants);
    },[participants])

   return (
    <div>
       <div>
        <div>me:</div>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          style={{
            height: 250
          }}
        />
        {!join &&
        <div>
          <input 
            ref={inputRef} 
            type="number" 
            min="0" 
            placeholder="user ID"
          />
        </div>}

        <div>
          <button
            children={`Video ${videoActive ? 'on' : 'off'}`}
            onClick={() => toggleStream(videoStreamRef.current, videoActive, setVideoActive)}
          />
          <button
            children={`Audio ${audioActive ? 'on' : 'off'}`}
            onClick={() => toggleStream(audioStreamRef.current, audioActive, setAudioActive)}
          />
          {join ?  
          <button
            children="Quit"
            onClick={() =>{ 
              client.leave().then(() => 
              setParticipants([]));
              setJoin(false);
          }}
          />:
          <button
            children="Join"
            onClick={handleJoin}
          />
          }
        </div>
       </div>
       <div>
          others:
          <div>
            {
              participants.map((participant) => (
                <Participant
                    key={participant.id}
                    {...participant}
                />
              ))
            }
          </div>
       </div>
    </div>
   )
}

const Participant = ({id, audioStream, videoStream, audioTrack, videoTrack}) => {
  const videoRef = useRef();
  const [{client}] = useData();
  useEffect(() => {
    // videoTrack?.play(videoRef.current);
    const stream = audioTrack?._originMediaStreamTrack
    console.log(audioTrack?._originMediaStreamTrack)
    if(stream) {
      stream.onmute = (event) => {
        console.log(event.target.muted)
      }
      stream.onunmute = (event) => {
        console.log(event.target.muted)
      }
    }
 
  },[videoTrack, audioTrack]);
 

  return (
    <div>
        {/* {videoTrack &&
        <video 
          ref={videoRef}
          muted
          autoPlay
        />} */}
      {audioTrack && 
      <div style={{height: 500, width: 500, background: 'white' }}>
        <AudioVisualizer
          // analyser={analyser}
          audioTrack={audioTrack}
          maxSize={500}
          size={300}
        />
      </div>}
    </div>
  )
}


const AudioWave = ({ audioTrack }) => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const level = audioTrack.getVolumeLevel();
      setVolume(level);
    }, 100);

    return () => clearInterval(intervalId);
  }, [audioTrack]);

  const waveHeight = `${volume * 100}%`;

  return (
    <svg viewBox="0 0 100 100" width="200" height="200">
      <rect x="0" y="0" width="100" height="100" fill="#eee" />
      <rect x="0" y={waveHeight} width="100" height="100" fill="#00f">
        <animate
          attributeName="height"
          begin="0s"
          dur="1s"
          values={`${waveHeight};0;${waveHeight}`}
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
};
