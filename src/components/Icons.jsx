/* Lightweight inline SVG icon set — no external icon dependency.
   Each icon inherits `currentColor` and accepts a `size` prop. */
const I = ({ size = 20, children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)

export const IconDashboard = (p) => (
  <I {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></I>
)
export const IconJournal = (p) => (
  <I {...p}><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z" /><path d="M8 7h8M8 11h6" /></I>
)
export const IconQuest = (p) => (
  <I {...p}><circle cx="12" cy="8" r="5" /><path d="m8.5 12.5-1.5 8 5-3 5 3-1.5-8" /></I>
)
export const IconDoctor = (p) => (
  <I {...p}><path d="M8 2v4a4 4 0 0 0 8 0V2" /><path d="M6 6v2a6 6 0 0 0 12 0V6" /><path d="M12 14v3a5 5 0 0 0 5 5" /><circle cx="18" cy="20" r="2" /></I>
)
export const IconRewards = (p) => (
  <I {...p}><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" rx="1" /><path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></I>
)
export const IconLifebuoy = (p) => (
  <I {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="m4.9 4.9 4.2 4.2M14.9 14.9l4.2 4.2M14.9 9.1l4.2-4.2M9.1 14.9l-4.2 4.2" /></I>
)
export const IconShield = (p) => (
  <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></I>
)
export const IconClose = (p) => (<I {...p}><path d="M18 6 6 18M6 6l12 12" /></I>)
export const IconSend = (p) => (<I {...p}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></I>)
export const IconCheck = (p) => (<I {...p}><path d="M20 6 9 17l-5-5" /></I>)
export const IconMenu = (p) => (<I {...p}><path d="M4 6h16M4 12h16M4 18h16" /></I>)
export const IconPalette = (p) => (
  <I {...p}><circle cx="13.5" cy="6.5" r=".8" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".8" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".8" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".8" fill="currentColor" /><path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .9-1.5 2-1.5h2.5a4 4 0 0 0 4-4C21 5.6 17 2 12 2z" /></I>
)
export const IconSparkle = (p) => (<I {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></I>)
export const IconWind = (p) => (<I {...p}><path d="M2 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M2 16h10a3 3 0 1 1-3 3" /></I>)
export const IconAnchor = (p) => (<I {...p}><circle cx="12" cy="5" r="2.5" /><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3" /></I>)
export const IconTrash2 = (p) => (<I {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></I>)
export const IconClock = (p) => (<I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>)
export const IconStar = (p) => (<I {...p}><path d="m12 2 2.9 6.3 6.8.7-5 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7-5-4.6 6.8-.7z" /></I>)
export const IconHeart = (p) => (<I {...p}><path d="M19 5.7a4.5 4.5 0 0 0-6.4 0L12 6.3l-.6-.6A4.5 4.5 0 0 0 5 12.1l6.4 6.6.6.6.6-.6L19 12a4.5 4.5 0 0 0 0-6.3z" /></I>)
export const IconGift = (p) => (<I {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v9h14v-9M12 8S11 2 8 2a2.5 2.5 0 0 0 0 5zM12 8s1-6 4-6a2.5 2.5 0 0 1 0 5z" /></I>)
export const IconPaw = (p) => (<I {...p}><circle cx="7" cy="8" r="2" /><circle cx="17" cy="8" r="2" /><circle cx="4.5" cy="13" r="1.6" /><circle cx="19.5" cy="13" r="1.6" /><path d="M12 12c-2.5 0-4.5 2-4.5 4.2 0 1.6 1.3 2.3 2.6 2.3.9 0 1.3-.4 1.9-.4s1 .4 1.9.4c1.3 0 2.6-.7 2.6-2.3C16.5 14 14.5 12 12 12z" /></I>)
export const IconUsers = (p) => (<I {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2 21a7 7 0 0 1 14 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-5-6.7" /></I>)
export const IconLock = (p) => (<I {...p}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></I>)
export const IconUser = (p) => (<I {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></I>)
export const IconMessage = (p) => (<I {...p}><path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.7L3 21l1.8-5.8A8.5 8.5 0 1 1 21 11.5z" /></I>)
export const IconChevronLeft = (p) => (<I {...p}><path d="m15 18-6-6 6-6" /></I>)
export const IconChevronRight = (p) => (<I {...p}><path d="m9 18 6-6-6-6" /></I>)
export const IconRefresh = (p) => (<I {...p}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v5h-5" /></I>)
export const IconEye = (p) => (<I {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></I>)
export const IconEyeOff = (p) => (<I {...p}><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.2M6.6 6.6A18 18 0 0 0 2 11s3.5 7 10 7a10.9 10.9 0 0 0 4.1-.8M3 3l18 18M9.5 9.5a3 3 0 0 0 4.2 4.2" /></I>)
export const IconFlag = (p) => (<I {...p}><path d="M4 21V4M4 4l11 .5L13 8l3 3-12 .5" /></I>)
export const IconHeartHands = (p) => (<I {...p}><path d="M12 9a3 3 0 0 0-5-2.2A3 3 0 0 0 7 11l5 4 5-4a3 3 0 0 0 0-4.2A3 3 0 0 0 12 9z" /></I>)
export const IconLeaf = (p) => (<I {...p}><path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9 0 11-4 16-9 16zM4 20c4-7 8-9 12-10" /></I>)
export const IconGlobe = (p) => (<I {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></I>)
export const IconBook = (p) => (<I {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5" /><path d="M19 17H6" /></I>)
export const IconList = (p) => (<I {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></I>)
