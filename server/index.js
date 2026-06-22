/* MindVault API — minimal Node.js reference server (zero dependencies).
 *
 * This is the integration target for src/lib/api.js. It currently serves
 * in-memory seed data via Node's built-in http module so it runs with no
 * install step. To go live, replace the `db` object below with Prisma Client
 * calls against server/prisma/schema.prisma:
 *
 *   import { PrismaClient } from '@prisma/client'
 *   const prisma = new PrismaClient()
 *   // e.g. app GET /quests -> prisma.quest.findMany(...)
 *
 * Run: npm run server   (listens on :4000, proxied from Vite under /api)
 */
import { createServer } from 'node:http'

const PORT = process.env.PORT || 4000

// --- In-memory seed (mirrors src/lib/data.js & Prisma models) ---
const db = {
  me: { name: 'Aria', streak: 7, exp: 1280, level: 6, joinedDays: 42 },
  quests: [
    { id: 'q1', track: 'social', title: 'Say hello to a stranger', desc: 'Exposure step 3 of 8.', progress: 60, exp: 50, done: false },
    { id: 'q2', track: 'phobia', title: 'Look at a spider photo for 30s', desc: 'Systematic desensitisation, level 2.', progress: 40, exp: 40, done: false },
    { id: 'q3', track: 'burnout', title: 'Screen-free wind-down', desc: 'No screens 45 min before bed.', progress: 0, exp: 60, done: false },
  ],
  doctors: [
    { id: 'd1', name: 'Dr. Lena Hartmann', spec: 'Clinical Psychologist · CBT', status: 'available', rating: 4.9, next: 'Today 4:30pm' },
    { id: 'd2', name: 'Dr. Omar Reyes', spec: 'Psychiatrist · Anxiety & Mood', status: 'available', rating: 4.8, next: 'Tomorrow 9:00am' },
  ],
  rewards: [
    { id: 'r1', kind: 'cosmetic', title: 'Astronaut Hat', sub: 'Companion cosmetic', cost: 300 },
    { id: 'r3', kind: 'voucher', title: '20% Teleconsult Voucher', sub: 'Medical discount', cost: 800 },
  ],
  aiReplies: [
    "That sounds heavy. I'm here — what feels loudest right now?",
    'Thank you for trusting me. There’s no rush; can we sit with one piece together?',
  ],
}

const fakeTxHash = () =>
  '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(body))
}

const readBody = (req) =>
  new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch { resolve({}) }
    })
  })

const routes = [
  { m: 'GET', re: /^\/api\/me$/, fn: () => db.me },
  { m: 'GET', re: /^\/api\/quests$/, fn: () => db.quests },
  { m: 'GET', re: /^\/api\/doctors$/, fn: () => db.doctors },
  { m: 'GET', re: /^\/api\/rewards$/, fn: () => db.rewards },
  { m: 'POST', re: /^\/api\/quests\/(.+)\/complete$/, fn: (_b, [id]) => ({ id, done: true }) },
  { m: 'POST', re: /^\/api\/rewards\/(.+)\/redeem$/, fn: (_b, [id]) => ({ id, ok: true }) },
  { m: 'POST', re: /^\/api\/journal$/, fn: (b) => ({ id: crypto.randomUUID(), chainTxHash: fakeTxHash(), ...b, savedAt: Date.now() }) },
  { m: 'POST', re: /^\/api\/chat$/, fn: () => ({ reply: db.aiReplies[Math.floor(Math.random() * db.aiReplies.length)] }) },
  { m: 'POST', re: /^\/api\/consent$/, fn: (b) => ({ hash: fakeTxHash(), contract: '0xMindVaultConsentRegistry', signedAt: new Date().toISOString(), ...b }) },
]

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {})
  const url = req.url.split('?')[0]
  for (const r of routes) {
    if (r.m !== req.method) continue
    const match = url.match(r.re)
    if (match) {
      const body = req.method === 'POST' ? await readBody(req) : null
      return json(res, 200, r.fn(body, match.slice(1)))
    }
  }
  json(res, 404, { error: 'Not found', path: url })
})

server.listen(PORT, () => {
  console.log(`MindVault API listening on http://localhost:${PORT}`)
  console.log('Flip USE_MOCK to false in src/lib/api.js to use this server.')
})
