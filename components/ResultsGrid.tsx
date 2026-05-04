'use client'
import { Destination, SearchParams } from '@/lib/types'
export default function ResultsGrid({ results, loading, params }: { results: Destination[], loading: boolean, params: SearchParams | null }) {
  if (loading) return <div className="text-center py-12 text-slate-400"><p>Chargement...</p></div>
  if (results.length === 0) return <div className="text-center py-12 text-slate-400"><p>Aucune destination trouvée. Augmente ton budget.</p></div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((dest, i) => (
        <div key={dest.iata + i} className={`bg-slate-900 rounded-2xl p-5 border ${i === 0 ? 'border-sky-500' : 'border-slate-800'}`}>
          {i === 0 && <span className="inline-block text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full mb-3">Meilleur score</span>}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-base font-semibold">{dest.nom}</h3>
              <p className="text-sm text-slate-400">{dest.pays}</p>
            </div>
            <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center flex-shrink-0 ${dest.scoreGlobal >= 75 ? 'text-emerald-400 bg-emerald-400/10' : dest.scoreGlobal >= 55 ? 'text-sky-400 bg-sky-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
              <span className="text-lg font-bold leading-none">{dest.scoreGlobal}</span>
              <span className="text-xs opacity-70">score</span>
            </div>
          </div>
          {dest.meteo && (
            <div className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg mb-3 inline-block">
              {dest.meteo.soleil >= 6 ? '☀️' : dest.meteo.soleil >= 3 ? '⛅' : '☁️'} {dest.meteo.temp}°C · {dest.meteo.pluie}mm · {dest.meteo.soleil}h soleil
            </div>
          )}
          <div className="bg-slate-800 rounded-xl p-3 mb-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">✈️ Vol A/R</span>
              <span className="text-white font-medium">~{dest.vol}€ <span className={dest.volSource === 'reel' ? 'text-emerald-400' : 'text-slate-500'}>{dest.volSource === 'reel' ? '● réel' : '● estimé'}</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">🏨 {dest.nbNuits} nuit{dest.nbNuits > 1 ? 's' : ''} × ~{dest.hotel}€</span>
              <span className="text-white font-medium">~{dest.hotelTotal}€</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-1.5 text-sm">
              <span className="text-slate-300 font-medium">Total estimé</span>
              <span className={`font-bold ${dest.totalEstime <= 400 ? 'text-emerald-400' : dest.totalEstime <= 600 ? 'text-sky-400' : 'text-amber-400'}`}>~{dest.totalEstime}€</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={dest.kiwiUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 py-2 rounded-lg">✈️ Vols ↗</a>
            <a href={dest.bookingUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2 rounded-lg">🏨 Hôtels ↗</a>
          </div>
        </div>
      ))}
    </div>
  )
}
