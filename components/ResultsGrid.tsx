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

function DestCard({ dest, index }: { dest: Destination, index: number }): JSX.Element {
  let meteoIcon = '?'
  if (dest.meteo) {
    if (dest.meteo.soleil >= 6) meteoIcon = '☀️'
    else if (dest.meteo.soleil >= 3) meteoIcon = '⛅'
    else meteoIcon = '☁️'
  }

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
      <div className="flex flex-wrap gap-2 mb-3">
        {dest.meteo ? (
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">
            {meteoIcon} {dest.meteo.temp}°C · {dest.meteo.pluie}mm · {dest.meteo.s
