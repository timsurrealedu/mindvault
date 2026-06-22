/* Pixel-art mascot library.
   Each mascot is a 16x16 sprite map (rows of digits) plus a color table keyed
   by those digits. 0 = transparent. Rendered crisply via SVG rects in
   <MascotSprite/>, so no image assets are needed and any mascot scales sharply.
   Companions live globally (every page) and the user picks one in Profile. */

export const MASCOTS = [
  {
    id: 'cat',
    name: 'Miso the Cat',
    emoji: '🐱',
    colors: { 1: '#f5a623', 2: '#caa472', 3: '#2b2f38', 4: '#e8657a' },
    sprite: [
      '0000000000000000',
      '0020000000002000',
      '0022000000022000',
      '0024200000242000',
      '0022220000222000',
      '0011111111111100',
      '0111111111111110',
      '0113111111131110',
      '0113111111131110',
      '0111111441111110',
      '0111111111111110',
      '0111111441111110',
      '0111111111111110',
      '0011111111111100',
      '0001111111111000',
      '0000110000110000',
    ],
  },
  {
    id: 'dog',
    name: 'Pixel the Pup',
    emoji: '🐶',
    colors: { 1: '#c8915f', 2: '#7a5236', 3: '#2b2f38', 5: '#e8657a' },
    sprite: [
      '0000000000000000',
      '0220000000000220',
      '2222000000002222',
      '2222000000002222',
      '0222111111112220',
      '0011111111111100',
      '0111111111111110',
      '0113111111131110',
      '0113111111131110',
      '0111111331111110',
      '0111111111111110',
      '0111115555111110',
      '0111111111111110',
      '0011111111111100',
      '0001111111111000',
      '0000110000110000',
    ],
  },
  {
    id: 'bunny',
    name: 'Hop the Bunny',
    emoji: '🐰',
    colors: { 1: '#eceaf0', 2: '#e89ab5', 3: '#2b2f38', 4: '#e89ab5' },
    sprite: [
      '0000110000110000',
      '0001210001210000',
      '0001210001210000',
      '0001210001210000',
      '0011111111111100',
      '0111111111111110',
      '0111111111111110',
      '0113111111131110',
      '0113111111131110',
      '0111111441111110',
      '0111111111111110',
      '0111111111111110',
      '0011111111111100',
      '0001111111111000',
      '0001111111111000',
      '0000110000110000',
    ],
  },
  {
    id: 'fox',
    name: 'Ember the Fox',
    emoji: '🦊',
    colors: { 1: '#f08a3c', 2: '#fff4e6', 3: '#2b2f38', 4: '#2b2f38' },
    sprite: [
      '0000000000000000',
      '0220000000000220',
      '0222000000002220',
      '0222200000022220',
      '0222210000122220',
      '0011111111111100',
      '0111111111111110',
      '0113111111131110',
      '0113111111131110',
      '0111111441111110',
      '0111111111111110',
      '0112111111121110',
      '0012222222221100',
      '0001222222211000',
      '0001111111111000',
      '0000110000110000',
    ],
  },
  {
    id: 'slime',
    name: 'Dewdrop the Slime',
    emoji: '🫧',
    colors: { 1: '#67c7c0', 3: '#2b2f38', 4: '#2b2f38' },
    sprite: [
      '0000000000000000',
      '0000000000000000',
      '0000011111100000',
      '0000111111110000',
      '0001111111111000',
      '0011111111111100',
      '0111111111111110',
      '0113111111131110',
      '0113111111131110',
      '0111111111111110',
      '0111111441111110',
      '0111111111111110',
      '0111111111111110',
      '0011111111111100',
      '0111111111111110',
      '0110110110110110',
    ],
  },
]

export const getMascot = (id) => MASCOTS.find((m) => m.id === id) || MASCOTS[0]

/* What the companion says, per language. The Mascot picks the set matching the
   active app language so the companion speaks the user's chosen tongue.
   - idle:    gentle idle encouragement
   - reaction:livelier lines when petted
   - love:    a burst of affection on a rapid-pet streak
   - comfort: grounding lines surfaced when the mood reads as anxious
   - drag:    playful chatter while being dragged around */
export const LINES = {
  en: {
    idle: [
      'You showed up today. That counts. 🐾',
      'Breathe with me… in… and out.',
      'Your thoughts are safe here.',
      'One word at a time is enough.',
      'Proud of you for writing.',
      "I'm right here with you.",
    ],
    reaction: [
      'Hehe, that tickles! ✨',
      'Yay! I love hanging out with you.',
      "Keep going — you've got this! 💪",
      'Ooh, tell me more!',
      '*happy wiggle*',
      "You're doing great, honestly.",
      'Boop! 💙',
    ],
    love: [
      '*purrs happily* 💕',
      "Okay okay — you're my favourite!",
      'My heart is so full right now. 🥰',
      '*does a happy spin* wheee!',
      'I could do this all day with you.',
    ],
    comfort: [
      "Whatever it is, we'll face it together.",
      "Let's take one slow breath. I'll wait.",
      "You're safe. I'm not going anywhere.",
      'Feelings pass like weather. This will too.',
      "You don't have to carry it alone. 💙",
    ],
    drag: ['Wheee! 🎢', 'Where are we going?', 'Zoom zoom!', '*happy floating*'],
  },
  id: {
    idle: [
      'Kamu hadir hari ini. Itu berarti. 🐾',
      'Bernapas bersamaku… tarik… dan hembuskan.',
      'Pikiranmu aman di sini.',
      'Satu kata demi satu kata sudah cukup.',
      'Bangga padamu karena menulis.',
      'Aku di sini bersamamu.',
    ],
    reaction: [
      'Hihi, geli! ✨',
      'Yay! Aku suka menghabiskan waktu denganmu.',
      'Terus lanjut — kamu pasti bisa! 💪',
      'Ooh, cerita lagi dong!',
      '*goyang gembira*',
      'Kamu hebat, sungguh.',
      'Bup! 💙',
    ],
    love: [
      '*mendengkur senang* 💕',
      'Oke oke — kamu favoritku!',
      'Hatiku penuh banget sekarang. 🥰',
      '*berputar gembira* wheee!',
      'Aku bisa begini seharian bersamamu.',
    ],
    comfort: [
      'Apa pun itu, kita hadapi bersama.',
      'Ayo tarik napas pelan. Aku menunggu.',
      'Kamu aman. Aku tak ke mana-mana.',
      'Perasaan berlalu seperti cuaca. Ini pun akan berlalu.',
      'Kamu tak perlu memikulnya sendiri. 💙',
    ],
    drag: ['Wheee! 🎢', 'Kita mau ke mana?', 'Ngeeeng!', '*melayang senang*'],
  },
}

export const getLines = (lang) => LINES[lang] || LINES.en

/* Emoji that puff out of the mascot as floating particles when petted. */
export const reactionEmotes = ['💙', '✨', '💫', '🌟', '💛', '🐾']
export const loveEmotes = ['💕', '💖', '😻', '✨', '🥰']
