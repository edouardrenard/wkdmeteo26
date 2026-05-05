'use client'

import { useEffect, useRef } from 'react'
import { Destination } from '@/lib/types'

interface Props {
  results: Destination[]
  loading: boolean
}

function getColor(score: number): string {
  if (score >= 80) return '#10B981'
  if (score >= 65) return '#34D399'
  if (score >= 50) return '#F59E0B'
  if (score >= 35) return '#F97316'
  return '#EF4444'
}

function getOpacity(score: number): number {
  return 0.3 + (score / 100) * 0.5
}

export default function MapView({ results, loading }: Props) {
  const mapRef = useRef<any>(null)
  const layersRef = useRef<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const init = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const L = await import('leaflet' as any)

      if (!mapRef.current && containerRef.current) {
        mapRef.current = L.map(containerRef.current, {
          center: [46.5, 8.0],
          zoom: 4,
          zoomControl: true,
        })
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap © CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(mapRef.current)
      }

      // Supprimer les anciens layers
      layersRef.current.forEach(l => l.remove())
      layersRef.current = []

      if (!results.length) return

      results.forEach(dest => {
        const color = getColor(dest.scoreGlobal)
        const opacity = getOpacity(dest.scoreGlobal)
        const radius = dest.scoreGlobal >= 70 ? 80000 : dest.scoreGlobal >= 50 ? 60000 : 45000

        const meteoIcon = dest.meteo
          ? dest.meteo.soleil >= 6 ? '☀️' : dest.meteo.soleil >= 3 ? '⛅' : '☁️'
          : '?'

        const transportBadge = dest.meilleurTransport === 'train'
          ? `🚆 Train ~${dest.meilleurPrix}€ A/R`
          : `✈️ Vol ~${dest.meilleurPrix}€ A/R`

        const popup = `
          <div style="font-family:system-ui;min-width:230px;padding:4px">
            <div style="font-size:16px;font-weight:700;margin-bottom:2px">${dest.nom}</div>
            <div style="font-size:12px;color:#94A3B8;margin-bottom:8px">${dest.region || dest.pays}</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
              <div style="width:44px;height:44px;border-radius:50%;background:${color}22;border:2px solid ${color};display:flex;flex-direction:column;align-items:center;justify-content:center">
                <span style="font-size:14px;font-weight:700;color:${color};line-height:1">${dest.scoreGlobal}</span>
                <span style="font-size:9px;color:#94A3B8">score</span>
              </div>
              <div>
                <div style="font-size:12px;color:#94A3B8">${dest.meteo ? `${meteoIcon} ${dest.meteo.temp}°C · ${dest.meteo.pluie}mm · ${dest.meteo.soleil}h ☀` : 'Météo N/D'}</div>
                <div style="font-size:12px;color:#CBD5E1;margin-top:2px">${transportBadge}</div>
              </div>
            </div>
            <div style="background:#1E293B;border-radius:8px;padding:8px;margin-bottom:8px">
              ${dest.train !== null ? `
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
                <span style="color:#94A3B8">🚆 Train A/R</span>
                <span style="color:white;font-weight:600">~${dest.train}€ <span style="color:#64748B;font-size:10px">estimé</span></span>
              </div>` : ''}
              ${dest.vol > 0 && dest.vol < 500 ? `
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
                <span style="color:#94A3B8">✈️ Vol A/R</span>
                <span style="color:white;font-weight:600">~${dest.vol}€ <span style="color:${dest.volSource === 'reel' ? '#10B981' : '#64748B'};font-size:10px">${dest.volSource === 'reel' ? '● réel' : '● estimé'}</span></span>
              </div>` : ''}
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
                <span style="color:#94A3B8">🏨 Hôtel (${dest.nbNuits} nuit${dest.nbNuits > 1 ? 's' : ''})</span>
                <span style="color:white;font-weight:600">~${dest.hotelTotal}€</span>
              </div>
              <div style="border-top:1px solid #334155;padding-top:6px;margin-top:4px;display:flex;justify-content:space-between;font-size:13px">
                <span style="color:#CBD5E1;font-weight:600">Total estimé</span>
                <span style="font-weight:700;color:${dest.totalEstime <= 300 ? '#10B981' : dest.totalEstime <= 500 ? '#38BDF8' : '#F59E0B'}">~${dest.totalEstime}€</span>
              </div>
            </div>
            <div style="display:flex;gap:6px;margin-bottom:6px">
              ${dest.meilleurTransport === 'avion' ? `
              <a href="${dest.kiwiUrl}" target="_blank" style="flex:1;display:block;text-align:center;padding:6px;background:#1D4ED833;color:#38BDF8;border:1px solid #1D4ED855;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none">✈️ Vols ↗</a>
              ` : ''}
              ${dest.meilleurTransport === 'train' ? `
              <a href="${dest.omioUrl}" target="_blank" style="flex:1;display:block;text-align:center;padding:6px;background:#16503333;color:#10B981;border:1px solid #16503355;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none">🚆 Trains ↗</a>
              ` : ''}
              <a href="${dest.bookingUrl}" target="_blank" style="flex:1;display:block;text-align:center;padding:6px;background:#92400E33;color:#F59E0B;border:1px solid #92400E55;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none">🏨 Hôtels ↗</a>
            </div>
            <div style="margin-top:6px">
              <div style="display:flex;align-items:center;gap:4px;margin-bottom:3px">
                <span style="font-size:10px;color:#64748B;width:40px">Météo</span>
                <div style="flex:1;height:4px;background:#1E293B;border-radius:2px;overflow:hidden">
                  <div style="width:${dest.scoreMeteo}%;height:100%;background:#10B981;border-radius:2px"></div>
                </div>
                <span style="font-size:10px;color:#64748B">${dest.scoreMeteo}</span>
              </div>
              <div style="display:flex;align-items:center;gap:4px">
                <span style="font-size:10px;color:#64748B;width:40px">Prix</span>
                <div style="flex:1;height:4px;background:#1E293B;border-radius:2px;overflow:hidden">
                  <div style="width:${dest.scorePrix}%;height:100%;background:#38BDF8;border-radius:2px"></div>
                </div>
                <span style="font-size:10px;color:#64748B">${dest.scorePrix}</span>
              </div>
            </div>
          </div>
        `

        // Cercle heatmap
        const circle = L.circle([dest.lat, dest.lon], {
          radius,
          fillColor: color,
          fillOpacity: opacity,
          color: color,
          weight: 1,
          opacity: 0.6,
        })
          .addTo(mapRef.current)
          .bindPopup(popup, { maxWidth: 280, className: 'dark-popup' })

        // Label avec nom + score
        const label = L.divIcon({
          className: '',
          html: `<div style="
            background:${color};
            color:white;
            padding:2px 7px;
            border-radius:12px;
            font-size:11px;
            font-weight:700;
            white-space:nowrap;
            box-shadow:0 2px 6px rgba(0,0,0,0.4);
            border:1px solid rgba(255,255,255,0.3);
            display:flex;
            align-items:center;
            gap:4px;
          ">
            ${dest.meilleurTransport === 'train' ? '🚆' : '✈️'} ${dest.nom} <span style="opacity:0.85">${dest.scoreGlobal}</span>
          </div>`,
          iconAnchor: [0, 0],
        })

        const marker = L.marker([dest.lat, dest.lon], { icon: label })
          .addTo(mapRef.current)
          .bindPopup(popup, { maxWidth: 280, className: 'dark-popup' })

        layersRef.current.push(circle, marker)
      })

      // Ajuster la vue sur les résultats
      if (results.length > 0) {
        const bounds = L.latLngBounds(results.map(d => [d.lat, d.lon]))
        mapRef.current.fitBounds(bounds, { padding: [40, 40] })
      }
    }

    init()
  }, [results])

  return (
    <div className="relative">
      {/* Légende */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-3 text-xs space-y-1.5">
        <p className="font-semibold text-slate-300 mb-2 text-xs">Score météo + prix</p>
        {[
          { color: '#10B981', label: '80+ Excellent' },
          { color: '#34D399', label: '65–79 Très bon' },
          { color: '#F59E0B', label: '50–64 Moyen' },
          { color: '#F97316', label: '35–49 Faible' },
          { color: '#EF4444', label: '< 35 Mauvais' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
        <div className="border-t border-slate-700 pt-1.5 mt-1.5 space-y-1">
          <div className="flex items-center gap-2">
            <span>🚆</span><span className="text-slate-400">Train TGV/OUIGO</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✈️</span><span className="text-slate-400">Vol</span>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="text-3xl mb-3 animate-pulse">🗺️</div>
            <p className="text-sm text-slate-300 font-medium">Récupération météo et prix en cours…</p>
            <p className="text-xs text-slate-500 mt-1">Trains FR + Vols Europe</p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && results.length === 0 && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-400 bg-slate-900/80 px-6 py-4 rounded-xl">
            <p className="text-lg mb-1">Lance une recherche</p>
            <p className="text-sm">La heatmap apparaîtra sur la carte</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden border border-slate-800"
        style={{ height: '650px' }}
      />

      <style>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: #0F172A;
          color: white;
          border: 1px solid #1E293B;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          padding: 4px;
        }
        .dark-popup .leaflet-popup-tip { background: #0F172A; }
        .dark-popup .leaflet-popup-close-button { color: #64748B !important; font-size: 16px !important; }
        .dark-popup .leaflet-popup-content { margin: 8px 10px; }
      `}</style>
    </div>
  )
}
