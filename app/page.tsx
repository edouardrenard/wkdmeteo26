'use client'

import { useState } from 'react'
import { SearchParams, Destination } from '@/lib/types'
import { searchDestinations } from '@/lib/search'
import SearchForm from '@/components/SearchForm'
import MapView from '@/components/MapView'
import ResultsGrid from '@/components/ResultsGrid'

export default function Home() {
  const [results, setResults] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [view, setView] = useState<'map' | 'list'>('map')

  const handleSearch = async (params: SearchParams) => {
    setLoading(true)
    setSearched(true)
    const data = await searchDestinations(params)
    setResults(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌤️</span>
            <div>
              <h1 className="text-lg font-semibold">WeekendIdéal</h1>
              <p className="text-xs text-slate-400">Où partir ce weekend ? Météo · Train · Voiture · Hôtel</p>
            </div>
          </div>
          {searched && !loading && (
            <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setView('map')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'map' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                🗺️ Carte
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'list' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                📋 Liste
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!searched && (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Où partir ce weekend ?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Compare la météo, le train, la voiture et les hôtels pour trouver ta destination idéale.
            </p>
          </div>
        )}

        <SearchForm onSearch={handleSearch} loading={loading} />

        {searched && (
          <div>
            {!loading && results.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-400">
                  <span className="text-white font-medium">{results.length} destinations</span>
                  {view === 'map' ? ' — clique sur un cercle pour les détails' : ' — triées par score'}
                </p>
                <p className="text-xs text-slate-500">Météo Open-Meteo · Train SNCF estimé · Voiture 0.21€/km</p>
              </div>
            )}
            {view === 'map'
              ? <MapView results={results} loading={loading} />
              : <ResultsGrid results={results} loading={loading} />
            }
          </div>
        )}
      </div>
    </main>
  )
}
