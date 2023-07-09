import { useEffect, useState } from "react";

export default function useFrequencyDataAudio(analyser, HEIGHT, WIDTH) {
    const [audioData, setAudioData] = useState([]);
    useEffect(() => {
        let requestAnimation;
        let handleGetData;
        if(analyser)
            (handleGetData = () => {
                const data = [];
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                const sliceWidth = WIDTH / bufferLength;
                analyser.getByteFrequencyData(dataArray);
                //analyser.getByteTimeDomainData(dataArray);
                const barWidth = (WIDTH / bufferLength) * 2.5;
                let barHeight;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 2;
                    data.push([x, HEIGHT - barHeight / 2, barWidth, barHeight]);
                    x += barWidth + 1;
                }
                if(JSON.stringify(audioData) !== JSON.stringify(data))
                    setAudioData(data);
                requestAnimation = 
                window.requestAnimationFrame(handleGetData);
            })();
        return () => {
            window.cancelAnimationFrame(requestAnimation);
        }
    }, [analyser, HEIGHT, audioData, WIDTH])
    return audioData;
}