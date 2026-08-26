import { DEMO_MELODY } from './demo-data.js';

const NOTE_FREQS = {
  "G2": 98.00, "B2": 123.47, "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.00, "A3": 220.00,
  "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "B4": 493.88,
  "C5": 523.25, "D5": 587.33, "E5": 659.25
};

export class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.audioElement = new Audio();
    this.audioSource = null;
    this.gainNode = null;
    
    this.isPlaying = false;
    this._currentTime = 0; // Backing field for demo mode
    this.duration = 32; // Default demo duration is 32 seconds
    this.isDemo = true;
    
    // Audio analysis data for waveform rendering
    this.decodedBuffer = null;
    this.waveformPeaks = [];
    
    // Synth state
    this.synthInterval = null;
    this.lastScheduledNoteIndex = -1;
    this.playbackStartTime = 0;
    this.pauseOffset = 0;
    
    // Callbacks
    this.onTimeUpdateCallback = null;
    this.onEndCallback = null;
    
    // Set up standard audio element events
    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.isDemo && this.isPlaying) {
        // No longer needed for primary sync (getter reads live), but keep for callback
        if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(this.audioElement.currentTime);
      }
    });
    
    this.audioElement.addEventListener('ended', () => {
      if (!this.isDemo) {
        this.isPlaying = false;
        if (this.onEndCallback) this.onEndCallback();
      }
    });
    
    // Generate initial peaks for demo
    this.generateDemoWaveform();
  }

  // currentTime getter: for user audio, always returns live audioElement.currentTime
  // so the 60fps animation loop reads accurate time instead of stale timeupdate value
  get currentTime() {
    if (!this.isDemo && this.audioElement && this.audioElement.src) {
      return this.audioElement.currentTime;
    }
    return this._currentTime;
  }

  set currentTime(val) {
    this._currentTime = val;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadUserAudio(file) {
    this.isDemo = false;
    this.isPlaying = false;
    this.pauseOffset = 0;
    
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    
    const url = URL.createObjectURL(file);
    this.audioElement.src = url;
    this.audioElement.preload = 'auto';
    this.audioElement.load();
    
    // Read and decode for waveform
    const reader = new FileReader();
    reader.onload = async (e) => {
      this.initAudioContext();
      try {
        const buffer = e.target.result;
        // Decode copy of array buffer
        this.audioCtx.decodeAudioData(buffer.slice(0), (audioBuffer) => {
          this.decodedBuffer = audioBuffer;
          this.duration = audioBuffer.duration;
          this.extractPeaks(audioBuffer);
          if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(0);
        });
      } catch (err) {
        console.error("Error decoding audio data for waveform", err);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  loadDemo() {
    this.isDemo = true;
    this.isPlaying = false;
    this.duration = 32; // Demo song duration is 32 seconds
    this.currentTime = 0;
    this.pauseOffset = 0;
    this.audioElement.src = '';
    this.decodedBuffer = null;
    this.generateDemoWaveform();
    if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(0);
  }

  extractPeaks(audioBuffer) {
    const channelData = audioBuffer.getChannelData(0); // Left channel
    const sampleRate = audioBuffer.sampleRate;
    const numPoints = 200; // Resolution of waveform
    const blockSize = Math.floor(channelData.length / numPoints);
    
    this.waveformPeaks = [];
    for (let i = 0; i < numPoints; i++) {
      let max = 0;
      for (let j = 0; j < blockSize; j++) {
        const val = Math.abs(channelData[i * blockSize + j]);
        if (val > max) max = val;
      }
      this.waveformPeaks.push(max);
    }
  }

  generateDemoWaveform() {
    // Generate a pretty synthetic waveform that lines up with the demo melody notes
    this.waveformPeaks = [];
    const numPoints = 200;
    for (let i = 0; i < numPoints; i++) {
      const timeSec = (i / numPoints) * this.duration;
      // See if a melody note exists near this time
      let amp = 0.1; // Base noise
      DEMO_MELODY.forEach(note => {
        const diff = Math.abs(note.time - timeSec);
        if (diff < note.duration) {
          // Inside note range
          const noteAmp = note.isChord ? 0.3 : 0.6;
          const envelope = 1 - (diff / note.duration);
          amp = Math.max(amp, noteAmp * envelope);
        }
      });
      // Add slight randomness
      amp += Math.random() * 0.05;
      this.waveformPeaks.push(Math.min(amp, 1.0));
    }
  }

  play() {
    this.initAudioContext();
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    
    if (this.isDemo) {
      this.playbackStartTime = this.audioCtx.currentTime - this.pauseOffset;
      this.lastScheduledNoteIndex = -1;
      this.startSynthScheduler();
    } else {
      this.audioElement.currentTime = this.pauseOffset;
      this.audioElement.play().catch(err => {
        console.error("Playback failed", err);
        this.isPlaying = false;
      });
    }
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    
    if (this.isDemo) {
      this.pauseOffset = this.audioCtx.currentTime - this.playbackStartTime;
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
    } else {
      this.audioElement.pause();
      this.pauseOffset = this.audioElement.currentTime;
    }
  }

  stop() {
    this.isPlaying = false;
    this._currentTime = 0;
    this.pauseOffset = 0;
    
    if (this.isDemo) {
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
    } else {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    
    if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(0);
  }

  seek(time) {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.pause();
    
    const clamped = Math.max(0, Math.min(time, this.duration));
    this._currentTime = clamped;
    this.pauseOffset = clamped;
    
    if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(clamped);
    if (wasPlaying) this.play();
  }

  setVolume(val) {
    // val goes from 0 to 1
    const clamped = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = clamped;
    }
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(clamped, this.audioCtx.currentTime);
    }
  }

  // Real-time Procedural Synthesizer for Demo Track
  startSynthScheduler() {
    const scheduleAheadTime = 0.15; // Schedule notes 150ms in advance
    
    this.synthInterval = setInterval(() => {
      if (!this.isPlaying) return;
      
      const elapsed = this.audioCtx.currentTime - this.playbackStartTime;
      this.currentTime = elapsed;
      
      // Notify page
      if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(this.currentTime);
      
      // End song check
      if (this.currentTime >= this.duration) {
        this.stop();
        if (this.onEndCallback) this.onEndCallback();
        return;
      }
      
      // Schedule notes
      const lookaheadStart = elapsed;
      const lookaheadEnd = elapsed + scheduleAheadTime;
      
      DEMO_MELODY.forEach((note, index) => {
        // If note falls in the lookahead window and hasn't been scheduled yet
        if (note.time >= lookaheadStart && note.time < lookaheadEnd) {
          // Verify we don't double-schedule (or we can track schedule state)
          if (note.scheduledTime !== this.playbackStartTime + note.time) {
            this.playSynthNote(note);
            note.scheduledTime = this.playbackStartTime + note.time;
          }
        }
      });
    }, 50); // Run poll every 50ms
  }

  playSynthNote(note) {
    const freq = NOTE_FREQS[note.note];
    if (!freq) return;
    
    const startTime = this.playbackStartTime + note.time;
    const duration = note.duration;
    
    // Create oscillator
    const osc = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();
    
    osc.connect(noteGain);
    noteGain.connect(this.gainNode);
    
    if (note.isChord) {
      // Warm chord pad (triangle waves, low volume, slow attack/decay)
      osc.type = 'triangle';
      
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.12, startTime + 0.15); // soft fade in
      noteGain.gain.setValueAtTime(0.12, startTime + duration - 0.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // slow fade out
    } else {
      // Beautiful pluck melody (sine + triangle chime, fast attack, envelope decay)
      osc.type = 'sine';
      
      // We can add a second oscillator for harmonics
      const subOsc = this.audioCtx.createOscillator();
      const subGain = this.audioCtx.createGain();
      subOsc.connect(subGain);
      subGain.connect(this.gainNode);
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(freq / 2, startTime); // One octave down
      
      subGain.gain.setValueAtTime(0, startTime);
      subGain.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
      subGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.8);
      
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.25, startTime + 0.01); // fast punch
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // bell-like decay
      
      subOsc.start(startTime);
      subOsc.stop(startTime + duration);
    }
    
    osc.frequency.setValueAtTime(freq, startTime);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Draw the waveform canvas
  drawWaveform(canvas, currentTime) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    if (this.waveformPeaks.length === 0) {
      // Draw flatline if no audio is loaded
      ctx.strokeStyle = '#2d313f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }
    
    const padding = 1;
    const numPeaks = this.waveformPeaks.length;
    const barWidth = (width / numPeaks) - padding;
    
    const playPercent = currentTime / this.duration;
    
    for (let i = 0; i < numPeaks; i++) {
      const peak = this.waveformPeaks[i];
      const barHeight = peak * height * 0.85;
      const x = i * (barWidth + padding);
      const y = (height - barHeight) / 2;
      
      const isPlayed = (i / numPeaks) <= playPercent;
      
      // Gradient colors
      if (isPlayed) {
        // Neon Purple-Pink gradient for played audio
        const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
        grad.addColorStop(0, '#d946ef');
        grad.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = grad;
      } else {
        // Deep gray for unplayed audio
        ctx.fillStyle = '#374151';
      }
      
      // Draw rounded rectangle bars
      this.drawRoundedRect(ctx, x, y, barWidth, barHeight, 2);
    }
    
    // Draw current playhead cursor line
    const cursorX = playPercent * width;
    ctx.strokeStyle = '#f43f5e'; // neon rose playhead
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(cursorX, 0);
    ctx.lineTo(cursorX, height);
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }
  
  drawRoundedRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  }
}
