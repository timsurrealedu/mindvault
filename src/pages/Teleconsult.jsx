import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import Modal from '../components/Modal.jsx'
import { doctors } from '../lib/data.js'
import { signConsent, shortHash } from '../lib/web3.js'
import { IconDoctor, IconClock, IconStar, IconShield, IconLock, IconCheck } from '../components/Icons.jsx'

const STATUS = {
  available: { cls: 'badge--available', key: 'tele.statusAvailable' },
  busy: { cls: 'badge--busy', key: 'tele.statusBusy' },
  offline: { cls: 'badge--offline', key: 'tele.statusOffline' },
}
const initials = (name) => name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('')

export default function Teleconsult() {
  const { toast } = useApp()
  const { t } = useI18n()
  const [booking, setBooking] = useState(null) // selected doctor
  const [consent, setConsent] = useState(true)
  const [phase, setPhase] = useState('review') // review | signing | done
  const [receipt, setReceipt] = useState(null)

  const openBooking = (doc) => {
    setBooking(doc)
    setConsent(true)
    setPhase('review')
    setReceipt(null)
  }

  const sign = async () => {
    setPhase('signing')
    const res = await signConsent({ doctor: booking.name, scopeDays: consent ? 7 : 0 })
    setReceipt(res)
    setPhase('done')
    toast(t('tele.signedToast'), 'shield')
  }

  return (
    <div className="view">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{t('tele.eyebrow')}</div>
          <h1 style={{ fontSize: '1.7rem' }}>{t('tele.title')}</h1>
        </div>
        <span className="badge badge--web3"><IconShield size={14} /> {t('tele.patientControlled')}</span>
      </div>

      <div className="grid grid-3">
        {doctors.map((doc) => {
          const s = STATUS[doc.status]
          const offline = doc.status === 'offline'
          return (
            <div className="card doctor-card card--hover" key={doc.id}>
              <div className="doctor-top">
                <div className="avatar">{initials(doc.name)}</div>
                <div className="flex-1">
                  <div className="doctor-name">{doc.name}</div>
                  <div className="doctor-spec">{doc.spec}</div>
                </div>
              </div>
              <div className="row between">
                <span className={`badge ${s.cls}`}>{t(s.key)}</span>
                <span className="badge"><IconStar size={12} /> {doc.rating}</span>
              </div>
              <div className="doctor-meta">
                <span className="row gap-2"><IconClock size={14} /> {t('tele.next', { next: doc.next })}</span>
              </div>
              <button
                className="btn btn--primary btn--block"
                onClick={() => openBooking(doc)}
                disabled={offline}
                title={offline ? t('tele.offlineTooltip', { name: doc.name, next: doc.next }) : t('tele.bookTooltip', { name: doc.name })}
                style={offline ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              >
                <IconDoctor size={16} /> {offline ? t('tele.offlineBtn', { next: doc.next }) : t('tele.book')}
              </button>
            </div>
          )
        })}
      </div>

      {booking && (
        <Modal onClose={() => setBooking(null)} width={500}>
          {phase === 'done' ? (
            <div className="text-c col" style={{ alignItems: 'center', gap: 'var(--space-4)' }}>
              <div className="modal__icon" style={{ width: 56, height: 56, background: 'var(--success-soft)', color: 'var(--success)' }}>
                <IconCheck size={28} />
              </div>
              <h3>{t('tele.doneTitle')}</h3>
              <p className="muted">{t('tele.doneBody', { name: booking.name })}</p>
              <div className="contract-box" style={{ width: '100%', textAlign: 'left' }}>
                <div className="row between"><span>{t('tele.scope')}</span><strong>{receipt.scopeDays ? t('tele.scopeDays', { n: receipt.scopeDays }) : t('tele.noAccess')}</strong></div>
                <div className="row between mt-2"><span>{t('tele.contract')}</span><strong>{receipt.contract}</strong></div>
                <div className="row between mt-2"><span>{t('tele.tx')}</span><span className="sign-meta">{shortHash(receipt.hash)}</span></div>
              </div>
              <button className="btn btn--primary btn--block" onClick={() => setBooking(null)}>{t('tele.done')}</button>
            </div>
          ) : (
            <>
              <div className="modal__head">
                <div className="modal__icon"><IconLock size={22} /></div>
                <div>
                  <h3>{t('tele.consentTitle')}</h3>
                  <span className="muted" style={{ fontSize: '0.85rem' }}>{booking.name} · {booking.next}</span>
                </div>
              </div>

              <div className="contract-box">{t('tele.contractBody', { name: booking.name })}</div>

              <div className="consent-row mt-4">
                <div className="col">
                  <strong style={{ color: 'var(--text-strong)' }}>{t('tele.share7')}</strong>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>{t('tele.decryptedOnly')}</span>
                </div>
                <button
                  className={`switch ${consent ? 'on' : ''}`}
                  onClick={() => setConsent((c) => !c)}
                  aria-pressed={consent}
                  aria-label={t('tele.share7')}
                />
              </div>

              <button
                className="btn btn--primary btn--block btn--lg mt-6"
                onClick={sign}
                disabled={phase === 'signing'}
              >
                {phase === 'signing' ? (
                  <span className="row gap-2"><span className="typing" style={{ filter: 'invert(1)' }}><span /><span /><span /></span> {t('tele.signing')}</span>
                ) : (
                  <><IconShield size={18} /> {t('tele.sign')}</>
                )}
              </button>
              <p className="muted text-c mt-2" style={{ fontSize: '0.76rem' }}>
                {t('tele.demoNote')}
              </p>
            </>
          )}
        </Modal>
      )}
    </div>
  )
}
