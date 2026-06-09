'use client'

import { Destination } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'

interface Props {
  results: Destination[]
  loading: boolean
}

declare global { interface Window { L: any } }

function colorFromScore(score: number): string {
  if (score >= 80) return '#15803D'
  if (score >= 70) return '#22C55E'
  if (score >= 60) return '#84CC16'
  if (score >= 50) return '#EAB308'
  if (score >= 40) return '#F97316'
  if (score >= 30) return '#DC2626'
  return '#991B1B'
}

function fillFromScore(score: number): string {
  if (score >= 80) return '#BBF7D0'
  if (score >= 70) return '#D9F99D'
  if (score >= 60) return '#FEF08A'
  if (score >= 50) return '#FED7AA'
  if (score >= 40) return '#FCA5A5'
  return '#F87171'
}

function meteoIcon(meteo: any): string {
  if (!meteo) return '❓'
  if (meteo.pluie > 2) return '🌧️'
  if (meteo.pluie > 0.3) return '🌦️'
  if (meteo.soleil >= 8) return '☀️'
  if (meteo.soleil >= 5) return '🌤️'
  return '☁️'
}

export default function MapView({ results, loading }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const layersRef = useRef<any[]>([])
  const [legendOpen, setLegendOpen] = useState(false)

  useEffect(() => {
    if (!mapRef.current) return
    const cssId = 'leaflet-css'
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link')
      link.id = cssId
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const initMap = async () => {
      if (!window.L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.onload = () => resolve()
          document.body.appendChild(script)
        })
      }
      if (mapInstanceRef.current) return
      const Leaf = window.L
      const map = Leaf.map(mapRef.current, {
        center: [46.5, 2.5],
        zoom: 6,
        zoomControl: true,
        attributionControl: false,
      })
      Leaf.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
      }).addTo(map)
      mapInstanceRef.current = map
    }
    initMap()
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !results.length) return
    const Leaf = window.L
    const map = mapInstanceRef.current

    layersRef.current.forEach((l) => map.removeLayer(l))
    layersRef.current = []

    const regionScores: { [key: string]: number[] } = {}
    results.forEach((d) => {
      if (!regionScores[d.region]) regionScores[d.region] = []
      regionScores[d.region].push(d.scoreGlobal)
    })
    const regionAvg: { [key: string]: number } = {}
    Object.keys(regionScores).forEach((r) => {
      const arr = regionScores[r]
      regionAvg[r] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
    })

    fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson')
      .then((r) => r.json())
      .then((geojson) => {
        const layer = Leaf.geoJSON(geojson, {
          style: (feat: any) => {
            const nom = feat.properties.nom
            const score = regionAvg[nom] || 0
            return {
              fillColor: score > 0 ? fillFromScore(score) : '#E5E7EB',
              weight: 1,
              opacity: 1,
              color: '#fff',
              fillOpacity: score > 0 ? 0.6 : 0.2,
            }
          },
        }).addTo(map)
        layersRef.current.push(layer)
      })

    results.forEach((dest) => {
      const score = dest.scoreGlobal
      const color = colorFromScore(score)

      const labelHtml =
        '<div style="background:#FFFFFF;border:2px solid ' + color +
        ';border-radius:999px;padding:4px 10px;font-size:13px;font-weight:600;color:#1F2937;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.15);display:flex;align-items:center;gap:5px;">' +
        '<span>' + dest.nom + '</span>' +
        '<span style="background:' + color + ';color:#fff;border-radius:999px;padding:2px 7px;font-size:11px;">' + score + '</span>' +
        '</div>'

      const icon = Leaf.divIcon({
        html: labelHtml,
        className: '',
        iconSize: undefined,
        iconAnchor: [40, 14],
      })

      const marker = Leaf.marker([dest.lat, dest.lon], { icon }).addTo(map)
      layersRef.current.push(marker)

      const photoHtml = dest.photo
        ? '<img src="' + dest.photo + '" alt="' + dest.nom + '" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;"/>'
        : ''

      const popupHtml =
        '<div style="font-family:system-ui,sans-serif;min-width:220px;max-width:260px;">' +
        photoHtml +
        '<div style="font-size:16px;font-weight:600;color:#0F172A;margin-bottom:4px;">' + dest.nom + '</div>' +
        '<div style="font-size:12px;color:#64748B;margin-bottom:8px;">' + dest.region + '</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:10px;font-size:13px;">' +
        '<span>' + meteoIcon(dest.meteo) + ' ' + (dest.meteo ? dest.meteo.temp + '°C' : '—') + '</span>' +
        '<span style="color:#64748B;">' + (dest.meteo ? dest.meteo.pluie + 'mm' : '') + '</span>' +
        '<span style="margin-left:auto;background:' + color + ';color:#fff;border-radius:6px;padding:2px 8px;font-weight:600;">' + score + '</span>' +
        '</div>' +
        '<div style="font-size:13px;color:#475569;margin-bottom:10px;">Total estimé : <strong style="color:#0F172A;">~' + dest.totalEstime + '€</strong></div>' +
        '<div style="display:flex;gap:6px;">' +
        '<a href="' + dest.meilleurTransport.lien + '" target="_blank" rel="noopener noreferrer" style="flex:1;background:#0EA5E9;color:#fff;text-align:center;padding:6px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">🚆 Transport</a>' +
        '<a href="' + dest.bookingUrl + '" target="_blank" rel="noopener noreferrer" style="flex:1;background:#1E40AF;color:#fff;text-align:center;padding:6px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">🏨 Hôtel</a>' +
        '</div>' +
        '</div>'

      marker.bindPopup(popupHtml, {
        maxWidth: 280,
        autoPan: true,
        autoPanPadding: [20, 60],
      })
    })
  }, [results])

  if (loading) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-bounce">🌤️</div>
          <p className="text-slate-400 text-sm">Recherche des meilleures destinations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-slate-800">
      <div ref={mapRef} className="w-full h-full" />

      <button
        onClick={() => setLegendOpen(!legendOpen)}
        className="absolute bottom-3 right-3 z-[400] w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 font-bold text-lg hover:bg-slate-100 transition-colors"
        aria-label="Afficher la légende"
      >
        {legendOpen ? '×' : 'i'}
      </button>

      {legendOpen && (
        <div className="absolute bottom-14 right-3 z-[400] bg-white rounded-xl shadow-xl p-3 max-w-[260px] text-slate-800">
          <p className="text-xs font-semibold mb-2 text-slate-600 uppercase tracking-wide">Score régional moyen</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded" style={{background:'#BBF7D0'}}></span> 80+ Excellent</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded" style={{background:'#D9F99D'}}></span> 70–79 Très bon</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded" style={{background:'#FEF08A'}}></span> 60–69 Bon</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded" style={{background:'#FED7AA'}}></span> 50–59 Correct</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded" style={{background:'#FCA5A5'}}></span> 40–49 Faible</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded" style={{background:'#F87171'}}></span> &lt; 40 Mauvais</div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
            Clique sur une région ou une ville pour les détails.
          </p>
        </div>
      )}
    </div>
  )
}
