'use client'

import { Destination, Transport } from '@/lib/types'

function tIcon(type: string) {
  return type === 'train' ? '🚆' : type === 'voiture' ? '🚗' : '✈️'
}

function tLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function TransportRow({ t }: { t: Transport }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-400">{tIcon(t.type)} {tLabel(t.type)} A/R{t.duree ? ` (${t.duree})` : ''}</span>
      <span className="text-white font-medium">
        ~{t.prixAR}€{' '}
        <span className={`text-xs ${t.source === 'reel' ? 'text-emerald-400' : 'text-slate-500'}`}>
          {t.source === 'reel' ? '● réel' : '● estimé'}
        </span>
      </span>
    </div>
  )
}

function TransportBtn({ t }: { t: Transport }) {
  const cls = t.type === 'train'
    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
    : t.type === 'voiture'
    ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20'
    : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border-sky-500/20'
  return (
    <a href={t.lien} target="_blank" rel="noopener noreferrer"
      className={`flex-1 text-center text-xs py-2 px-2 rounded-lg border transition-colors ${cls}`}>
      {tIcon(t.type)} {tLabel(t.type)} ↗
    </a>
  )
}

function Card({ dest, index }: { dest: Destination, index: number }) {
  const m = dest.meteo
  const mi = m ? (m.soleil >= 6 ? '☀️' : m.soleil >= 3 ? '⛅' : '☁️') : '?'
  const sc = dest.scoreGlobal >= 80 ? 'text-emerald-400 bg-emerald-400/10'
    : dest.scoreGlobal >= 65 ? 'text-green-400 bg-green-400/10'
    : dest.scoreGlobal >= 50 ? 'text-amber-400 bg-amber-400/10'
    : 'text-red-400 bg-red-400/10'
  const tc = dest.totalEstime <= 200 ? 'text-emerald-400'
    : dest.totalEstime <= 400 ? 'text-sky-400' : 'text-amber-400'

  return (
    <div className={`bg-slate-900 rounded-2xl p-5 border ${index === 0 ? 'border-sky-500' : 'border-slate-800'} hover:border-slate-600 transition-colors`}>
      {index === 0 && <span className="inline-block text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full mb-3">Meilleur score</span>}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-semibold">{tIcon(dest.meilleurTransport.type)} {dest.nom}</h3>
          <p className="text-sm text-slate-400">{dest.region}</p>
        </div>
        <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center flex-shrink-0 ${sc}`}>
          <span className="text-lg font-bold leading-none">{dest.scoreGlobal}</span>
          <span className="text-xs opacity-70">score</span>
        </div>
      </div>
      {m && (
        <div className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg mb-3 inline-block">
          {mi} {m.temp}°C · {m.pluie}mm · {m.soleil}h soleil
        </div>
      )}
      <div className="bg-slate-800 rounded-xl p-3 mb-4 space-y-2">
        {dest.transports[0] && <TransportRow t={dest.transports[0]} />}
        {dest.transports[1] && <TransportRow t={dest.transports[1]} />}
        {dest.transports[2] && <TransportRow t={dest.transports[2]} />}
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">🏨 Hôtel ({dest.nbNuits} nuit{dest.nbNuits > 1 ? 's' : ''} × ~{dest.hotelNuit}€)</span>
          <span className="text-white font-medium">~{dest.hotelTotal}€</span>
        </div>
        <div className="border-t border-slate-700 pt-2 flex justify-between text-sm">
          <span className="text-slate-300 font-medium">Total estimé</span>
          <span className={`font-bold ${tc}`}>~{dest.totalEstime}€</span>
        </div>
      </div>
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
      <div className="flex gap-2 flex-wrap">
        {dest.transports[0] && <TransportBtn t={dest.transports[0]} />}
        {dest.transports[1] && <TransportBtn t={dest.transports[1]} />}
        {dest.transports[2] && <TransportBtn t={dest.transports[2]} />}
        <a href={dest.bookingUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2 px-2 rounded-lg transition-colors">
          🏨 Hôtel ↗
        </a>
      </div>
    </div>
  )
}

export default function ResultsGrid({ results, loading }: { results: Destination[], loading: boolean }) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((d, i) => <Card key={d.nom + i} dest={d} index={i} />)}
    </div>
  )
}
