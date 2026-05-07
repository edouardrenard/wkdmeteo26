'use client'

import { useState } from 'react'
import { SearchParams } from '@/lib/types'

function getWeekends() {
  const weekends = []
  const today = new Date()
  const day = today.getDay()
  let nextSat = new Date(today)
  nextSat.setDate(today.getDate() + ((6 - day + 7) % 7 || 7))
  for (let i = 0; i < 4; i++) {
    const sat = new Date(nextSat)
    sat.setDate(nextSat.getDate() + i * 7)
    const fri = new Date(sat)
    fri.setDate(sat.getDate() - 1)
    const sun = new Date(sat)
    sun.setDate(sat.getDate() + 1)
    const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    weekends.push({
      label: fmt(sat) + ' – ' + fmt(sun),
      satDate: sat.toISOString().split('T')[0],
      sunDate: sun.toISOString().split('T')[0],
      friDate: fri.toISOString().split('T')[0],
    })
  }
  return weekends
}

export default function SearchForm({ onSearch, loading }: {
  onSearch: (p: SearchParams) => void
  loading: boolean
}) {
  const [weekendIdx, setWeekendIdx] = useState(0)
  const [budget, setBudget] = useState(300)
  const [vendredi, setVendredi] = useState(false)
  const weekends = getWeekends()
  const wk = weekends[weekendIdx]

  const handleSubmit = () => {
    onSearch({
      departDate: vendredi ? wk.friDate : wk.satDate,
      retourDate: wk.sunDate,
      nbNuits: vendredi ? 2 : 1,
      budget,
      partirVendredi: vendredi,
    })
  }

  const onChangeWeekend = (e: React.ChangeEvent<HTMLSelectElement>) => setWeekendIdx(Number(e.currentTarget.value))
  const onChangeBudget = (e: React.ChangeEvent<HTMLInputElement>) => setBudget(Number(e.currentTarget.value))
  const onChangeVendredi = (e: React.ChangeEvent<HTMLInputElement>) => setVendredi(e.currentTarget.checked)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-slate-400 mb-2">Weekend</label>
          <select
            value={weekendIdx}
            onChange={onChangeWeekend}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          >
            {weekends.map((w, i) => (
              <option key={i} value={i}>{w.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2">
            Budget : <span className="text-white font-medium">{budget}€</span>
          </label>
          <input
            type="range" min={100} max={800} step={10} value={budget}
            onChange={onChangeBudget}
            className="w-full accent-sky-500 mt-2"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>100€</span><span>800€</span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2">Options</label>
          <label className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-sky-500 transition-colors">
