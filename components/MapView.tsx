'use client'

import { useEffect, useRef, useState } from 'react'
import { Destination } from '@/lib/types'

interface Props {
  results: Destination[]
  loading: boolean
}

function scoreToColor(score: number): string {
  if (score >= 80) return '#10B981'
  if (score >= 65) return '#34D399'
  if (score >= 50) return '#F59E0B'
  if (score >= 35) return '#F97316'
  return '#EF4444'
}

function tIcon(type: string): string {
  return type === 'train' ? '🚆' : type === 'voiture' ? '🚗' : '✈️'
}

function tLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function buildPopup(dest: Destination): string {
  const color = scoreToColor(dest.scoreGlobal)
  const m = dest.meteo
  const mi = m ? (m.soleil >= 6 ? '☀️' : m.soleil >= 3 ? '⛅' : '☁️') : '?'
  const meteoStr = m ? mi + ' ' + m.temp + '°C · ' + m.pluie + 'mm pluie · ' + m.soleil + 'h soleil' : 'Météo indisponible'
  const tc = dest.totalEstime <= 200 ? '#10B981' : dest.totalEstime <= 400 ? '#38BDF8' : '#F59E0B'

  const t0 = dest.transports[0]
  const t1 = dest.transports[1]
  const t2 = dest.transports[2]

  const tRow = (t: typeof t0) => t ? '<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px"><span style="color:#94A3B8">' + tIcon(t.type) + ' ' + tLabel(t.type) + ' A/R' + (t.duree ? ' (' + t.duree + ')' : '') + '</span><span style="color:white;font-weight:600">~' + t.prixAR + '€ <span style="font-size:10px;color:' + (t.source === 'reel' ? '#10B981' : '#64748B') + '">' + (t.source === 'reel' ? '● réel' : '● estimé') + '</span></span></div>' : ''

  const tBtn = (t: typeof t0) => t ? '<a href="' + t.lien + '" target="_blank" style="flex:1;display:block;text-align:center;padding:6px;background:' + (t.type === 'train' ? '#16503333' : t.type === 'voiture' ? '#1E3A5F33' : '#1D4ED833') + ';color:' + (t.type === 'train' ? '#10B981' : t.type === 'voiture' ? '#60A5FA' : '#38BDF8') + ';border:1px solid ' + (t.type === 'train' ? '#16503355' : t.type === 'voiture' ? '#1E3A5F55' : '#1D4ED855') + ';border-radius:6px;font-size:11px;font-weight:600;text-decoration:none">' + tIcon(t.type) + ' ' + tLabel(t.type) + ' ↗</a>' : ''

  return '<div style="font-family:system-ui;min-width:240px;color:white">' +
    '<div style="font-size:15px;font-weight:700;margin-bottom:2px">' + tIcon(dest.meilleurTransport.type) + ' ' + dest.nom + '</div>' +
    '<div style="font-size:12px;color:#94A3B8;margin-bottom:10px">' + dest.region + '</div>' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
      '<div style="width:46px;height:46px;border-radius:50%;background:' + color + '25;border:2px solid ' + color + ';display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">' +
        '<span style="font-size:15px;font-weight:700;color:' + color + ';line-height:1">' + dest.scoreGlobal + '</span>' +
        '<span style="font-size:9px;color:#94A3B8;margin-top:1px">score</span>' +
      '</div>' +
      '<div style="font-size:12px;color:#CBD5E1">' + meteoStr + '</div>' +
    '</div>' +
    '<div style="background:#1E293B;border-radius:8px;padding:8px;margin-bottom:8px">' +
      tRow(t0) + tRow(t1) + tRow(t2) +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px"><span style="color:#94A3B8">🏨 Hôtel (~' + dest.hotelNuit + '€/nuit)</span><span style="color:white;font-weight:600">~' + dest.hotelTotal + '€</span></div>' +
      '<div style="border-top:1px solid #334155;padding-top:6px;margin-top:4px;display:flex;justify-content:space-between;font-size:13px"><span style="color:#CBD5E1;font-weight:600">Total estimé</span><span style="font-weight:700;color:' + tc + '">~' + dest.totalEstime + '€</span></div>' +
    '</div>' +
    '<div style="display:flex;gap:6px">' + tBtn(t0) + tBtn(t1) + tBtn(t2) +
      '<a href="' + dest.bookingUrl + '" target="_blank" style="flex:1;display:block;text-align:center;padding:6px;background:#92400E33;color:#F59E0B;border:1px solid #92400E55;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none">🏨 Hôtel ↗</a>' +
    '</div>' +
  '</div>'
}

export default function MapView({ results, loading }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const layersRef = useRef<any[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current) return
    const init = async () => {
      if (!document.getElementById('leaflet-css')) {
        const cssLink = document.createElement('link')
        cssLink.setAttribute('id', 'leaflet-css')
        cssLink.setAttribute('rel', 'stylesheet')
        cssLink.setAttribute('href', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')
        document.head.appendChild(cssLink)
        await new Promise(r => setTimeout(r, 100))
      }
      if (!containerRef.current) return
      const Lmod = await import('leaflet')
      const Leaf: any = Lmod.default
      delete Leaf.Icon.Default.prototype._getIconUrl
      Leaf.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      const mapInstance = Leaf.map(containerRef.current, {
        center: [46.0, 8.0],
        zoom: 4,
        zoomControl: true,
        preferCanvas: true,
      })
      mapRef.current = mapInstance
      Leaf.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(mapInstance)
      setReady(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    const update = async () => {
      const Lmod = await import('leaflet')
      const Leaf: any = Lmod.default
      layersRef.current.forEach(l => { try { mapRef.current.removeLayer(l) } catch {} })
      layersRef.current = []
      if (!results.length) return
      results.forEach(dest => {
        const color = scoreToColor(dest.scoreGlobal)
        const radius = 30000 + dest.scoreGlobal * 800
        const popup = buildPopup(dest)
        const coords: [number, number] = [dest.lat, dest.lon]

        const circle = Leaf.circle(coords, {
          radius,
          fillColor: color,
          fillOpacity: 0.25 + (dest.scoreGlobal / 100) * 0.45,
          color,
          weight: 1.5,
          opacity: 0.7,
        })
        circle.addTo(mapRef.current)
        circle.bindPopup(popup, { maxWidth: 300, className: 'dark-popup' })
        layersRef.current.push(circle)

        const labelHtml = '<div style="background:' + color + ';color:white;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.25)">' + tIcon(dest.meilleurTransport.type) + ' ' + dest.nom + ' ' + dest.scoreGlobal + '</div>'
        const labelIcon = Leaf.divIcon({
          className: '',
          html: labelHtml,
          iconAnchor: [0, 0],
        })
        const marker = Leaf.marker(coords, { icon: labelIcon, zIndexOffset: 100 })
        marker.addTo(mapRef.current)
        marker.bindPopup(popup, { maxWidth: 300, className: 'dark-popup' })
        layersRef.current.push(marker)
      })
      try {
        const coordsList: [number, number][] = results.map(d => [d.lat, d.lon])
        const bounds = Leaf.latLngBounds(coordsList)
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 })
      } catch {}
    }
    update()
  }, [results, ready])

  return (
    <div className="relative w-full">
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl p-3 text-xs">
        <p className="font-semibold text-slate-200 mb-2">Score météo + prix</p>
        {[
          { color: '#10B981', label: '80+ Excellent' },
          { color: '#34D399', label: '65–79 Très bon' },
          { color: '#F59E0B', label: '50–64 Correct' },
          { color: '#F97316', label: '35–49 Faible' },
          { color: '#EF4444', label: '< 35 Mauvais' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
        <div className="border-t border-slate-700 mt-2 pt-2 text-slate-400">
          🚆 Train · 🚗 Voiture · ✈️ Vol
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[1000] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">🗺️</div>
            <p className="text-white font-medium">Chargement météo et prix…</p>
            <p className="text-slate-400 text-sm mt-1">Train · Voiture · Hôtels · Météo</p>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-400 bg-slate-900/90 px-8 py-5 rounded-2xl border border-slate-800">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="font-medium mb-1">Lance une recherche</p>
            <p className="text-sm">La heatmap s&apos;affichera ici</p>
          </div>
        </div>
      )}

      <div ref={containerRef} className="w-full rounded-2xl border border-slate-800" style={{ height: '650px' }} />

      <style>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: #0F172A !important;
          color: white !important;
          border: 1px solid #334155 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.7) !important;
        }
        .dark-popup .leaflet-popup-tip { background: #0F172A !important; }
        .dark-popup .leaflet-popup-close-button { color: #94A3B8 !important; font-size: 18px !important; top: 6px !important; right: 8px !important; }
        .dark-popup .leaflet-popup-content { margin: 12px 14px !important; }
      `}</style>
    </div>
  )
}
