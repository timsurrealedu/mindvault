/* Seed data for the MindVault prototype.
   Shape mirrors the Prisma models in server/prisma/schema.prisma so the
   frontend can switch from these mocks to live API responses with no
   structural changes. */

export const user = {
  name: 'Aria',
  streak: 7,
  exp: 1280,
  level: 6,
  joinedDays: 42,
}

/* A gentle motivation quote shown on the Dashboard, one per calendar day.
   Bilingual ({ en, id }); warm and affirming, never preachy. */
export const dailyQuotes = [
  { en: 'You don’t have to be fixed. You just have to keep going, gently.', id: 'Kamu tak harus sempurna dulu. Cukup terus melangkah, pelan-pelan.' },
  { en: 'Healing isn’t linear, and that’s completely okay.', id: 'Pemulihan tak selalu lurus, dan itu sepenuhnya wajar.' },
  { en: 'Small steps are still steps. You’re moving forward.', id: 'Langkah kecil tetap langkah. Kamu sedang maju.' },
  { en: 'Rest is productive too. Your worth isn’t measured in output.', id: 'Istirahat juga produktif. Nilaimu tak diukur dari hasil kerja.' },
  { en: 'The fact that you showed up today already matters.', id: 'Kamu hadir hari ini — itu saja sudah berarti.' },
  { en: 'Be as kind to yourself as you would be to a good friend.', id: 'Berbaik hatilah pada dirimu seperti pada sahabat baik.' },
  { en: 'Your feelings are valid, even the heavy ones.', id: 'Perasaanmu valid, bahkan yang terasa berat.' },
  { en: 'One breath at a time is enough for right now.', id: 'Satu tarikan napas demi satu sudah cukup untuk saat ini.' },
  { en: 'You’ve survived every hard day so far. That’s a record.', id: 'Sejauh ini kamu selamat dari setiap hari yang berat. Itu rekor.' },
  { en: 'Progress, not perfection. You’re allowed to be a work in progress.', id: 'Kemajuan, bukan kesempurnaan. Kamu boleh menjadi sosok yang masih bertumbuh.' },
  { en: 'It’s brave to ask for help. It’s brave to keep trying.', id: 'Meminta bantuan itu berani. Terus mencoba juga berani.' },
  { en: 'You are not your worst day.', id: 'Kamu bukan hari terburukmu.' },
  { en: 'Let today be enough. You are enough.', id: 'Biarkan hari ini cukup. Kamu sudah cukup.' },
  { en: 'Storms pass. You can wait this one out, gently.', id: 'Badai berlalu. Kamu bisa menunggunya reda, pelan-pelan.' },
]

// Deterministic quote for today (stable across the day, changes daily).
export const quoteOfDay = (date = new Date()) => {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
  return dailyQuotes[dayOfYear % dailyQuotes.length]
}

export const moods = {
  calm: { label: 'Calm', state: 'calm', score: 78 },
  anxious: { label: 'Anxious', state: 'anxious', score: 34 },
  neutral: { label: 'Balanced', state: 'calm', score: 60 },
}

// Daily quests are generated adaptively in lib/quests.js (getDailyQuests).

/* Focus areas replace the old fixed clinical tracks. They're universally
   relevant (so no one is pigeonholed into "social anxiety") and the daily quest
   set is weighted toward whichever ones a user's recent diary + mood suggest —
   see lib/quests.js (inferFocus). Labels/hints are localized in i18n under
   `focus.<key>`; here we keep the display order and a per-area icon name. */
export const FOCUS_AREAS = ['grounding', 'connection', 'rest', 'body', 'reflection', 'courage']

export const focusMeta = {
  grounding: { icon: 'leaf' },
  connection: { icon: 'users' },
  rest: { icon: 'wind' },
  body: { icon: 'heart' },
  reflection: { icon: 'book' },
  courage: { icon: 'shield' },
}

// Back-compat alias (some modules still import trackMeta).
export const trackMeta = focusMeta

export const rewards = [
  {
    id: 'r1', kind: 'cosmetic', icon: 'paw', title: 'Astronaut Hat', cost: 300,
    desc: {
      en: 'A tiny space helmet your companion wears around the app. Purely for joy.',
      id: 'Helm luar angkasa mungil untuk dipakai companion-mu keliling app. Murni buat senang.',
    },
  },
  {
    id: 'r2', kind: 'cosmetic', icon: 'sparkle', title: 'Aurora Trail', cost: 450,
    desc: {
      en: 'A soft shimmer that follows your companion as it moves. Cosmetic only.',
      id: 'Kilau lembut yang mengikuti companion-mu saat bergerak. Hanya kosmetik.',
    },
  },
  {
    id: 'r3', kind: 'voucher', icon: 'gift', title: '20% Teleconsult Voucher', cost: 800,
    desc: {
      en: 'Take 20% off your next session with a verified therapist.',
      id: 'Potongan 20% untuk sesi berikutnya dengan terapis terverifikasi.',
    },
  },
  {
    id: 'r4', kind: 'donation', icon: 'heart', title: 'Donate to Smart Society', cost: 500,
    desc: {
      en: 'Turn your EXP into a real donation to youth mental-health programs.',
      id: 'Ubah EXP-mu jadi donasi nyata untuk program kesehatan mental remaja.',
    },
  },
]

export const doctors = [
  { id: 'd1', name: 'Dr. Lena Hartmann', spec: 'Clinical Psychologist · CBT', status: 'available', rating: 4.9, next: 'Today 4:30pm' },
  { id: 'd2', name: 'Dr. Omar Reyes', spec: 'Psychiatrist · Anxiety & Mood', status: 'available', rating: 4.8, next: 'Tomorrow 9:00am' },
  { id: 'd3', name: 'Dr. Mei Tan', spec: 'Trauma-Informed Therapy', status: 'busy', rating: 4.95, next: 'Thu 2:00pm' },
  { id: 'd4', name: 'Dr. Idris Bello', spec: 'Adolescent & Burnout Care', status: 'offline', rating: 4.7, next: 'Mon 11:00am' },
]

// sense/prompt are bilingual ({ en, id }); PanicMode resolves by active language.
export const groundingSteps = [
  { n: 5, sense: { en: 'things you can SEE', id: 'hal yang bisa kamu LIHAT' }, prompt: { en: 'Look around. Name five things you can see right now.', id: 'Lihat sekeliling. Sebutkan lima hal yang bisa kamu lihat sekarang.' } },
  { n: 4, sense: { en: 'things you can TOUCH', id: 'hal yang bisa kamu SENTUH' }, prompt: { en: 'Notice four textures — your chair, your sleeve, the floor.', id: 'Rasakan empat tekstur — kursimu, lenganmu, lantai.' } },
  { n: 3, sense: { en: 'things you can HEAR', id: 'hal yang bisa kamu DENGAR' }, prompt: { en: 'Listen for three distinct sounds, near or far.', id: 'Dengarkan tiga suara berbeda, dekat atau jauh.' } },
  { n: 2, sense: { en: 'things you can SMELL', id: 'hal yang bisa kamu CIUM' }, prompt: { en: 'Find two scents around you, or two you love.', id: 'Temukan dua aroma di sekitarmu, atau dua yang kamu suka.' } },
  { n: 1, sense: { en: 'thing you can TASTE', id: 'hal yang bisa kamu KECAP' }, prompt: { en: 'Notice one taste, or take a slow sip of water.', id: 'Sadari satu rasa, atau teguk air perlahan.' } },
]

/* Scripted empathetic AI replies for the chat prototype. */
export const aiReplies = [
  "That sounds really heavy to carry. I'm here with you — what part feels loudest right now?",
  'Thank you for trusting me with that. There’s no rush. Can we sit with one small piece of it together?',
  'I hear you. It makes complete sense you’d feel that way given everything. What would feel kind to yourself in this moment?',
  'You’re doing something brave just by putting words to this. Would a short grounding exercise help, or would you rather keep talking?',
  'Noticing the feeling without judging it is real progress. I’ve encrypted and saved this entry to your private vault. 🔒',
]

// Companion mascot lines live in lib/mascots.js (idleLines / reactionLines).

/* SafeSpace Community — anonymous, moderated peer support. */
export const communityCategories = [
  { id: 'all', label: 'All' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'burnout', label: 'Burnout' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'wins', label: 'Small Wins' },
  { id: 'vent', label: 'Vent Safely' },
]

export const handleAdjectives = ['Quiet', 'Gentle', 'Brave', 'Calm', 'Kind', 'Soft', 'Hopeful', 'Steady', 'Warm', 'Patient']
export const handleAnimals = ['Otter', 'Sparrow', 'Fox', 'Heron', 'Koala', 'Finch', 'Deer', 'Whale', 'Robin', 'Lynx']

// Thread bodies are bilingual ({ en, id }); user-posted threads store a plain
// string. Community.jsx resolves either shape against the active language.
export const communityThreads = [
  {
    id: 'c1', handle: 'Gentle Otter', emoji: '🦦', category: 'anxiety',
    time: '12m ago',
    body: {
      en: 'Had my first day back at work after a long break. My chest was tight all morning but I used the box breathing from here and made it through. Small steps.',
      id: 'Hari pertama balik kerja setelah cuti panjang. Dadaku sesak sepanjang pagi, tapi aku pakai teknik box breathing dari sini dan berhasil melewatinya. Langkah kecil.',
    },
    support: 23, replies: 7,
  },
  {
    id: 'c2', handle: 'Hopeful Finch', emoji: '🐦', category: 'wins',
    time: '48m ago',
    body: {
      en: 'I replied to a message I’d been avoiding for two weeks. It took me an hour to hit send but I did it. That’s a win for me today. 🌱',
      id: 'Aku akhirnya balas pesan yang dua minggu kuhindari. Butuh sejam buat menekan kirim, tapi aku berhasil. Itu kemenangan buatku hari ini. 🌱',
    },
    support: 41, replies: 12,
  },
  {
    id: 'c3', handle: 'Steady Heron', emoji: '🪶', category: 'sleep',
    time: '2h ago',
    body: {
      en: 'Anyone else’s mind races the second the lights go off? Trying the screen-free wind-down quest tonight. Wish me luck.',
      id: 'Ada yang pikirannya langsung berpacu begitu lampu dimatikan? Malam ini aku coba misi reda tanpa layar. Doakan ya.',
    },
    support: 15, replies: 9,
  },
  {
    id: 'c4', handle: 'Soft Koala', emoji: '🐨', category: 'burnout',
    time: '5h ago',
    body: {
      en: 'Reminder I needed today and maybe you do too: rest is not a reward you earn after burning out. You’re allowed to stop before empty.',
      id: 'Pengingat yang kubutuhkan hari ini dan mungkin kamu juga: istirahat bukan hadiah yang baru pantas didapat setelah kelelahan. Kamu boleh berhenti sebelum benar-benar kosong.',
    },
    support: 68, replies: 18,
  },
]
