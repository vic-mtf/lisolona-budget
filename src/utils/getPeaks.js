export default function getPeaks(buffer, length) {
    const sampleSize = buffer.length / length;
    const sampleStep = Math.floor(sampleSize / 10) || 1;
    const channels = buffer.numberOfChannels;
    const peaks = new Float32Array(length);
    for (let c = 0; c < channels; c++) {
        let chan = buffer.getChannelData(c);
        for (let i = 0; i < length; i++) {
            let start = Math.floor(i * sampleSize);
            let end = Math.min(start + sampleSize, buffer.length);
            let peak = 0;
            for (let j = start; j < end; j += sampleStep) {
                let value = chan[j];
                if (value > peak) peak = value;
                else if (-value > peak) peak = -value;
            }
            if (c === 0 || Math.abs(peak) > peaks[i]) peaks[i] = peak;
        }
    }
    return peaks;
}