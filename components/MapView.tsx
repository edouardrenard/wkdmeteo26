'use client'

import { useEffect, useRef, useState } from 'react'
import { Destination } from '@/lib/types'

interface Props {
  results: Destination[]
  loading: boolean
}

const GEOJSON_URL = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson'

function scoreToColor(score: number): string {
  if (score >= 85) return '#059669'  // vert très foncé
  if (score >= 75) return '#10B981'  // vert
  if (score >= 65) return '#34D399'  // vert clair
  if (score >= 55) return '#FBBF24'  // jaune
  if (score >= 45) return '#F59E0B'  // orange clair
  if (score >= 35) return '#F97316'  // orange
  if (score >= 25) return '#EF4444'  // rouge
  if (score >= 15) return '#DC2626'  // rouge foncé
  return '#7F1D1D'  // bordeaux
}

function tIcon(type: string): string {
  return type === 'train' ? '🚆' : type === 'voiture' ? '🚗' : '✈️'
}

function meteoIcon(soleil: number): string {
  return soleil >= 6 ? '☀️' : soleil >= 3 ? '⛅' : '☁️'
}

function buildRegionPopup(regionName: string, destsInRegion: Destination[], avgScore: number): string {
  const color = scoreToColor(avgScore)
  const sorted = [...destsInRegion].sort((a, b) => b.scoreGlobal - a.scoreGlobal)

  let villesHtml = ''
  sorted.forEach(d => {
    const dColor = scoreToColor(d.scoreGlobal)
    const m = d.meteo
    const meteoTxt = m ? meteoIcon(m.soleil) + ' ' + m.temp + '°C · ' + m.pluie + 'mm' : 'Météo N/D'
    const t = d.meilleurTransport
    villesHtml += '<div style="background:#1E293B;border-radius:8px;padding:8px;margin-bottom:6px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
        '<span style="font-size:13px;font-weight:600;color:white">' + tIcon(t.type) + ' ' + d.nom + '</span>' +
        '<span style="background:' + dColor + '25;color:' + dColor + ';font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;border:1px solid ' + dColor + '">' + d.scoreGlobal + '</span>' +
      '</div>' +
      '<div style="font-size:11px;color:#94A3B8;margin-bottom:5px">' + meteoTxt + ' · ' + t.type + ' ~' + t.prixAR + '€ · 🏨 ~' + d.hotelTotal + '€ · Total ~' + d.totalEstime + '€</div>' +
      '<div style="display:flex;gap:4px">' +
        '<a href="' + t.lien + '" target="_blank" style="flex:1;text-align:center;padding:4px;background:' + (t.type === 'train' ? '#16503333' : t.type === 'voiture' ? '#1E3A5F33' : '#1D4ED833') + ';color:' + (t.type === 'train' ? '#10B981' : t.type === 'voiture' ? '#60A5FA' : '#38BDF8') + ';border-radius:5px;font-size:10px;font-weight:600;text-decoration:none">' + tIcon(t.type) + ' Transport ↗</a>' +
        '<a href="' + d.bookingUrl + '" target="_blank" style="flex:1;text-align:center;padding:4px;background:#92400E33;color:#F59E0B;border-radius:5px;font-size:10px;font-weight:600;text-decoration:none">🏨 Hôtel ↗</a>' +
      '</div>' +
    '</div>'
  })

  return '<div style="font-family:system-ui;min-width:280px;color:white;max-height:400px;overflow-y:auto">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #334155">' +
      '<div style="width:42px;height:42px;border-radius:50%;background:' + color + '25;border:2px solid ' + color + ';display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">' +
        '<span style="font-size:14px;font-weight:700;color:' + color + ';line-height:1">' + Math.round(avgScore) + '</span>' +
        '<span style="font-size:8px;color:#94A3B8">moy.</span>' +
      '</div>' +
      '<div>' +
        '<div style="font-size:14px;font-weight:700">' + regionName + '</div>' +
        '<div style="font-size:11px;color:#94A3B8">' + destsInRegion.length + ' destination' + (destsInRegion.length > 1 ? 's' : '') + ' disponible' + (destsInRegion.length > 1 ? 's' : '') + '</div>' +
      '</div>' +
    '</div>' +
    villesHtml +
  '</div>'
}

export default function MapView({ results, loading }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const layersRef = useRef<any[]>([])
  const geoDataRef = useRef<any>(null)
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

      const mapInstance = Leaf.map(containerRef.current, {
        center: [46.5, 2.5],
        zoom: 6,
        zoomControl: true,
        preferCanvas: false,
      })
      mapRef.current = mapInstance

      Leaf.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 12,
      }).addTo(mapInstance)

      try {
        const geoResp = await fetch(GEOJSON_URL)
        const geoData = await geoResp.json()
        geoDataRef.current = geoData
      } catch (err) {
        console.error('GeoJSON load error', err)
      }

      setReady(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current || !geoDataRef.current) return
    const update = async () => {
      const Lmod = await import('leaflet')
      const Leaf: any = Lmod.default

      layersRef.current.forEach(l => { try { mapRef.current.removeLayer(l) } catch {} })
      layersRef.current = []

      const villesFR = results.filter(r => r.pays === 'France')

      const scoresByRegion: Record<string, Destination[]> = {}
      villesFR.forEach(v => {
        if (!scoresByRegion[v.region]) scoresByRegion[v.region] = []
        scoresByRegion[v.region].push(v)
      })

      const geoLayer = Leaf.geoJSON(geoDataRef.current, {
        style: (feature: any) => {
          const regionName = feature.properties.nom
          const destsInRegion = scoresByRegion[regionName] || []
          if (destsInRegion.length === 0) {
            return {
              fillColor: '#1E293B',
              fillOpacity: 0.3,
              color: '#475569',
              weight: 1,
              opacity: 0.5,
            }
          }
          const avgScore = destsInRegion.reduce((sum, d) => sum + d.scoreGlobal, 0) / destsInRegion.length
          return {
            fillColor: scoreToColor(avgScore),
            fillOpacity: 0.65,
            color: '#FFFFFF',
            weight: 1.5,
            opacity: 0.8,
          }
        },
        onEachFeature: (feature: any, layer: any) => {
          const regionName = feature.properties.nom
          const destsInRegion = scoresByRegion[regionName] || []
          if (destsInRegion.length > 0) {
            const avgScore = destsInRegion.reduce((sum, d) => sum + d.scoreGlobal, 0) / destsInRegion.length
            const popup = buildRegionPopup(regionName, destsInRegion, avgScore)
            layer.bindPopup(popup, { maxWidth: 320, className: 'dark-popup' })
            layer.on('mouseover', function (this: any) {
              this.setStyle({ fillOpacity: 0.85, weight: 2.5 })
            })
            layer.on('mouseout', function (this: any) {
              this.setStyle({ fillOpacity: 0.65, weight: 1.5 })
            })
          } else {
            layer.bindTooltip(regionName + ' — pas de destination', { sticky: true, className: 'region-tooltip' })
          }
        },
      })
      geoLayer.addTo(mapRef.current)
      layersRef.current.push(geoLayer)

      villesFR.forEach(d => {
        const labelHtml = '<div style="background:rgba(15,23,42,0.95);color:white;padding:3px 8px;border-radius:8px;font-size:11px;font-weight:600;white-space:nowrap;border:1px solid ' + scoreToColor(d.scoreGlobal) + ';box-shadow:0 2px 4px rgba(0,0,0,0.4)">' + d.nom + ' <span style="color:' + scoreToColor(d.scoreGlobal) + '">' + d.scoreGlobal + '</span></div>'
        const labelIcon = Leaf.divIcon({
          className: '',
          html: labelHtml,
          iconAnchor: [0, 0],
        })
        const coords: [number, number] = [d.lat, d.lon]
        const marker = Leaf.marker(coords, { icon: labelIcon, zIndexOffset: 200, interactive: false })
        marker.addTo(mapRef.current)
        layersRef.current.push(marker)
      })
    }
    update()
  }, [results, ready])

  return (
    <div className="relative w-full">
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl p-3 text-xs">
        <p className="font-semibold text-slate-200 mb-2">Score régional moyen</p>
        {[
  { color: '#059669', label: '85+ Parfait' },
  { color: '#10B981', label: '75–84 Excellent' },
  { color: '#34D399', label: '65–74 Très bon' },
  { color: '#FBBF24', label: '55–64 Bon' },
  { color: '#F59E0B', label: '45–54 Moyen' },
  { color: '#F97316', label: '35–44 Faible' },
  { color: '#EF4444', label: '< 35 Mauvais' },
].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
        <div className="border-t border-slate-700 mt-2 pt-2 text-slate-400 text-xs">
          Clique sur une région pour voir les villes
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[1000] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">🗺️</div>
            <p className="text-white font-medium">Chargement météo et prix…</p>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-400 bg-slate-900/90 px-8 py-5 rounded-2xl border border-slate-800">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="font-medium mb-1">Lance une recherche</p>
            <p className="text-sm">La carte des régions s&apos;affichera ici</p>
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
        .region-tooltip { background: #0F172A !important; color: #94A3B8 !important; border: 1px solid #334155 !important; border-radius: 6px !important; padding: 4px 8px !important; font-size: 11px !important; }
      `}</style>
    </div>
  )
}
