'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const GA_ID = 'G-75C437WTEL'

export default function Analytics() {
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('cookie-consent')
      if (saved === 'accepted') setConsent('accepted')
      else if (saved === 'rejected') setConsent('rejected')
    } catch {}

    const handler = () => {
      try {
        const saved = localStorage.getItem('cookie-consent')
        if (saved === 'accepted') setConsent('accepted')
        else if (saved === 'rejected') setConsent('rejected')
      } catch {}
    }
    window.addEventListener('storage', handler)
    window.addEventListener('cookie-consent-changed', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('cookie-consent-changed', handler)
    }
  }, [])

  if (consent !== 'accepted') return null

  return (
    <>
      <Script
        src={'https://www.googletagmanager.com/gtag/js?id=' + GA_ID}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  )
}
