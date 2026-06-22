/* Adaptive, personalised daily quests.
   Instead of three fixed clinical tracks (which assume everyone has, say,
   social anxiety), quests are tagged by universally-relevant FOCUS AREAS. Each
   day the "AI Game Master" draws a set weighted toward the areas a user's
   recent signals suggest — derived here from their saved diary entries AND
   their AI-chat messages + mood via inferFocus(). The pick is seeded by the
   date (+ optional salt) so it's stable for a given day yet genuinely different
   day to day, and a fresh seed (the limited "re-curate" action) yields a new
   recommendation on demand. In production the weights would come from the model
   reading real chat/journal signals; this is a faithful, offline stand-in.

   Quest copy is bilingual: title/desc are { en, id } and rendered by the active
   language (see QuestCard). */

import { FOCUS_AREAS } from './data.js'

// The pool the AI curates from, tagged by focus area. Gently framed — no
// clinical labels, applicable to anyone.
const POOL = [
  // grounding — settle the nervous system
  { key: 'ground-breath', track: 'grounding', exp: 35,
    title: { en: 'One minute of slow breathing', id: 'Satu menit napas pelan' },
    desc: { en: 'Four counts in, six counts out. Just sixty seconds — I’ll keep you company.', id: 'Tarik empat hitungan, embuskan enam. Cuma enam puluh detik — aku temani.' } },
  { key: 'ground-54321', track: 'grounding', exp: 40,
    title: { en: 'Try the 5-4-3-2-1 senses', id: 'Coba teknik 5-4-3-2-1' },
    desc: { en: 'Name what you can see, touch, hear, smell, taste. Come back to the present.', id: 'Sebutkan yang kamu lihat, sentuh, dengar, cium, kecap. Kembali ke saat ini.' } },
  { key: 'ground-name', track: 'grounding', exp: 30,
    title: { en: 'Name the feeling out loud', id: 'Sebut perasaanmu keras-keras' },
    desc: { en: 'Putting a word to it (“this is worry”) loosens its grip. No fixing needed.', id: 'Memberi nama (“ini cemas”) bikin cengkeramannya mengendur. Tak perlu diperbaiki.' } },
  { key: 'ground-cold', track: 'grounding', exp: 25,
    title: { en: 'Cool water on your wrists', id: 'Air dingin di pergelangan tangan' },
    desc: { en: 'A small, physical reset when the mind races. Ten slow seconds.', id: 'Reset kecil saat pikiran berpacu. Sepuluh detik pelan.' } },

  // connection — gentle reaching out
  { key: 'connect-text', track: 'connection', exp: 45,
    title: { en: 'Message someone you miss', id: 'Kirim pesan ke yang kamu rindukan' },
    desc: { en: 'A simple “thinking of you” counts. Your pace, your words.', id: 'Cukup “lagi kepikiran kamu”. Sesuai temponya, sesuai kata-katamu.' } },
  { key: 'connect-voice', track: 'connection', exp: 45,
    title: { en: 'Send one voice note', id: 'Kirim satu pesan suara' },
    desc: { en: 'Reach out to a friend you’ve meant to message — your voice, no pressure.', id: 'Sapa teman yang dari tadi mau kamu hubungi — pakai suaramu, santai.' } },
  { key: 'connect-thanks', track: 'connection', exp: 35,
    title: { en: 'Thank one person today', id: 'Berterima kasih ke satu orang' },
    desc: { en: 'Tell someone, in any small way, that you appreciate them.', id: 'Beri tahu seseorang, sekecil apa pun, kalau kamu menghargainya.' } },
  { key: 'connect-share', track: 'connection', exp: 50,
    title: { en: 'Share something true', id: 'Bagikan sesuatu yang jujur' },
    desc: { en: 'Let one person see a real, small piece of how you’re doing.', id: 'Biarkan satu orang tahu sedikit keadaanmu yang sebenarnya.' } },

  // rest — sleep & slowing down
  { key: 'rest-screen', track: 'rest', exp: 60,
    title: { en: 'Screen-free wind-down', id: 'Reda tanpa layar' },
    desc: { en: 'No screens for the 45 minutes before bed. Let your mind dim slowly.', id: 'Tanpa layar 45 menit sebelum tidur. Biarkan pikiranmu meredup pelan.' } },
  { key: 'rest-sleep', track: 'rest', exp: 70,
    title: { en: 'Hit your sleep window', id: 'Tidur tepat waktu' },
    desc: { en: 'Aim for your target bedtime within 30 minutes. Kindness, not pressure.', id: 'Usahakan tidur dalam 30 menit dari targetmu. Lembut, bukan paksaan.' } },
  { key: 'rest-break', track: 'rest', exp: 35,
    title: { en: 'Take one real break', id: 'Ambil satu jeda beneran' },
    desc: { en: 'Step fully away from work for 15 minutes — no phone, no guilt.', id: 'Menjauh total dari kerjaan 15 menit — tanpa HP, tanpa rasa bersalah.' } },
  { key: 'rest-nothing', track: 'rest', exp: 30,
    title: { en: 'Five minutes of doing nothing', id: 'Lima menit tanpa melakukan apa pun' },
    desc: { en: 'No goal, no input. Just sit and let the day settle for a moment.', id: 'Tanpa tujuan, tanpa masukan. Duduk saja dan biarkan harimu mengendap sejenak.' } },

  // body — small kindnesses to the body
  { key: 'body-water', track: 'body', exp: 25,
    title: { en: 'Three glasses of water', id: 'Tiga gelas air' },
    desc: { en: 'A small act of care for the body that carries you. Sip through the day.', id: 'Bentuk kecil merawat tubuh yang menopangmu. Seruput sepanjang hari.' } },
  { key: 'body-stretch', track: 'body', exp: 30,
    title: { en: 'Two minutes of stretching', id: 'Dua menit peregangan' },
    desc: { en: 'Unclench the shoulders and jaw. Two slow minutes is plenty.', id: 'Lemaskan bahu dan rahang. Dua menit pelan sudah cukup.' } },
  { key: 'body-walk', track: 'body', exp: 40,
    title: { en: 'Ten minutes outside', id: 'Sepuluh menit di luar' },
    desc: { en: 'A slow walk, no destination. Notice the air, the light, your steps.', id: 'Jalan santai tanpa tujuan. Rasakan udara, cahaya, langkahmu.' } },
  { key: 'body-meal', track: 'body', exp: 35,
    title: { en: 'One nourishing meal', id: 'Satu makanan bergizi' },
    desc: { en: 'Eat one thing today that’s genuinely kind to your body. Slowly.', id: 'Makan satu hal hari ini yang benar-benar baik untuk tubuhmu. Pelan-pelan.' } },

  // reflection — notice & process
  { key: 'reflect-three', track: 'reflection', exp: 35,
    title: { en: 'Write three good things', id: 'Tulis tiga hal baik' },
    desc: { en: 'Tiny ones count — warm coffee, a text, a breath. Notice the good.', id: 'Yang kecil pun dihitung — kopi hangat, sebuah pesan, satu tarikan napas. Sadari yang baik.' } },
  { key: 'reflect-letter', track: 'reflection', exp: 45,
    title: { en: 'A kind note to yourself', id: 'Pesan baik untuk dirimu' },
    desc: { en: 'Write a few lines to yourself as you would to a dear friend.', id: 'Tulis beberapa baris untuk dirimu seperti kepada sahabat dekat.' } },
  { key: 'reflect-diary', track: 'reflection', exp: 40,
    title: { en: 'A short diary entry', id: 'Catatan harian singkat' },
    desc: { en: 'Even two sentences. Let today out of your head and onto the page.', id: 'Dua kalimat pun jadi. Keluarkan harimu dari kepala ke halaman.' } },
  { key: 'reflect-reframe', track: 'reflection', exp: 50,
    title: { en: 'Reframe one harsh thought', id: 'Ubah satu pikiran keras' },
    desc: { en: 'Catch one unkind thought and gently rewrite it, fairer and softer.', id: 'Tangkap satu pikiran kasar dan tulis ulang dengan lebih adil dan lembut.' } },

  // courage — face it, one safe step
  { key: 'courage-step', track: 'courage', exp: 60,
    title: { en: 'One small brave step', id: 'Satu langkah berani kecil' },
    desc: { en: 'Approach something you’ve been avoiding by one comfortable step.', id: 'Dekati hal yang kamu hindari, satu langkah yang masih nyaman.' } },
  { key: 'courage-name', track: 'courage', exp: 30,
    title: { en: 'Name what you’re avoiding', id: 'Sebut yang kamu hindari' },
    desc: { en: 'Just write it down. Seeing it on paper makes it smaller.', id: 'Tulis saja. Melihatnya di kertas membuatnya terasa lebih kecil.' } },
  { key: 'courage-ladder', track: 'courage', exp: 45,
    title: { en: 'Build a tiny fear ladder', id: 'Susun tangga rasa takut kecil' },
    desc: { en: 'List five steps from easiest to hardest. Today is only the list.', id: 'Daftar lima langkah dari termudah ke tersulit. Hari ini cukup daftarnya.' } },
  { key: 'courage-ask', track: 'courage', exp: 55,
    title: { en: 'Ask for one thing', id: 'Minta satu hal' },
    desc: { en: 'Make one small request you’d normally talk yourself out of.', id: 'Ajukan satu permintaan kecil yang biasanya kamu urungkan.' } },
]

// Small, fast deterministic PRNG (mulberry32) for a stable per-seed shuffle.
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const hashStr = (s) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export const todaySeed = () => new Date().toISOString().slice(0, 10) // YYYY-MM-DD

// Keywords (EN + ID) that nudge each focus area's weight up when found in a
// user's recent diary + chat text.
const FOCUS_KEYWORDS = {
  grounding: ['anxious', 'anxiety', 'panic', 'overwhelm', 'worry', 'worried', 'scared', 'nervous', 'racing', 'cemas', 'panik', 'khawatir', 'takut', 'gelisah', 'overthinking'],
  connection: ['lonely', 'alone', 'friend', 'people', 'social', 'talk', 'message', 'isolated', 'miss', 'sendiri', 'kesepian', 'teman', 'orang', 'ngobrol', 'kangen'],
  rest: ['tired', 'exhausted', 'burnout', 'burned out', 'sleep', 'insomnia', 'overworked', 'busy', 'lelah', 'capek', 'cape', 'tidur', 'kerja', 'sibuk', 'begadang'],
  body: ['body', 'eat', 'eating', 'food', 'headache', 'sick', 'tense', 'pain', 'ache', 'badan', 'makan', 'sakit', 'tegang', 'pusing', 'lapar'],
  reflection: ['think', 'feel', 'feeling', 'mind', 'memory', 'past', 'regret', 'grateful', 'pikir', 'rasa', 'perasaan', 'kenang', 'masa lalu', 'syukur'],
  courage: ['fear', 'afraid', 'avoid', 'avoiding', 'phobia', 'dread', 'brave', 'takut', 'menghindar', 'hindari', 'fobia', 'berani'],
}

/* Infer focus-area weights from a corpus of recent user text (diary entries +
   AI-chat messages) and mood. Always returns a weight per area (base 1), so a
   brand-new user still gets a balanced spread; signals only tilt the balance,
   never exclude an area entirely. `texts` is an array of strings. */
export function inferFocus(texts = [], mood = 'calm') {
  const weights = Object.fromEntries(FOCUS_AREAS.map((a) => [a, 1]))
  const blob = texts.filter(Boolean).join(' ').toLowerCase()
  if (blob) {
    for (const area of FOCUS_AREAS) {
      for (const w of FOCUS_KEYWORDS[area]) {
        if (blob.includes(w)) weights[area] += 2
      }
    }
  }
  if (mood === 'anxious') { weights.grounding += 3; weights.courage += 1 }
  if (mood === 'calm') { weights.reflection += 1; weights.connection += 1 }
  return weights
}

// Rank focus areas high → low by weight (for the "your focus right now" panel).
export function topFocus(weights, n = 3) {
  return [...FOCUS_AREAS]
    .sort((a, b) => (weights[b] || 0) - (weights[a] || 0))
    .slice(0, n)
}

/* Curate a personalised daily quest set: weighted sampling without replacement,
   biased toward the user's focus areas but always varied. Quests start at 0%
   and reach 100% only when completed — no confusing pre-filled progress. */
export function getDailyQuests(seed = todaySeed(), focus = {}, count = 5) {
  const rand = rng(hashStr(String(seed)))
  const avail = POOL.map((q) => ({ ...q, w: Math.max(0.2, focus[q.track] || 1) }))
  const chosen = []
  const n = Math.min(count, avail.length)

  for (let k = 0; k < n; k++) {
    const total = avail.reduce((s, q) => s + q.w, 0)
    let r = rand() * total
    let idx = 0
    for (; idx < avail.length; idx++) {
      r -= avail[idx].w
      if (r <= 0) break
    }
    idx = Math.min(idx, avail.length - 1)
    chosen.push(avail.splice(idx, 1)[0])
  }

  return chosen.map((q, i) => ({
    id: `${seed}-${q.key}`,
    key: q.key,
    track: q.track,
    title: q.title, // { en, id }
    desc: q.desc, // { en, id }
    exp: q.exp,
    progress: 0,
    done: false,
    order: i,
  }))
}
