/* Web3 / blockchain presentation helpers.
   These simulate the on-chain interactions (tx hashes, signatures) used
   throughout the prototype to convey the cyber-resilience / patient-owned
   data story. In production these would be replaced by real wallet + smart
   contract calls. */

const HEX = '0123456789abcdef'
const randHex = (n) =>
  Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join('')

/** Fake transaction hash, e.g. 0x9f3c…a2b1 */
export const fakeTxHash = () => `0x${randHex(64)}`
export const shortHash = (hash) => `${hash.slice(0, 8)}…${hash.slice(-6)}`

/** Simulate broadcasting an encrypted record to the chain. */
export function anchorToChain(payload) {
  const hash = fakeTxHash()
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ hash, block: 18_000_000 + Math.floor(Math.random() * 90000), payload }),
      650 + Math.random() * 500
    )
  })
}

/** Simulate signing a smart-contract consent grant. */
export function signConsent({ doctor, scopeDays }) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          hash: fakeTxHash(),
          signedAt: new Date().toISOString(),
          doctor,
          scopeDays,
          contract: '0xMindVaultConsentRegistry',
        }),
      900 + Math.random() * 600
    )
  })
}
