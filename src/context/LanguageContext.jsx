import { createContext, useContext, useEffect, useState } from 'react'

/* Lightweight i18n. A flat, dot-namespaced dictionary per language plus a
   `t(key, vars)` helper with {var} interpolation. English is the source of
   truth; missing Indonesian keys fall back to English, then to the key itself,
   so the app never shows blanks. The choice persists to localStorage and is
   reflected on <html lang>. Switching is instant — every consumer re-renders.

   The Indonesian copy is written to feel native and warm (everyday words like
   "curhat", "santai") rather than a literal, stiff translation. */

export const LANGUAGES = [
  { id: 'en', label: 'English', tag: 'EN' },
  { id: 'id', label: 'Bahasa Indonesia', tag: 'ID' },
]

const STORAGE_KEY = 'mindvault.lang'

const DICT = {
  en: {
    // Navigation / chrome
    'nav.dashboard': 'Dashboard',
    'nav.journal': 'Diary',
    'nav.quests': 'Rewards',
    'nav.community': 'SafeSpace Community',
    'nav.teleconsult': 'Teleconsult',
    'nav.profile': 'Profile',
    'nav.menu': 'Menu',
    'nav.panic': 'Panic Button',
    'nav.web3': 'Web3 Secured',

    // Topbar
    'top.hi': 'Hi',
    'top.morning': 'Good morning',
    'top.afternoon': 'Good afternoon',
    'top.evening': 'Good evening',
    'top.sub': "{n} days in a row — lovely. Your vault is encrypted and only yours.",
    'top.web3': 'Web3 Secure',
    'top.panic': 'Panic / calm mode',

    // Common
    'common.viewAll': 'Growth & rewards',
    'common.send': 'Send',
    'common.notNow': 'Not now',
    'common.close': 'Close',

    // Dashboard
    'dash.eyebrow': 'Your sanctuary',
    'dash.welcome': 'Welcome back, {name}',
    'dash.e2e': 'End-to-end encrypted',
    'dash.moodAura': 'Mood Aura',
    'dash.weather': "Today's emotional weather",
    'dash.aiAgg': 'AI aggregated',
    'dash.thisWeek': 'This week',
    'dash.dayStreak': 'day streak',
    'dash.streakNote': 'Three more days and you beat your record — no rush, enjoy the ride.',
    'dash.resilience': 'Resilience',
    'dash.exp': 'EXP',
    'dash.openQuests': 'Open quests',
    'dash.lv': 'Lv {n}',
    'dash.focusTitle': "Today's focus",
    'dash.focusSub': 'Tuned to your recent diary & mood',
    'dash.focusEmpty': 'Write a diary entry and your quests start shaping around you.',
    'dash.quoteTitle': 'Quote of the day',
    'dash.dailyQuests': 'Daily Quests',
    'dash.dailyQuestsSub': 'Chosen for you from your recent entries — gentle, never a fixed checklist.',
    'dash.scrollLeft': 'Scroll quests left',
    'dash.scrollRight': 'Scroll quests right',

    // Diary
    'journal.eyebrow': 'Your Diary',
    'journal.title': 'A space that’s only yours',
    'journal.private': 'Private & encrypted',
    'journal.chatMode': 'AI Chat',
    'journal.zenMode': 'Zen Mode',
    'journal.savedTab': 'Your Journals',
    'journal.modeHint': 'Talk it out with a caring AI, or slip into distraction-free writing.',
    'journal.chatPlaceholder': 'Tell me anything you’re feeling…',
    'journal.aiGreeting':
      "Hi Aria, I'm so glad you're here. This space is entirely yours and fully encrypted. What's on your heart today?",
    'journal.encrypting': 'Encrypting & saving to blockchain…',
    'journal.you': 'You',
    'journal.ai': 'MindVault AI',
    'journal.aiStatus': 'Always here for you',
    'journal.detectTitle': 'I can feel this is weighing on you',
    'journal.detectBy': 'Gently noticed by {name}',
    'journal.detectBody':
      "Things sound really heavy right now. Would you like to pause and try a short calming exercise with me? You're in charge — we can stop whenever you want.",
    'journal.breathe': "Yes, let's breathe",

    // Zen
    'zen.words': '{n} words',
    'zen.heading': 'Just write. Nothing else.',
    'zen.placeholder': 'Let the words flow — unguided, unjudged…',
    'zen.idle': 'Your words never leave your vault',
    'zen.saved': 'Anchored · {hash}',
    'zen.exit': 'Exit Zen mode',
    'zen.width': 'Width',
    'zen.widthNarrow': 'Narrow',
    'zen.widthMedium': 'Medium',
    'zen.widthWide': 'Wide',
    'zen.autoformat': 'Auto-format',
    'zen.autoformatHint': 'Continue lists and dashes as you type',
    'zen.save': 'Save entry',
    'zen.savedToast': 'Entry saved to your vault',
    'zen.emptyToast': 'Write something first 🌱',

    // Your Journals (saved entries)
    'saved.title': 'Your journals',
    'saved.empty': 'Nothing saved yet. Your Zen writings are kept right here, just for you.',
    'saved.words': '{n} words',
    'saved.delete': 'Delete',
    'saved.deletedToast': 'Entry deleted',
    'saved.count': '{n} entries in your vault',

    // Growth & Rewards (quests page)
    'quests.eyebrow': 'Your Journey',
    'quests.title': 'Rewards',
    'quests.rewardsHub': 'Rewards Hub · {exp} EXP',
    'quests.focusTitle': 'Your focus right now',
    'quests.focusBody':
      'From your recent diary entries and mood, MindVault is gently steering your quests toward these. Keep writing and it adapts to you.',
    'quests.focusEmpty':
      'Write a few diary entries and your focus areas appear here — your quests follow your real life, not a template.',
    'quests.recurate': 'Ask AI for a fresh set',
    'quests.recurateLeft': '{n} left today',
    'quests.recurateNone': "That's today's limit",
    'quests.recurateHint':
      'Limited on purpose: facing today’s quests gently is the work — swapping them endlessly is just running.',
    'quests.recurateDoneToast': 'A fresh set, curated for you',
    'quests.recurateLimitToast': "Let's stay with today's quests — leaning in is braver than swapping. 🌱",
    'quests.progressTitle': "Today's quests",
    'quests.progressSub': 'Tap to check one off — the same set as your Dashboard.',
    'quests.completedOf': '{done} of {total} done',
    'quests.allDone': 'All done for today — beautifully done. 🌿',
    'quests.goDashboard': 'Go to Dashboard',

    // Quest cards
    'quest.complete': 'Complete',
    'quest.done': 'Complete ✓',

    // Rewards
    'reward.balance': 'Balance',
    'reward.redeem': 'Redeem',
    'reward.locked': 'Locked',
    'reward.redeemedToast': 'Redeemed: {title}',
    'reward.notEnoughToast': 'Not enough EXP yet — keep going!',
    'reward.hubTitle': 'Endgame Rewards Hub',
    // Rewards-focused page
    'reward.balanceTitle': 'Your EXP balance',
    'reward.balanceSub': 'You earn EXP just by showing up — writing, breathing, completing quests. Spend it here, whenever you like. Nothing is pay-to-win.',
    'reward.levelLabel': 'Resilience level',
    'reward.nextUp': 'Next reward within reach',
    'reward.toGo': '{n} EXP to go',
    'reward.ready': 'Ready to redeem',
    'reward.readyCount': '{n} ready to redeem',
    'reward.allReady': 'You can afford everything right now — treat yourself. 🎁',
    'reward.spendTitle': 'Spend your EXP',
    'reward.spendSub': 'Little joys for your companion and real-world perks. Redeem any time.',
    'reward.kind.cosmetic': 'Cosmetic',
    'reward.kind.voucher': 'Voucher',
    'reward.kind.donation': 'Donation',
    'reward.cost': '{n} EXP',
    'reward.progress': '{have} / {cost} EXP',
    'reward.earnTitle': 'Earn more EXP',
    'reward.earnSub': "Complete today's quests to top up your balance — same set as your Dashboard.",

    // Focus areas
    'focus.grounding': 'Calm & Grounding',
    'focus.grounding.hint': 'Settle the nervous system',
    'focus.connection': 'Connection',
    'focus.connection.hint': 'Gentle reaching out',
    'focus.rest': 'Rest & Recovery',
    'focus.rest.hint': 'Sleep and slowing down',
    'focus.body': 'Body Care',
    'focus.body.hint': 'Small kindnesses to the body',
    'focus.reflection': 'Reflection',
    'focus.reflection.hint': 'Notice and process',
    'focus.courage': 'Courage',
    'focus.courage.hint': 'One safe step at a time',

    // EXP toasts
    'exp.gain': '+{n} EXP · {title}',

    // Community
    'community.eyebrow': 'SafeSpace Community',
    'community.title': "You're not alone in this",
    'community.moderated': 'Moderated 24/7',
    'community.anon': 'Fully anonymous',
    'community.postingAs': 'Posting as {handle}',
    'community.identityHidden': 'Your real identity is never shown',
    'community.placeholder': "Share what's on your mind. This is a judgment-free space…",
    'community.share': 'Share anonymously',
    'community.sharedToast': 'Shared anonymously to SafeSpace',
    'community.emptyTitle': 'No posts here yet',
    'community.emptyBody': 'Be the first to share in this space — your words might be exactly what someone needs to read today.',
    'community.support': 'Sending support',
    'community.replies': 'replies',
    'community.guidelinesTitle': 'A safe space, together',
    'community.guidelinesBody': 'Be kind, stay anonymous, and never share identifying details. Trained moderators watch over this space around the clock. If you or someone here is in crisis, the Panic Button and teleconsultation are always one tap away.',
    'community.cat.all': 'All',
    'community.cat.anxiety': 'Anxiety',
    'community.cat.burnout': 'Burnout',
    'community.cat.sleep': 'Sleep',
    'community.cat.wins': 'Small Wins',
    'community.cat.vent': 'Vent Safely',

    // Teleconsult
    'tele.eyebrow': 'Teleconsultation · Web3 Privacy',
    'tele.title': 'Talk to a professional',
    'tele.patientControlled': 'Patient-controlled data',
    'tele.statusAvailable': 'Available',
    'tele.statusBusy': 'In session',
    'tele.statusOffline': 'Offline',
    'tele.next': 'Next: {next}',
    'tele.book': 'Book Session',
    'tele.offlineBtn': 'Offline · back {next}',
    'tele.bookTooltip': 'Book a session with {name}',
    'tele.offlineTooltip': '{name} is offline — back {next}',
    'tele.consentTitle': 'Smart Contract Consent',
    'tele.contractBody': 'Allow {name} to access your AI Journal Summary for the last 7 days via Smart Contract? This grant is recorded on-chain, scoped to this session, and revocable by you at any time.',
    'tele.share7': 'Share 7-day AI summary',
    'tele.decryptedOnly': 'Decrypted only inside the session',
    'tele.sign': 'Sign & Authorize',
    'tele.signing': 'Signing on-chain…',
    'tele.demoNote': '🔒 Demonstrates patient-controlled, cyber-resilient data flow',
    'tele.doneTitle': 'Session booked & consent signed',
    'tele.doneBody': '{name} can now access your AI Journal Summary for the agreed window. You can revoke this on-chain at any time.',
    'tele.scope': 'Scope',
    'tele.scopeDays': 'Last {n} days',
    'tele.noAccess': 'No journal access',
    'tele.contract': 'Contract',
    'tele.tx': 'Tx',
    'tele.done': 'Done',
    'tele.signedToast': 'Consent signed on-chain',

    // Panic / calm mode
    'panic.eyebrow': 'Anti-OVT · You are safe here',
    'panic.title': "Let's ride this out together",
    'panic.tabBreath': 'Box Breathing',
    'panic.tabGround': 'Grounding 5-4-3-2-1',
    'panic.tabDump': 'Brain Dump',
    'panic.steadier': "I'm feeling steadier",
    'panic.exit': 'Exit calm mode',
    'breath.in': 'Breathe in…',
    'breath.hold': 'Hold…',
    'breath.out': 'Breathe out…',
    'breath.note': '4s in · 4 hold · 4 out · 4 hold — {n} round(s) complete',
    'ground.done': 'Done — next',
    'ground.finish': 'Finish',
    'dump.hintPre': 'Type a thought and press ',
    'dump.hintPost': '. Watch it dissolve — let it go.',
    'dump.placeholder': 'Let it out…',
    'cooldown.title': 'You did it.',
    'cooldown.body': "The wave passed, and you stayed with yourself through it. That's real strength. You've earned a Calm Badge and +40 EXP.",
    'cooldown.badge': 'Calm Badge unlocked · +40 EXP',
    'cooldown.return': 'Return, gently',

    // Profile
    'profile.eyebrow': 'Your Profile',
    'profile.title': "{name}'s sanctuary",
    'profile.web3': 'Web3 identity',
    'profile.level': 'Level {lv} · Resilience Builder · Member for {days} days',
    'profile.streakBadge': '{n}-day streak',
    'profile.calmBadges': '4 Calm Badges',
    'profile.companion': 'Companion',
    'profile.companionSub': 'Choose the mascot that keeps you company across MindVault.',
    'profile.nowCompanion': '{name} is now your companion',
    'profile.showCompanion': 'Show companion on every page',
    'profile.hiddenHint': 'Currently hidden — tap to bring it back',
    'profile.shownHint': 'Your mascot floats in the corner, ready to cheer you on',
    'profile.appearance': 'Appearance',
    'profile.appearanceSub': 'Pick the palette that feels safest for you right now.',
    'profile.language': 'Language',
    'profile.languageSub': 'Choose the language for the whole app.',
    'profile.privacy': 'Privacy & Security',
    'profile.privacySub': 'Your data is yours. Always.',
    'profile.vault': 'Encrypted vault',
    'profile.vaultBody':
      '142 diary entries encrypted on-device and anchored to the blockchain. No one can read your vault without your key — not even us.',
    'profile.walletLinked': 'Wallet 0x7a…2b1 linked',
    'profile.dataControl': 'Data control',
    'profile.dataBody': "Export everything, or revoke any doctor's access — all enforced on-chain, instantly.",
    'profile.exportData': 'Export my data',
    'profile.consentLog': 'View consent log',
    'profile.exportToast': 'Vault export prepared',
    'profile.consentToast': 'Consent log opened',
  },

  id: {
    // Navigation / chrome
    'nav.dashboard': 'Beranda',
    'nav.journal': 'Buku Harian',
    'nav.quests': 'Hadiah',
    'nav.community': 'Komunitas SafeSpace',
    'nav.teleconsult': 'Telekonsultasi',
    'nav.profile': 'Profil',
    'nav.menu': 'Menu',
    'nav.panic': 'Tombol Panik',
    'nav.web3': 'Aman Web3',

    // Topbar
    'top.hi': 'Hai',
    'top.morning': 'Selamat pagi',
    'top.afternoon': 'Selamat siang',
    'top.evening': 'Selamat malam',
    'top.sub': 'Sudah {n} hari berturut-turut, keren! Catatanmu terkunci aman, cuma kamu yang bisa buka.',
    'top.web3': 'Aman Web3',
    'top.panic': 'Mode panik / tenang',

    // Common
    'common.viewAll': 'Perkembangan & hadiah',
    'common.send': 'Kirim',
    'common.notNow': 'Nanti dulu',
    'common.close': 'Tutup',

    // Dashboard
    'dash.eyebrow': 'Ruang amanmu',
    'dash.welcome': 'Selamat datang lagi, {name}',
    'dash.e2e': 'Terenkripsi penuh',
    'dash.moodAura': 'Aura Suasana Hati',
    'dash.weather': 'Cuaca hatimu hari ini',
    'dash.aiAgg': 'Dirangkum AI',
    'dash.thisWeek': 'Minggu ini',
    'dash.dayStreak': 'hari berturut',
    'dash.streakNote': 'Tiga hari lagi kamu pecahkan rekormu — santai aja, nikmati prosesnya.',
    'dash.resilience': 'Ketangguhan',
    'dash.exp': 'EXP',
    'dash.openQuests': 'Misi aktif',
    'dash.lv': 'Lv {n}',
    'dash.focusTitle': 'Fokus hari ini',
    'dash.focusSub': 'Menyesuaikan tulisan & suasana hatimu',
    'dash.focusEmpty': 'Coba tulis di buku harian, nanti misimu mulai menyesuaikan dirimu.',
    'dash.quoteTitle': 'Kutipan hari ini',
    'dash.dailyQuests': 'Misi Harian',
    'dash.dailyQuestsSub': 'Dipilih dari tulisanmu belakangan ini — lembut, bukan daftar yang itu-itu saja.',
    'dash.scrollLeft': 'Geser misi ke kiri',
    'dash.scrollRight': 'Geser misi ke kanan',

    // Diary
    'journal.eyebrow': 'Buku Harianmu',
    'journal.title': 'Ruang yang benar-benar milikmu',
    'journal.private': 'Privat & terenkripsi',
    'journal.chatMode': 'Ngobrol AI',
    'journal.zenMode': 'Mode Zen',
    'journal.savedTab': 'Jurnalmu',
    'journal.modeHint': 'Curhat ke AI yang pengertian, atau pindah ke mode menulis bebas tanpa gangguan.',
    'journal.chatPlaceholder': 'Ceritakan apa pun yang sedang kamu rasakan…',
    'journal.aiGreeting':
      'Hai Aria, senang banget kamu di sini. Ruang ini sepenuhnya milikmu dan terenkripsi. Lagi ada apa di hatimu hari ini?',
    'journal.encrypting': 'Mengenkripsi & menyimpan ke blockchain…',
    'journal.you': 'Kamu',
    'journal.ai': 'MindVault AI',
    'journal.aiStatus': 'Selalu ada untukmu',
    'journal.detectTitle': 'Sepertinya ini lagi berat buatmu',
    'journal.detectBy': 'Diperhatikan lembut oleh {name}',
    'journal.detectBody':
      'Kedengarannya lagi berat banget ya. Mau berhenti sebentar dan coba latihan menenangkan bareng aku? Kamu yang pegang kendali — kita bisa berhenti kapan pun kamu mau.',
    'journal.breathe': 'Ya, ayo tarik napas',

    // Zen
    'zen.words': '{n} kata',
    'zen.heading': 'Cukup menulis. Tak perlu yang lain.',
    'zen.placeholder': 'Biarkan kata-kata mengalir — tanpa arah, tanpa dihakimi…',
    'zen.idle': 'Tulisanmu tak pernah keluar dari brankasmu',
    'zen.saved': 'Tersimpan · {hash}',
    'zen.exit': 'Keluar dari Mode Zen',
    'zen.width': 'Lebar',
    'zen.widthNarrow': 'Sempit',
    'zen.widthMedium': 'Sedang',
    'zen.widthWide': 'Lebar',
    'zen.autoformat': 'Format otomatis',
    'zen.autoformatHint': 'Lanjutkan daftar dan tanda hubung sambil mengetik',
    'zen.save': 'Simpan tulisan',
    'zen.savedToast': 'Tulisan tersimpan di brankasmu',
    'zen.emptyToast': 'Tulis sesuatu dulu ya 🌱',

    // Jurnalmu (saved entries)
    'saved.title': 'Jurnalmu',
    'saved.empty': 'Belum ada yang tersimpan. Tulisan Zen-mu disimpan di sini, khusus buatmu.',
    'saved.words': '{n} kata',
    'saved.delete': 'Hapus',
    'saved.deletedToast': 'Tulisan dihapus',
    'saved.count': '{n} tulisan di brankasmu',

    // Tumbuh & Hadiah (quests page)
    'quests.eyebrow': 'Perjalananmu',
    'quests.title': 'Hadiah',
    'quests.rewardsHub': 'Pusat Hadiah · {exp} EXP',
    'quests.focusTitle': 'Yang lagi jadi fokusmu',
    'quests.focusBody':
      'Dari tulisan dan suasana hatimu belakangan ini, MindVault mengarahkan misimu pelan-pelan ke sini. Terus menulis, dan ini ikut menyesuaikan.',
    'quests.focusEmpty':
      'Tulis beberapa entri buku harian, nanti fokusmu muncul di sini — misimu mengikuti hidupmu, bukan template.',
    'quests.recurate': 'Minta set baru dari AI',
    'quests.recurateLeft': 'sisa {n} hari ini',
    'quests.recurateNone': 'Sudah batas hari ini',
    'quests.recurateHint':
      'Sengaja dibatasi: menghadapi misi hari ini pelan-pelan itu intinya — terus ganti-ganti cuma jadi kabur.',
    'quests.recurateDoneToast': 'Set baru, khusus buatmu',
    'quests.recurateLimitToast': 'Coba bertahan dengan misi hari ini ya — menghadapinya lebih berani daripada menukarnya. 🌱',
    'quests.progressTitle': 'Misi hari ini',
    'quests.progressSub': 'Ketuk untuk mencentang — set yang sama dengan Beranda-mu.',
    'quests.completedOf': '{done} dari {total} selesai',
    'quests.allDone': 'Semua selesai hari ini — keren banget. 🌿',
    'quests.goDashboard': 'Ke Beranda',

    // Quest cards
    'quest.complete': 'Selesaikan',
    'quest.done': 'Selesai ✓',

    // Rewards
    'reward.balance': 'Saldo',
    'reward.redeem': 'Tukar',
    'reward.locked': 'Terkunci',
    'reward.redeemedToast': 'Ditukar: {title}',
    'reward.notEnoughToast': 'EXP belum cukup — semangat terus ya!',
    'reward.hubTitle': 'Pusat Hadiah',
    // Halaman fokus hadiah
    'reward.balanceTitle': 'Saldo EXP-mu',
    'reward.balanceSub': 'EXP terkumpul hanya dengan kamu hadir — menulis, bernapas, menyelesaikan misi. Tukarkan di sini kapan pun kamu mau. Tak ada yang bikin curang.',
    'reward.levelLabel': 'Level ketangguhan',
    'reward.nextUp': 'Hadiah terdekat yang bisa diraih',
    'reward.toGo': 'kurang {n} EXP',
    'reward.ready': 'Siap ditukar',
    'reward.readyCount': '{n} siap ditukar',
    'reward.allReady': 'Kamu bisa menukar semuanya sekarang — manjakan dirimu. 🎁',
    'reward.spendTitle': 'Tukarkan EXP-mu',
    'reward.spendSub': 'Kesenangan kecil untuk companion-mu dan manfaat nyata. Tukar kapan saja.',
    'reward.kind.cosmetic': 'Kosmetik',
    'reward.kind.voucher': 'Voucher',
    'reward.kind.donation': 'Donasi',
    'reward.cost': '{n} EXP',
    'reward.progress': '{have} / {cost} EXP',
    'reward.earnTitle': 'Kumpulkan EXP lagi',
    'reward.earnSub': 'Selesaikan misi hari ini untuk menambah saldomu — set yang sama dengan Beranda-mu.',

    // Focus areas
    'focus.grounding': 'Tenang & Membumi',
    'focus.grounding.hint': 'Menenangkan diri',
    'focus.connection': 'Terhubung',
    'focus.connection.hint': 'Menyapa pelan-pelan',
    'focus.rest': 'Istirahat & Pulih',
    'focus.rest.hint': 'Tidur dan melambat',
    'focus.body': 'Rawat Tubuh',
    'focus.body.hint': 'Kebaikan kecil untuk tubuh',
    'focus.reflection': 'Refleksi',
    'focus.reflection.hint': 'Menyadari dan memproses',
    'focus.courage': 'Keberanian',
    'focus.courage.hint': 'Selangkah demi selangkah',

    // EXP toasts
    'exp.gain': '+{n} EXP · {title}',

    // Community
    'community.eyebrow': 'Komunitas SafeSpace',
    'community.title': 'Kamu tidak sendirian',
    'community.moderated': 'Dimoderasi 24/7',
    'community.anon': 'Sepenuhnya anonim',
    'community.postingAs': 'Memposting sebagai {handle}',
    'community.identityHidden': 'Identitas aslimu tak pernah ditampilkan',
    'community.placeholder': 'Ceritakan apa yang ada di pikiranmu. Ini ruang tanpa penghakiman…',
    'community.share': 'Bagikan anonim',
    'community.sharedToast': 'Dibagikan anonim ke SafeSpace',
    'community.emptyTitle': 'Belum ada postingan di sini',
    'community.emptyBody': 'Jadilah yang pertama berbagi di ruang ini — kata-katamu mungkin persis yang dibutuhkan seseorang hari ini.',
    'community.support': 'Mengirim dukungan',
    'community.replies': 'balasan',
    'community.guidelinesTitle': 'Ruang aman, bersama',
    'community.guidelinesBody': 'Bersikaplah baik, tetap anonim, dan jangan pernah membagikan detail identitas. Moderator terlatih menjaga ruang ini sepanjang waktu. Jika kamu atau seseorang di sini sedang krisis, Tombol Panik dan telekonsultasi selalu sejauh satu ketukan.',
    'community.cat.all': 'Semua',
    'community.cat.anxiety': 'Kecemasan',
    'community.cat.burnout': 'Kelelahan',
    'community.cat.sleep': 'Tidur',
    'community.cat.wins': 'Kemenangan Kecil',
    'community.cat.vent': 'Melepas Uneg-uneg',

    // Teleconsult
    'tele.eyebrow': 'Telekonsultasi · Privasi Web3',
    'tele.title': 'Bicara dengan profesional',
    'tele.patientControlled': 'Data dikendalikan pasien',
    'tele.statusAvailable': 'Tersedia',
    'tele.statusBusy': 'Sedang sesi',
    'tele.statusOffline': 'Luring',
    'tele.next': 'Berikutnya: {next}',
    'tele.book': 'Pesan Sesi',
    'tele.offlineBtn': 'Luring · kembali {next}',
    'tele.bookTooltip': 'Pesan sesi dengan {name}',
    'tele.offlineTooltip': '{name} sedang luring — kembali {next}',
    'tele.consentTitle': 'Persetujuan Smart Contract',
    'tele.contractBody': 'Izinkan {name} mengakses Ringkasan Jurnal AI-mu untuk 7 hari terakhir lewat Smart Contract? Pemberian ini dicatat on-chain, terbatas pada sesi ini, dan bisa kamu cabut kapan saja.',
    'tele.share7': 'Bagikan ringkasan AI 7 hari',
    'tele.decryptedOnly': 'Hanya didekripsi di dalam sesi',
    'tele.sign': 'Tandatangani & Izinkan',
    'tele.signing': 'Menandatangani on-chain…',
    'tele.demoNote': '🔒 Menunjukkan alur data yang dikendalikan pasien dan tahan siber',
    'tele.doneTitle': 'Sesi dipesan & persetujuan ditandatangani',
    'tele.doneBody': '{name} kini bisa mengakses Ringkasan Jurnal AI-mu selama jangka yang disepakati. Kamu bisa mencabutnya on-chain kapan saja.',
    'tele.scope': 'Cakupan',
    'tele.scopeDays': '{n} hari terakhir',
    'tele.noAccess': 'Tanpa akses jurnal',
    'tele.contract': 'Kontrak',
    'tele.tx': 'Tx',
    'tele.done': 'Selesai',
    'tele.signedToast': 'Persetujuan ditandatangani on-chain',

    // Panic / calm mode
    'panic.eyebrow': 'Anti-OVT · Kamu aman di sini',
    'panic.title': 'Mari lewati ini bersama',
    'panic.tabBreath': 'Pernapasan Kotak',
    'panic.tabGround': 'Membumi 5-4-3-2-1',
    'panic.tabDump': 'Tumpah Pikiran',
    'panic.steadier': 'Aku mulai lebih tenang',
    'panic.exit': 'Keluar mode tenang',
    'breath.in': 'Tarik napas…',
    'breath.hold': 'Tahan…',
    'breath.out': 'Embuskan…',
    'breath.note': '4 dtk tarik · 4 tahan · 4 embus · 4 tahan — {n} putaran selesai',
    'ground.done': 'Selesai — lanjut',
    'ground.finish': 'Selesai',
    'dump.hintPre': 'Ketik sebuah pikiran lalu tekan ',
    'dump.hintPost': '. Lihat ia memudar — lepaskan.',
    'dump.placeholder': 'Lepaskan saja…',
    'cooldown.title': 'Kamu berhasil.',
    'cooldown.body': 'Gelombang itu berlalu, dan kamu bertahan melaluinya. Itu kekuatan sejati. Kamu mendapat Lencana Tenang dan +40 EXP.',
    'cooldown.badge': 'Lencana Tenang terbuka · +40 EXP',
    'cooldown.return': 'Kembali, perlahan',

    // Profile
    'profile.eyebrow': 'Profilmu',
    'profile.title': 'Ruang aman {name}',
    'profile.web3': 'Identitas Web3',
    'profile.level': 'Level {lv} · Pembangun Ketangguhan · Bergabung {days} hari',
    'profile.streakBadge': '{n} hari berturut',
    'profile.calmBadges': '4 Lencana Tenang',
    'profile.companion': 'Pendamping',
    'profile.companionSub': 'Pilih maskot yang menemanimu di seluruh MindVault.',
    'profile.nowCompanion': '{name} sekarang jadi pendampingmu',
    'profile.showCompanion': 'Tampilkan pendamping di setiap halaman',
    'profile.hiddenHint': 'Lagi disembunyikan — ketuk untuk memunculkannya lagi',
    'profile.shownHint': 'Maskotmu melayang di pojok, siap menyemangatimu',
    'profile.appearance': 'Tampilan',
    'profile.appearanceSub': 'Pilih warna yang paling bikin kamu nyaman saat ini.',
    'profile.language': 'Bahasa',
    'profile.languageSub': 'Pilih bahasa untuk seluruh aplikasi.',
    'profile.privacy': 'Privasi & Keamanan',
    'profile.privacySub': 'Datamu milikmu. Selalu.',
    'profile.vault': 'Brankas terenkripsi',
    'profile.vaultBody':
      '142 entri buku harian dienkripsi di perangkatmu dan ditambatkan ke blockchain. Tak seorang pun bisa membacanya tanpa kuncimu — kami pun tidak.',
    'profile.walletLinked': 'Dompet 0x7a…2b1 tertaut',
    'profile.dataControl': 'Kontrol data',
    'profile.dataBody': 'Ekspor semuanya, atau cabut akses dokter mana pun — semua berlaku on-chain, seketika.',
    'profile.exportData': 'Ekspor dataku',
    'profile.consentLog': 'Lihat log persetujuan',
    'profile.exportToast': 'Ekspor brankas disiapkan',
    'profile.consentToast': 'Log persetujuan dibuka',
  },
}

const interpolate = (str, vars) =>
  vars ? str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`)) : str

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      return v && DICT[v] ? v : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* ignore */ }
  }, [lang])

  const setLang = (id) => { if (DICT[id]) setLangState(id) }

  const t = (key, vars) => {
    const table = DICT[lang] || DICT.en
    const str = table[key] ?? DICT.en[key] ?? key
    return interpolate(str, vars)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useI18n = () => useContext(LanguageContext)
