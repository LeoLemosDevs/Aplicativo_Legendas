// Demo project data for "Mais Perto Quero Estar" (Classic Hymn)
// Pre-synced so the user can see immediate results with a programmatic synthesizer.

export const DEMO_LYRICS = `Mais perto quero estar meu Deus de Ti
Ainda que seja a dor que me una a Ti
Sempre hei de suplicar
Mais perto quero estar
Mais perto quero estar meu Deus de Ti`;

export const DEMO_WORDS = [
  // Line 1: Mais perto quero estar meu Deus de Ti
  { text: "Mais", start: 1.0, end: 1.5, lineIndex: 0 },
  { text: "perto", start: 1.5, end: 2.2, lineIndex: 0 },
  { text: "quero", start: 2.2, end: 2.8, lineIndex: 0 },
  { text: "estar,", start: 2.8, end: 3.8, lineIndex: 0 },
  { text: "meu", start: 3.8, end: 4.3, lineIndex: 0 },
  { text: "Deus,", start: 4.3, end: 5.2, lineIndex: 0 },
  { text: "de", start: 5.2, end: 5.7, lineIndex: 0 },
  { text: "Ti!", start: 5.7, end: 7.0, lineIndex: 0 },

  // Line 2: Ainda que seja a dor que me una a Ti
  { text: "Ainda", start: 8.0, end: 8.8, lineIndex: 1 },
  { text: "que", start: 8.8, end: 9.3, lineIndex: 1 },
  { text: "seja", start: 9.3, end: 9.9, lineIndex: 1 },
  { text: "a", start: 9.9, end: 10.3, lineIndex: 1 },
  { text: "dor", start: 10.3, end: 11.2, lineIndex: 1 },
  { text: "que", start: 11.2, end: 11.6, lineIndex: 1 },
  { text: "me", start: 11.6, end: 12.0, lineIndex: 1 },
  { text: "una", start: 12.0, end: 12.8, lineIndex: 1 },
  { text: "a", start: 12.8, end: 13.2, lineIndex: 1 },
  { text: "Ti!", start: 13.2, end: 14.5, lineIndex: 1 },

  // Line 3: Sempre hei de suplicar
  { text: "Sempre", start: 15.5, end: 16.3, lineIndex: 2 },
  { text: "hei", start: 16.3, end: 16.8, lineIndex: 2 },
  { text: "de", start: 16.8, end: 17.3, lineIndex: 2 },
  { text: "suplicar:", start: 17.3, end: 19.5, lineIndex: 2 },

  // Line 4: Mais perto quero estar
  { text: "Mais", start: 20.0, end: 20.6, lineIndex: 3 },
  { text: "perto", start: 20.6, end: 21.2, lineIndex: 3 },
  { text: "quero", start: 21.2, end: 21.8, lineIndex: 3 },
  { text: "estar,", start: 21.8, end: 23.5, lineIndex: 3 },

  // Line 5: Mais perto quero estar meu Deus de Ti
  { text: "Mais", start: 24.0, end: 24.5, lineIndex: 4 },
  { text: "perto", start: 24.5, end: 25.2, lineIndex: 4 },
  { text: "quero", start: 25.2, end: 25.8, lineIndex: 4 },
  { text: "estar,", start: 25.8, end: 26.8, lineIndex: 4 },
  { text: "meu", start: 26.8, end: 27.3, lineIndex: 4 },
  { text: "Deus,", start: 27.3, end: 28.2, lineIndex: 4 },
  { text: "de", start: 28.2, end: 28.7, lineIndex: 4 },
  { text: "Ti!", start: 28.7, end: 30.5, lineIndex: 4 }
];

// Simple procedural music generator score
// Format: { time: seconds, note: string/frequency, duration: seconds, instrument: 'melody' | 'chord' }
export const DEMO_MELODY = [
  // Line 1 chords & melody
  { time: 1.0, note: "G4", duration: 0.5 },
  { time: 1.5, note: "A4", duration: 0.7 },
  { time: 2.2, note: "G4", duration: 0.6 },
  { time: 2.8, note: "E4", duration: 1.0 },
  { time: 3.8, note: "D4", duration: 0.5 },
  { time: 4.3, note: "E4", duration: 0.9 },
  { time: 5.2, note: "G4", duration: 0.5 },
  { time: 5.7, note: "A4", duration: 1.3 },
  
  // Backing chords
  { time: 1.0, note: "C3", duration: 2.0, isChord: true },
  { time: 1.0, note: "E3", duration: 2.0, isChord: true },
  { time: 1.0, note: "G3", duration: 2.0, isChord: true },
  { time: 3.0, note: "C3", duration: 2.0, isChord: true },
  { time: 3.0, note: "F3", duration: 2.0, isChord: true },
  { time: 3.0, note: "A3", duration: 2.0, isChord: true },

  // Line 2 chords & melody
  { time: 8.0, note: "G4", duration: 0.8 },
  { time: 8.8, note: "A4", duration: 0.5 },
  { time: 9.3, note: "G4", duration: 0.6 },
  { time: 9.9, note: "E4", duration: 0.4 },
  { time: 10.3, note: "D4", duration: 0.9 },
  { time: 11.2, note: "E4", duration: 0.4 },
  { time: 11.6, note: "D4", duration: 0.4 },
  { time: 12.0, note: "C4", duration: 0.8 },
  { time: 12.8, note: "D4", duration: 0.4 },
  { time: 13.2, note: "C4", duration: 1.3 },

  { time: 8.0, note: "C3", duration: 3.0, isChord: true },
  { time: 8.0, note: "E3", duration: 3.0, isChord: true },
  { time: 8.0, note: "G3", duration: 3.0, isChord: true },
  { time: 11.0, note: "G2", duration: 3.0, isChord: true },
  { time: 11.0, note: "B2", duration: 3.0, isChord: true },
  { time: 11.0, note: "D3", duration: 3.0, isChord: true },

  // Line 3
  { time: 15.5, note: "C5", duration: 0.8 },
  { time: 16.3, note: "C5", duration: 0.5 },
  { time: 16.8, note: "A4", duration: 0.5 },
  { time: 17.3, note: "C5", duration: 2.2 },

  { time: 15.5, note: "F3", duration: 4.0, isChord: true },
  { time: 15.5, note: "A3", duration: 4.0, isChord: true },
  { time: 15.5, note: "C4", duration: 4.0, isChord: true },

  // Line 4
  { time: 20.0, note: "C5", duration: 0.6 },
  { time: 20.6, note: "B4", duration: 0.6 },
  { time: 21.2, note: "A4", duration: 0.6 },
  { time: 21.8, note: "G4", duration: 1.7 },

  { time: 20.0, note: "C3", duration: 3.0, isChord: true },
  { time: 20.0, note: "E3", duration: 3.0, isChord: true },
  { time: 20.0, note: "G3", duration: 3.0, isChord: true },

  // Line 5
  { time: 24.0, note: "G4", duration: 0.5 },
  { time: 24.5, note: "A4", duration: 0.7 },
  { time: 25.2, note: "G4", duration: 0.6 },
  { time: 25.8, note: "E4", duration: 1.0 },
  { time: 26.8, note: "D4", duration: 0.5 },
  { time: 27.3, note: "C4", duration: 0.9 },
  { time: 28.2, note: "D4", duration: 0.5 },
  { time: 28.7, note: "C4", duration: 1.8 },

  { time: 24.0, note: "C3", duration: 2.0, isChord: true },
  { time: 24.0, note: "E3", duration: 2.0, isChord: true },
  { time: 24.0, note: "G3", duration: 2.0, isChord: true },
  { time: 26.0, note: "F3", duration: 2.0, isChord: true },
  { time: 26.0, note: "A3", duration: 2.0, isChord: true },
  { time: 28.0, note: "G2", duration: 3.0, isChord: true },
  { time: 28.0, note: "B2", duration: 3.0, isChord: true }
];
