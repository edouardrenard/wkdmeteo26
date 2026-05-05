'use client'

import { Destination } from '@/lib/types'

function transportIcon(type: string): string {
  if (type === 'train') return '🚆'
  if (type === 'voiture') return '🚗'
  return '✈️'
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400 bg-emerald-400/10'
  if (score >= 65) return 'text-green-400 bg-green-400/10'
  if (score >= 50) return 'text-amber-400 bg-amber-400/10'
  return 'text-red-400 bg-red-400/10'
}

function totalColor(total: number): string {
  if (total <= 200) return 'text-emerald-400'
  if (total <= 400) return 'text-sky-400'
  return 'text-amber-400'
}

export default function ResultsGrid({ results, loading }: {
  results: Destination[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-2/3 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-1/3 mb-4" />
            <div className="h-16 bg-slate-800 rounded mb-3" />
            <div className="h-8 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-lg font-medium mb-1">Aucune destination trouvée</p>
        <p className="text-sm">Essaie d'augmenter ton budget ou de changer les critères.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((dest, i) => {
          const meteoIcon = dest.meteo
            ? dest.meteo.soleil >= 6 ? '☀️' : dest.meteo.soleil >= 3 ? '⛅' : '☁️'
            : '?'
          const sc = scoreColor(dest.scoreGlobal)
          const tc = totalColor(dest.totalEstime)
          const icon = transportIcon(dest.meilleurTransport.type)

          return (
            <div key={dest.nom + i} className={`bg-slate-900 rounded-2xl p-5 border ${i === 0 ? 'border-sky-500' : 'border-slate-800'} hover:border-slate-600 transition-colors`}>
              {i === 0 && (
                <span className="inline-block text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full mb-3">
                  Meilleur score
                </span>
              )}

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-base font-semibold">{icon} {dest.nom}</h3>
                  <p className="text-sm text-slate-400">{dest.region}</p>
                </div>
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center flex-shrink-0 ${sc}`}>
                  <span className="text-lg font-bold leading-none">{dest.scoreGlobal}</span>
                  <span className="text-xs opacity-70">score</span>
                </div>
              </div>

              {/* Météo */}
              {dest.meteo && (
                <div className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg mb-3 inline-block">
                  {meteoIcon} {dest.meteo.temp}°C · {dest.meteo.pluie}mm · {dest.meteo.soleil}h soleil
                </div>
              )}

              {/* Prix */}
              <div className="bg-slate-800 rounded-xl p-3 mb-4 space-y-2">
                {dest.transports.map(t => (
                  <div key={t.type} className="flex justify-between text-xs">
                    <span className="text-slate-400">
                      {transportIcon(t.type)} {t.type.charAt(0).toUpperCase() + t.type.slice(1)} A/R
                      {t.duree ? ` (${t.duree})` : ''}
                    </span>
                    <span className="text-white font-medium">
                      ~{t.prixAR}€
                      <span className={`ml-1 text-xs ${t.source === 'reel' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {t.source === 'reel' ? '● réel' : '● estimé'}
                      </span>
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    🏨 Hôtel ({dest.nbNuits} nuit{dest.nbNuits > 1 ? 's' : ''} × ~{dest.hotelNuit}€)
                  </span>
                  <span className="text-white font-medium">~{dest.hotelTotal}€</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Total estimé</span>
                  <span className={`font-bold ${tc}`}>~{dest.totalEstime}€</span>
                </div>
              </div>

              {/* Barres score */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-10">Météo</span>
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dest.scoreMeteo}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 w-6 text-right">{dest.scoreMeteo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-10">Prix</span>
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${dest.scorePrix}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 w-6 text-right">{dest.scorePrix}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-2 flex-wrap">
                {dest.transports.map(t => (
                  
                    key={t.type}
                    href={t.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 text-center text-xs py-2 px-2 rounded-lg border transition-colors ${
                      t.type === 'train'
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                        : t.type === 'voiture'
                        ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20'
                        : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border-sky-500/20'
                    }`}
                  >
                    {transportIcon(t.type)} {t.type.charAt(0).toUpperCase() + t.type.slice(1)} ↗
                  </a>
                ))}
                
                  href={dest.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2 px-2 rounded-lg transition-colors"
                >
                  🏨 Hôtel ↗
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
