'use client'

import { Destination, SearchParams } from '@/lib/types'

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'text-emerald-400 bg-emerald-400/10' : score >= 55 ? 'text-sky-400 bg-sky-400/10' : 'text-amber-400 bg-amber-400/10'
  return (
    <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center ${color} flex-shrink-0`}>
      <span className="text-lg font-bold leading-none">{score}</span>
      <span className="text-xs opacity-70">score</span>
    </div>
  )
}

function MiniBar({ value, color }: { value: number, color: string }) {
  return (
    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  )
}

function DestCard({ dest, index }: { dest: Destination, index: number }) {
  const meteoIcon = dest.meteo
    ? dest.meteo.soleil >= 6 ? '☀️' : dest.meteo.soleil >= 3 ? '⛅' : '☁️'
    : '?'

  return (
    <div className={`bg-slate-900 rounded-2xl p-5 border ${index === 0 ? 'border-sky-500' : 'border-slate-800'} hover:border-slate-600 transition-colors`}>
      {index === 0 && (
        <span className="inline-block text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full mb-3">
          Meilleur score
        </span>
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold">{dest.nom}</h3>
          <p className="text-sm text-slate-400">{dest.pays}</p>
        </div>
        <ScoreBadge score={dest.scoreGlobal} />
      </div>

      {/* Météo */}
      <div className="flex flex-wrap gap-2 mb-3">
        {dest.meteo ? (
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">
            {meteoIcon} {dest.meteo.temp}°C · {dest.meteo.pluie}mm · {dest.meteo.soleil}h soleil
          </span>
        ) : (
          <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded-lg">Météo indisponible</span>
        )}
      </div>

      {/* Prix détaillés */}
      <div className="bg-slate-800 rounded-xl p-3 mb-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">✈️ Vol A/R</span>
          <span className="text-white font-medium">
            ~{dest.vol}€
            <span className={`ml-1 text-xs ${dest.volSource === 'reel' ? 'text-emerald-400' : 'text-slate-500'}`}>
              {dest.volSource === 'reel' ? '● réel' : '● estimé'}
            </span>
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">🏨 Hôtel ({dest.nbNuits} nuit{dest.nbNuits > 1 ? 's' : ''} × ~{dest.hotel}€)</span>
          <span className="text-white font-medium">~{dest.hotelTotal}€</span>
        </div>
        <div className="border-t border-slate-700 pt-2 flex justify-between text-sm">
          <span className="text-slate-300 font-medium">Total estimé</span>
          <span className={`font-bold ${dest.totalEstime <= 400 ? 'text-emerald-400' : dest.totalEstime <= 600 ? 'text-sky-400' : 'text-amber-400'}`}>
            ~{dest.totalEstime}€
          </span>
        </div>
      </div>

      {/* Barres de score */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-4">☀</span>
          <MiniBar value={dest.scoreMeteo} color="bg-emerald-500" />
          <span className="text-xs text-slate-500 w-6 text-right">{dest.scoreMeteo}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-4">€</span>
          <MiniBar value={dest.scorePrix} color="bg-sky-500" />
          <span className="text-xs text-slate-500 w-6 text-right">{dest.scorePrix}</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-2">
        
          href={dest.kiwiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 py-2 px-3 rounded-lg transition-colors"
        >
          Voir les vols ↗
        </a>
        
          href={dest.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2 px-3 rounded-lg transition-colors"
        >
          Voir les hôtels ↗
        </a>
      </div>
    </div>
  )
}

export default function ResultsGrid({
  results,
  loading,
  params,
}: {
  results: Destination[]
  loading: boolean
  params: SearchParams | null
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
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg mb-2">Aucune destination trouvée</p>
        <p className="text-sm">Essaie d'augmenter ton budget ou de changer les critères.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">
          <span className="text-white font-medium">{results.length} destinations</span> triées par score
        </p>
        <p className="text-xs text-slate-500">Météo Open-Meteo · Vols Travelpayouts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((dest, i) => (
          <DestCard key={dest.iata + i} dest={dest} index={i} />
        ))}
      </div>
    </div>
  )
}
