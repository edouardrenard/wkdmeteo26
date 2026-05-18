'use client'

import { useEffect, useRef, useState } from 'react'
import { Destination } from '@/lib/types'

interface Props {
  results: Destination[]
  loading: boolean
}

const GEOJSON_URL = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson'

function scoreToColor(score: number): string {
  if (score >= 80) return '#15803D'
  if (score >= 70) return '#16A34A'
  if (score >= 60) return '#65A30D'
  if (score >= 50) return '#CA8A04'
  if (score >= 40) return '#EA580C'
  if (score >= 30) return '#DC2626'
  return '#991B1B'
}

function scoreToFillColor(score: number): string {
  if (score >= 80) return '#BBF7D0'
  if (score >= 70) return '#D9F99D'
  if (score >= 60) return '#FEF08A'
  if (score >= 50) return '#FED7AA'
  if (score >= 40) return '#FECACA'
  if (score >= 30) return '#FCA5A5'
  return '#F87171'
}

function tIcon(type: string): string {
  return type === 'train' ? '🚆' : type === 'voiture' ? '🚗' : '✈️'
}

function meteoIcon(soleil: number, pluie: number): string {
  if (pluie >= 4) return '🌧️'
  if (pluie >= 1) return '🌦️'
  return soleil >= 6 ? '☀️' : soleil >= 3 ? '⛅' : '☁️'
}

function buildRegionPopup(regionName: string, destsInRegion: Destination[], avgScore: number): string {
  const color = scoreToColor(avgScore)
  const sorted = [...destsInRegion].sort((a, b) => b.scoreGlobal - a.scoreGlobal)

  let villesHtml = ''
  sorted.forEach(d => {
    const dColor = scoreToColor(d.scoreGlobal)
    const m = d.meteo
    const meteoTxt = m ? meteoIcon(m.soleil, m.pluie) + ' ' + m.temp + '°C · ' + m.pluie + 'mm' : 'Météo N/D'
    const t = d.meilleurTransport
    const dPhoto = d.photo || 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?w=400'
    villesHtml += '<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:10px;overflow:hidden">' +
      '<div style="position:relative;height:100px;background:#E2E8F0">' +
        '<img src="' + dPhoto + '" alt="' + d.nom + '" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'" />' +
        '<div style="position:absolute;top:8px;right:8px;background:' + dColor + ';color:white;font-size:12px;font-weight:700;padding:3px 10px;border-radius:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">' + d.scoreGlobal + '</div>' +
        '<div style="position:absolute;bottom:0;left:0;right:0;padding:6px 10px;background:linear-gradient(transparent,rgba(0,0,0,0.75))">' +
          '<div style="font-size:14px;font-weight:700;color:white">' + tIcon(t.type) + ' ' + d.nom + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="padding:10px">' +
        '<div style="font-size:11px;color:#475569;margin-bottom:8px">' + meteoTxt + ' · Total <strong style="color:#0F172A">~' + d.totalEstime + '€</strong></div>' +
        '<div style="display:flex;gap:5px">' +
          '<a href="' + t.lien + '" target="_blank" style="flex:1;text-align:center;padding:7px;background:#0EA5E9;color:white;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none">' + tIcon(t.type) + ' Réserver transport</a>' +
          '<a href="' + d.bookingUrl + '" target="_blank" style="flex:1;text-align:center;padding:7px;background:#003580;color:white;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none">🏨 Hôtel</a>' +
        '</div>' +
      '</div>' +
    '</div>'
  })

  return '<div style="font-family:system-ui;min-width:300px;max-width:320px;color:#0F172A;max-height:500px;overflow-y:auto">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid ' + color + '">' +
      '<div style="width:50px;height:50px;border-radius:50%;background:' + color + ';display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px ' + color + '50">' +
        '<span style="font-size:17px;font-weight:800;color:white;line-height:1">' + Math.round(avgScore) + '</span>' +
        '<span style="font-size:8px;color:white;opacity:0.85">/100</span>' +
      '</div>' +
      '<div>' +
        '<div style="font-size:16px;font-weight:700;color:#0F172A">' + regionName + '</div>' +
        '<div style="font-size:12px;color:#64748B">' + destsInRegion.length + ' destination' + (destsInRegion.length > 1 ? 's' : '') + ' · triées par score</div>' +
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
        center: [46.7, 2.5],
        zoom: 6,
        zoomControl: true,
        preferCanvas: false,
      })
      mapRef.current = mapInstance

      Leaf.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
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
              fillColor: '#F1F5F9',
              fillOpacity: 0.5,
              color: '#CBD5E1',
              weight: 1,
              opacity: 0.6,
            }
          }
          const avgScore = destsInRegion.reduce((sum, d) => sum + d.scoreGlobal, 0) / destsInRegion.length
          return {
            fillColor: scoreToFillColor(avgScore),
            fillOpacity: 0.75,
            color: scoreToColor(avgScore),
            weight: 2,
            opacity: 0.6,
          }
        },
        onEachFeature: (feature: any, layer: any) => {
          const regionName = feature.properties.nom
          const destsInRegion = scoresByRegion[regionName] || []
          if (destsInRegion.length > 0) {
            const avgScore = destsInRegion.reduce((sum, d) => sum + d.scoreGlobal, 0) / destsInRegion.length
            const popup = buildRegionPopup(regionName, destsInRegion, avgScore)
            layer.bindPopup(popup, { maxWidth: 340, className: 'light-popup' })
            layer.on('mouseover', function (this: any) {
              this.setStyle({ fillOpacity: 0.9, weight: 3 })
            })
            layer.on('mouseout', function (this: any) {
              this.setStyle({ fillOpacity: 0.75, weight: 2 })
            })
          }
        },
      })
      geoLayer.addTo(mapRef.current)
      layersRef.current.push(geoLayer)

      // Étiquettes pilules style OuiGo
      villesFR.forEach(d => {
        const labelColor = scoreToColor(d.scoreGlobal)
        const labelHtml = '<div style="display:inline-flex;align-items:center;background:' + labelColor + ';color:white;padding:4px 10px;border-radius:14px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.25);border:2px solid white;transform:translate(-50%,-50%)">' + d.nom + ' <span style="background:rgba(255,255,255,0.25);padding:1px 6px;border-radius:8px;margin-left:5px;font-size:10px">' + d.scoreGlobal + '</span></div>'
        const labelIcon = Leaf.divIcon({
          className: 'city-pill',
          html: labelHtml,
          iconSize: [1, 1],
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
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 text-xs shadow-lg">
        <p className="font-semibold text-slate-800 mb-2">Score régional moyen</p>
        {[
          { color: '#15803D', label: '80+ Excellent' },
          { color: '#16A34A', label: '70–79 Très bon' },
          { color: '#65A30D', label: '60–69 Bon' },
          { color: '#CA8A04', label: '50–59 Correct' },
          { color: '#EA580C', label: '40–49 Faible' },
          { color: '#DC2626', label: '< 40 Mauvais' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="text-slate-600">{label}</span>
          </div>
        ))}
        <div className="border-t border-slate-200 mt-2 pt-2 text-slate-500 text-xs">
          Clique sur une région pour les détails
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[1000] bg-white/85 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">🗺️</div>
            <p className="text-slate-800 font-medium">Chargement météo et prix…</p>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-600 bg-white/95 px-8 py-5 rounded-2xl border border-slate-200 shadow-lg">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="font-medium mb-1">Lance une recherche</p>
            <p className="text-sm">La carte des régions s&apos;affichera ici</p>
          </div>
        </div>
      )}

      <div ref={containerRef} className="w-full rounded-2xl border border-slate-200 shadow-sm" style={{ height: '650px' }} />

      <style>{`
        .light-popup .leaflet-popup-content-wrapper {
          background: white !important;
          color: #0F172A !important;
          border-radius: 14px !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.25) !important;
          padding: 4px !important;
        }
        .light-popup .leaflet-popup-tip { background: white !important; }
        .light-popup .leaflet-popup-close-button { color: #64748B !important; font-size: 20px !important; top: 8px !important; right: 10px !important; font-weight: 300 !important; }
        .light-popup .leaflet-popup-content { margin: 14px 16px !important; }
        .city-pill { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  )
}
