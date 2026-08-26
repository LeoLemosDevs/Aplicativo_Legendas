// 30 popular and beautiful Google Fonts for vertical video subtitle styling
export const GOOGLE_FONTS = [
  { name: 'Inter', category: 'Sans-Serif' },
  { name: 'Montserrat', category: 'Sans-Serif' },
  { name: 'Poppins', category: 'Sans-Serif' },
  { name: 'Outfit', category: 'Sans-Serif' },
  { name: 'Nunito', category: 'Sans-Serif' },
  { name: 'Bebas Neue', category: 'Display / Bold' },
  { name: 'Anton', category: 'Display / Bold' },
  { name: 'Righteous', category: 'Display / Modern' },
  { name: 'Archivo Black', category: 'Display / Bold' },
  { name: 'Oswald', category: 'Sans-Serif / Display' },
  { name: 'Playfair Display', category: 'Serif / Elegant' },
  { name: 'Cinzel', category: 'Serif / Classic' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Lora', category: 'Serif' },
  { name: 'Lobster', category: 'Script / Creative' },
  { name: 'Pacifico', category: 'Script / Retro' },
  { name: 'Dancing Script', category: 'Script / Handwritten' },
  { name: 'Caveat', category: 'Script / Handwritten' },
  { name: 'Great Vibes', category: 'Script / Calligraphy' },
  { name: 'Kanit', category: 'Sans-Serif / Heavy' },
  { name: 'Josefin Sans', category: 'Sans-Serif / Geometric' },
  { name: 'Quicksand', category: 'Sans-Serif / Soft' },
  { name: 'Fira Sans', category: 'Sans-Serif / Modern' },
  { name: 'Ubuntu', category: 'Sans-Serif' },
  { name: 'Lato', category: 'Sans-Serif' },
  { name: 'Roboto', category: 'Sans-Serif' },
  { name: 'PT Sans', category: 'Sans-Serif' },
  { name: 'Raleway', category: 'Sans-Serif / Elegant' },
  { name: 'Roboto Condensed', category: 'Sans-Serif / Compact' },
  { name: 'Permanent Marker', category: 'Display / Marker' }
];

export function injectGoogleFontsStylesheet() {
  const fontNames = GOOGLE_FONTS.map(f => f.name.replace(/\s+/g, '+')).join('|');
  const href = `https://fonts.googleapis.com/css?family=${fontNames}&display=swap`;
  
  // Check if link already exists
  let link = document.querySelector('link[href*="fonts.googleapis.com/css?family="]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}
