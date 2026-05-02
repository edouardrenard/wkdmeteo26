'use client'

import { useState } from 'react'
import { SearchParams } from '@/lib/types'

const VILLES = [
  { label: 'Paris', iata: 'PAR' },
  { label: 'Lyon', iata: 'LYS' },
  { label: 'Marseille', iata: 'MRS' },
  { label: 'Bordeaux', iata: 'BOD' },
  { label: 'Lille', iata: 'LIL' },
]

function getWeekends() {
  const weekends = []
  const today = new Date()
  const day = today.getDay()
  let nextSat = new Date(today)
  nextSat.setDate(today.getDate() + ((6 - day + 7) % 7 || 7))
  for (let i = 0; i < 4; i++) {
    const sat = new Date(nextSat)
    sat.setDate(nextSat.getDate() + i * 7)
    const sun = new Date(sat)
    sun.setDate(sat.getDate() + 1)
    const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    weekends.push({
      label: `${fmt(sat)} – ${fmt(sun)}`,
      satDate: sat.toISOString().split('T')[0],
      sunDate: sun.toISOString().split('T')[0],
    })
  }
  return weekends
}

export default function SearchForm({ onSearch, loading }: { onSearch: (p: SearchParams) => void, loading: boolean }) {
  const [depart, setDepart] = useState('Paris')
  const [weekendIndex, setWeekendIndex] = useState(0)
  const [budget, setBudget] = useState(300)
  const [meteoPreference, setMeteoPreference] = useState<'soleil' | 'doux' | 'peu_pluie'>('soleil')
  const weekends = getWeekends()

  const handleSubmit = () => {
    const ville = VILLES.find(v => v.label === depart)!
    const wk = weekends[weekendIndex]
    onSearch({
      depart,
      departIata: ville.iata,
      weekendIndex,
      budget,
      meteoPreference,
      satDate: wk.satDate,
      sunDate: wk.sunDate,
    })
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div>
          <label className="block text-xs text-slate-400 mb-2">Ville de départ</label>
          <select
            value={depart}
            onChange={e => setDepart(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          >
            {VILLES.map(v => <option key={v.label}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2">Weekend</label>
          <select
            value={weekendIndex}
            onChange={e => setWeekendIndex(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          >
            {weekends.map((w, i) => <option key={i} value={i}>{w.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2">Météo souhaitée</label>
          <select
            value={meteoPreference}
            onChange={e => setMeteoPreference(e.target.value as 'soleil' | 'doux' | 'peu_pluie')}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          >
            <option value="soleil">☀️ Soleil / chaud</option>
            <option value="doux">⛅ Doux / nuageux OK</option>
            <option value="peu_pluie">🌂 Peu de pluie</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2">
            Budget total : <span className="text-white font-medium">{budget} €</span>
          </label>
          <input
            type="range" min={100} max={600} step={10} value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full accent-sky-500 mt-1"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>100€</span><span>600€</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        {loading ? 'Recherche en cours…' : 'Trouver mon weekend idéal →'}
      </button>
    </div>
  )
}
