'use client'

import { useEffect, useState } from 'react'

type Consent = 'accepted' | 'rejected' | null

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('cookie-consent') as Consent
      if (saved === 'accepted' || saved === 'rejected') {
        setConsent(saved)
        if (saved === 'accepted') enableAnalytics()
      } else {
        setShow(true)
      }
    } catch {
      setShow(true)
    }
  }, [])

  const enableAnalytics = () => {
    if (typeof window === 'undefined') return
    const w = window as any
    if (w.gtag) {
      w.gtag('consent', 'update', {
        analytics_storage: 'granted',
      })
    }
  }

  const accept = () => {
    try { localStorage.setItem('cookie-consent', 'accepted') } catch {}
    setConsent('accepted')
    setShow(false)
    enableAnalytics()
  }

  const reject = () => {
    try { localStorage.setItem('cookie-consent', 'rejected') } catch {}
    setConsent('rejected')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[2000] bg-slate-900 border-t border-slate-700 shadow-2xl">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-white font-medium mb-1">🍪 Ce site utilise des cookies de mesure d&apos;audience</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Avec votre accord, j&apos;utilise Google Analytics pour comprendre comment le site est utilisé.
            Aucun cookie publicitaire. Vos données restent confidentielles.{' '}
            <a href="/confidentialite" className="text-sky-400 hover:underline">En savoir plus</a>
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={reject}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="flex-1 md:flex-none px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
