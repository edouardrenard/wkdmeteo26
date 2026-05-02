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

function getOptions() {
  const options = []
  const today = new Date()
  const day = today.getDay()

  // Prochain vendredi
  let nextFri = new Date(today)
  nextFri.setDate(today.getDate() + ((5 - day + 7) % 7 || 7))

  // Prochain samedi
  let nextSat = new Date(today)
  nextSat.setDate(today.getDate() + ((6 - day + 7) % 7 || 7))

  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  for (let i = 0; i < 4; i++) {
    const fri = new Date(nextFri); fri.setDate(nextFri.getDate() + i * 7)
    const sat = new Date(nextSat); sat.setDate(nextSat.getDate() + i * 7)
    const sun = new Date(sat);     sun.setDate(sat.getDate() + 1)

    // Option départ samedi (2 nuits)
    options.push({
      label: `Sam ${fmt(sat)} – Dim ${fmt(sun)} (2 nuits)`,
      departDate: sat.toISOString().split('T')[0],
      retourDate: sun.toISOString().split('T')[0],
      nbNuits: 1,
      type: 'weekend',
    })

    // Option départ vendredi (3 nuits)
    options.push({
      label: `Ven ${fmt(fri)} – Dim ${fmt(sun)} (3 nuits)`,
      departDate: fri.toISOString().split('T')[0],
      retourDate: sun.toISOString().split('T')[0],
      nbNuits: 2,
      type: 'long',
    })
  }

  return options.sort((a, b) => a.departDate.localeCompare(b.departDate))
}

export default function SearchForm({
  onSearch,
  loading,
}: {
  onSearch: (p: SearchParams) => void
  loading: boolean
}) {
  const [depart, setDepart] = useState('Paris')
  const [optionIndex, setOptionIndex] = useState(0)
  const [budget, setBudget] = useState(400)
  const [meteoPreference, setMeteoPreference] = useState<'soleil' | 'doux' | 'peu_pluie'>('soleil')
  const options = getOptions()

  const handleSubmit = () => {
    const ville = VILLES.find(v => v.label === depart)!
    const opt = options[optionIndex]
    onSearch({
      depart,
      departIata: ville.iata,
      budget,
      meteoPreference,
      departDate: opt.departDate,
      retourDate: opt.retourDate,
      nbNuits: opt.nbNuits,
      weekendIndex: optionIndex,
    })
  }

  const selectedOpt = options[optionIndex]

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
          <label className="block text-xs text-slate-400 mb-2">Dates</label>
          <select
            value={optionIndex}
            onChange={e => setOptionIndex(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          >
            {options.map((o, i) => (
              <option key={i} value={i}>{o.label}</option>
            ))}
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
            type="range" min={100} max={800} step={10} value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full accent-sky-500 mt-1"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>100€</span><span>800€</span>
          </div>
        </div>
      </div>

      {/* Résumé du séjour sélectionné */}
      <div className="bg-slate-800 rounded-xl px-4 py-3 mb-4 flex items-center gap-3 text-sm">
        <span>{selectedOpt.type === 'long' ? '🗓️' : '📅'}</span>
        <span className="text-slate-300">
          {selectedOpt.nbNuits === 1 ? 'Weekend 2 jours' : 'Long weekend 3 jours'} ·{' '}
          <span className="text-white font-medium">{selectedOpt.nbNuits + 1} jours / {selectedOpt.nbNuits} nuit{selectedOpt.nbNuits > 1 ? 's' : ''}</span> ·{' '}
          Budget hôtel estimé : <span className="text-sky-400 font-medium">~{selectedOpt.nbNuits} × prix/nuit</span>
        </span>
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
