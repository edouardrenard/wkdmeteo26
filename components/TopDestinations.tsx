'use client'

import { Destination } from '@/lib/types'

interface Props {
  results: Destination[]
}

function tIcon(type: string): string {
  return type === 'train' ? '🚆' : type === 'voiture' ? '🚗' : '✈️'
}

function meteoIcon(m: { soleil: number; pluie: number } | null): string {
  if (!m) return '❓'
  if (m.pluie >= 4) return '🌧️'
  if (m.pluie >= 1) return '🌦️'
  return m.soleil >= 6 ? '☀️' : m.soleil >= 3 ? '⛅' : '☁️'
}

function scoreToColor(score: number): string {
  if (score >= 80) return '#15803D'
  if (score >= 70) return '#16A34A'
  if (score >= 60) return '#65A30D'
  if (score >= 50) return '#CA8A04'
  if (score >= 40) return '#EA580C'
  return '#DC2626'
}

const medals = ['🥇', '🥈', '🥉']

export default function TopDestinations({ results }: Props) {
  if (results.length === 0) return null
  const top3 = results.slice(0, 3)

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        ✨ Le top 3 du weekend
        <span className="text-xs text-slate-400 font-normal">— les meilleurs scores combinés météo + budget</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((d, i) => {
          const color = scoreToColor(d.scoreGlobal)
          const m = d.meteo
          const t = d.meilleurTransport
          const fallback = 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?w=600'
          const photoUrl = d.photo || fallback
          return (
            <div key={d.nom + i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-colors">
              <div className="relative h-40 bg-slate-800">
                <img src={photoUrl} alt={d.nom} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-2xl px-2 py-0.5 rounded-lg">
                  {medals[i]}
                </div>
                <div className="absolute top-2 right-2 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg" style={{ background: color }}>
                  {d.scoreGlobal}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-white text-lg font-bold">{tIcon(t.type)} {d.nom}</h3>
                  <p className="text-slate-200 text-xs">{d.region}</p>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                  <span>{meteoIcon(m)} {m ? m.temp + '°C · ' + m.pluie + 'mm' : 'Météo N/D'}</span>
                  <span className="font-bold text-white">~{d.totalEstime}€</span>
                </div>
                <div className="flex gap-2">
                  <a href={t.lien} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs bg-sky-500 hover:bg-sky-400 text-white py-2 rounded-lg font-semibold transition-colors">
                    {tIcon(t.type)} Transport ↗
                  </a>
                  <a href={d.bookingUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center text-xs bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition-colors">
                    🏨 Hôtel ↗
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
