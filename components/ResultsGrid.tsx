'use client'

import { Destination, SearchParams } from '@/lib/types'

export default function ResultsGrid({ results, loading, params }: {
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
        <p className="text-xs text-slate-500">Météo Open-Meteo · Vols Travelpayouts · Train Omio</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((dest, i) => {
          const meteoIcon = dest.meteo
            ? (dest.meteo.soleil >= 6 ? '☀️' : dest.meteo.soleil >= 3 ? '⛅' : '☁️')
            : '?'
          const scoreColor = dest.scoreGlobal >= 75
            ? 'text-emerald-400 bg-emerald-400/10'
            : dest.scoreGlobal >= 55
            ? 'text-sky-400 bg-sky-400/10'
            : 'text-amber-400 bg-amber-400/10'
          const totalColor = dest.totalEstime <= 400
            ? 'text-emerald-400'
            : dest.totalEstime <= 600
            ? 'text-sky-400'
            : 'text
