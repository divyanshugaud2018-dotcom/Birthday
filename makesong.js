// Run with: node makesong.js
// Generates happy_birthday.wav in the same folder

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const BPM = 100;
const BEAT = 60 / BPM;

const NOTES = {
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25,
  F5: 698.46, G5: 783.99
};

// Happy Birthday melody: [note, beats]
const MELODY = [
  ['G4',0.75],['G4',0.25],['A4',1],['G4',1],['C5',1],['B4',2],
  ['G4',0.75],['G4',0.25],['A4',1],['G4',1],['D5',1],['C5',2],
  ['G4',0.75],['G4',0.25],['G5',1],['E5',1],['C5',1],['B4',1],['A4',2],
  ['F5',0.75],['F5',0.25],['E5',1],['C5',1],['D5',1],['C5',3]
];

// Total samples needed
let totalSamples = 0;
MELODY.forEach(([,b]) => totalSamples += Math.ceil(b * BEAT * SAMPLE_RATE));

const samples = new Float32Array(totalSamples + SAMPLE_RATE); // +1s tail

let offset = 0;
MELODY.forEach(([note, beats]) => {
  const freq = NOTES[note];
  const noteSamples = Math.ceil(beats * BEAT * SAMPLE_RATE);
  const attackSamples = Math.floor(SAMPLE_RATE * 0.02);
  const releaseSamples = Math.floor(SAMPLE_RATE * 0.08);

  for (let i = 0; i < noteSamples; i++) {
    let env = 1;
    if (i < attackSamples) env = i / attackSamples;
    else if (i > noteSamples - releaseSamples) env = (noteSamples - i) / releaseSamples;

    // Sine + small harmonic for warmth
    const t = (offset + i) / SAMPLE_RATE;
    samples[offset + i] = env * 0.5 * (
      0.7 * Math.sin(2 * Math.PI * freq * t) +
      0.2 * Math.sin(2 * Math.PI * freq * 2 * t) +
      0.1 * Math.sin(2 * Math.PI * freq * 3 * t)
    );
  }
  offset += noteSamples;
});

// Convert Float32 to Int16
const pcm = Buffer.alloc(samples.length * 2);
for (let i = 0; i < samples.length; i++) {
  const s = Math.max(-1, Math.min(1, samples[i]));
  pcm.writeInt16LE(Math.round(s * 32767), i * 2);
}

// Build WAV
function wav(pcmData, sampleRate, channels) {
  const dataSize = pcmData.length;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);          // PCM
  buf.writeUInt16LE(channels, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * channels * 2, 28);
  buf.writeUInt16LE(channels * 2, 32);
  buf.writeUInt16LE(16, 34);         // 16-bit
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  pcmData.copy(buf, 44);
  return buf;
}

const wavBuf = wav(pcm, SAMPLE_RATE, 1);
const outPath = path.join(__dirname, 'happy_birthday.wav');
fs.writeFileSync(outPath, wavBuf);
console.log('Created:', outPath, Math.round(wavBuf.length/1024) + 'KB');
