import { DEMO_LYRICS } from './demo-data.js';

export class LyricsSync {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.rawText = "";
    this.words = []; // Array of { text, start, end, lineIndex }
    
    // Sync states
    this.isSyncing = false;
    this.currentSyncWordIndex = 0;
    
    // Global timing offset (seconds). Negative = show lyrics earlier than recorded.
    // Useful to compensate for reaction time during manual sync (~0.2 to 0.4s)
    this.timingOffset = 0;
    
    // Callbacks
    this.onSyncProgress = null;
    this.onSyncComplete = null;
  }

  // Load raw text and parse it into an array of unsynced phrases
  parseLyrics(text) {
    this.rawText = text;
    this.words = [];
    
    const lines = text.split('\n');
    let lineIdx = 0;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length === 0) return; // Skip empty lines
      
      this.words.push({
        text: trimmed,
        start: null,
        end: null,
        lineIndex: lineIdx
      });
      lineIdx++;
    });
    
    this.currentSyncWordIndex = 0;
    this.isSyncing = false;
    return this.words;
  }

  loadDemoLyrics() {
    this.words = [
      { text: "Mais perto quero estar, meu Deus, de Ti!", start: 1.0, end: 7.0, lineIndex: 0 },
      { text: "Ainda que seja a dor que me una a Ti!", start: 8.0, end: 14.5, lineIndex: 1 },
      { text: "Sempre hei de suplicar:", start: 15.5, end: 19.5, lineIndex: 2 },
      { text: "Mais perto quero estar,", start: 20.0, end: 23.5, lineIndex: 3 },
      { text: "Mais perto quero estar, meu Deus, de Ti!", start: 24.0, end: 30.5, lineIndex: 4 }
    ];
    this.currentSyncWordIndex = 0;
    this.isSyncing = false;
    this.rawText = DEMO_LYRICS;
    return this.words;
  }

  startSync() {
    if (this.words.length === 0) return;
    this.isSyncing = true;
    this.currentSyncWordIndex = 0;
    
    // Clear existing timings
    this.words.forEach(w => {
      w.start = null;
      w.end = null;
    });
    
    this.audioManager.seek(0);
    this.audioManager.play();
  }

  // Record timing for the current phrase
  recordNextWord() {
    if (!this.isSyncing || this.currentSyncWordIndex >= this.words.length) return;
    
    const currentTime = this.audioManager.currentTime;
    const currentPhrase = this.words[this.currentSyncWordIndex];
    
    // Set start time of current phrase
    currentPhrase.start = currentTime;
    
    // Set end time of the PREVIOUS phrase
    if (this.currentSyncWordIndex > 0) {
      const prevPhrase = this.words[this.currentSyncWordIndex - 1];
      if (prevPhrase.end === null) {
        prevPhrase.end = currentTime;
      }
    }
    
    this.currentSyncWordIndex++;
    
    // Check if finished
    if (this.currentSyncWordIndex >= this.words.length) {
      // Close the final phrase
      currentPhrase.end = currentTime + 2.0;
      this.isSyncing = false;
      this.audioManager.pause();
      if (this.onSyncComplete) this.onSyncComplete();
    } else {
      if (this.onSyncProgress) {
        this.onSyncProgress(this.currentSyncWordIndex, this.words.length);
      }
    }
  }

  // Mark the end of the current phrase (adds a pause/gap before next)
  recordLineEnd() {
    if (!this.isSyncing || this.currentSyncWordIndex === 0) return;
    
    const currentTime = this.audioManager.currentTime;
    const prevPhrase = this.words[this.currentSyncWordIndex - 1];
    
    // Close the previous phrase
    if (prevPhrase && prevPhrase.end === null) {
      prevPhrase.end = currentTime;
    }
  }

  cancelSync() {
    this.isSyncing = false;
    this.currentSyncWordIndex = 0;
    this.audioManager.pause();
  }

  // Adjust timing manually
  updateWordTiming(index, field, value) {
    if (index >= 0 && index < this.words.length) {
      this.words[index][field] = parseFloat(value);
    }
  }

  // Group phrases into lines for display in the preview canvas
  getLines() {
    const lines = [];
    this.words.forEach((phrase, idx) => {
      lines.push({
        lineIndex: idx,
        words: [phrase], // Maintain array shape so other drawing modules work out of the box
        start: phrase.start,
        end: phrase.end
      });
    });
    return lines;
  }

  // Find the active line for a given timestamp
  getActiveElementsAtTime(time) {
    const lines = this.getLines();
    
    // Apply global timing offset (compensates for reaction time during sync recording)
    const adjustedTime = time - this.timingOffset;
    
    // During sync, show the phrase that is currently being performed
    // (i.e., the last phrase whose start was just tapped, not the next one)
    if (this.isSyncing) {
      const activeIdx = this.currentSyncWordIndex - 1;
      if (activeIdx >= 0 && activeIdx < lines.length) {
        const activeLine = lines[activeIdx];
        return {
          line: activeLine,
          lineIndex: activeIdx,
          word: activeLine.words[0],
          wordIndex: activeIdx
        };
      }
      // Before any tap, nothing is active
      return { line: null, lineIndex: -1, word: null, wordIndex: -1 };
    }
    
    // Playback mode: find the phrase that covers the current time
    let activeLine = null;
    let activeLineIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip phrases that haven't been given a start time
      if (line.start === null) continue;
      
      // Use the next phrase's start (or song duration) as the effective end boundary
      // This means we DON'T require 'end' to be set — handles incomplete syncs gracefully
      const nextLine = lines[i + 1];
      const effectiveEnd = (nextLine && nextLine.start !== null)
        ? nextLine.start
        : (this.audioManager.duration || Infinity);
      
      if (adjustedTime >= line.start && adjustedTime < effectiveEnd) {
        activeLine = line;
        activeLineIndex = i;
        break;
      }
    }
    
    if (!activeLine) return { line: null, lineIndex: -1, word: null, wordIndex: -1 };
    
    const phrase = activeLine.words[0];
    return {
      line: activeLine,
      lineIndex: activeLineIndex,
      word: phrase,
      wordIndex: activeLineIndex
    };
  }
}
