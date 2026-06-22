/* API client layer.
   The prototype runs entirely on local seed data, but every call is funneled
   through this module so that swapping to the live Node.js + Prisma backend is
   a one-line change per endpoint (flip USE_MOCK to false once server/ is wired
   to a database). The function signatures already match the REST routes defined
   in server/index.js. */

import * as seed from './data.js'
import { getDailyQuests } from './quests.js'

const USE_MOCK = true
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function get(path, fallback) {
  if (USE_MOCK) {
    await wait(120)
    return fallback
  }
  const res = await fetch(`/api${path}`)
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`)
  return res.json()
}

async function post(path, body, fallback) {
  if (USE_MOCK) {
    await wait(180)
    return fallback
  }
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`)
  return res.json()
}

export const api = {
  getProfile: () => get('/me', seed.user),
  getQuests: () => get('/quests', getDailyQuests()),
  completeQuest: (id) => post(`/quests/${id}/complete`, {}, { id, done: true }),
  getDoctors: () => get('/doctors', seed.doctors),
  getRewards: () => get('/rewards', seed.rewards),
  redeemReward: (id) => post(`/rewards/${id}/redeem`, {}, { id, ok: true }),
  saveJournal: (entry) =>
    post('/journal', entry, { id: crypto.randomUUID(), ...entry, savedAt: Date.now() }),
  sendChat: (message) =>
    post('/chat', { message }, {
      reply: seed.aiReplies[Math.floor(Math.random() * seed.aiReplies.length)],
    }),
}
