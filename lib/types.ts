export interface SearchParams {
  depart: string
  departIata: string
  weekendIndex: number
  budget: number
  meteoPreference: 'soleil' | 'doux' | 'peu_pluie'
  satDate: string
  sunDate: string
}

export interface Meteo {
  temp: number
  pluie: number
  soleil: number
}

export interface Destination {
  nom: string
  pays: string
  iata: string
  lat: number
  lon: number
  meteo: Meteo | null
  vol: number
  volSource: 'reel' | 'estime'
  hotel: number
  scoreMeteo: number
  scorePrix: number
  scoreGlobal: number
  kiwiUrl: string
  bookingUrl: string
}
