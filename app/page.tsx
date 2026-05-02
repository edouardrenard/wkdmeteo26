'use client'

import { useState } from 'react'
import SearchForm from '@/components/SearchForm'
import ResultsGrid from '@/components/ResultsGrid'
import { Destination, SearchParams } from '@/lib/types'
import { searchDestinations } from '@/lib/search'

export default function Home() {
  const [results, setResults] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [currentParams, setCurrentParams] = useState<SearchParams | null>(null)

  const handleSearch = async (params: SearchParams) => {
    setLoading(true)
    setSearched(true)
    setCurrentParams(params)
    const destinations = await searchDestinations(params)
    setResults(destinations)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🌤️</span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">WeekendIdéal</h1>
            <p className="text-xs text-slate-400">Trouve où partir selon la météo et ton budget</p>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {!searched && (
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Où partir ce weekend ?
            </h2>
            <p className="text-slate-400 text-lg">
              Entre ton budget et ta météo idéale — on trouve les meilleures destinations en temps réel.
            </p>
          </div>
        )}
        <SearchForm onSearch={handleSearch} loading={loading} />
        {searched && (
          <ResultsGrid results={results} loading={loading} params={currentParams} />
        )}
      </div>
    </main>
  )
}
