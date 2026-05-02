export interface SearchParams {
  depart: string
  departIata: string
  budget: number
  meteoPreference: 'soleil' | 'doux' | 'peu_pluie'
  departDate: string
  retourDate: string
  nbNuits: number
  weekendIndex: number
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
  hotelTotal: number
  nbNuits: number
  totalEstime: number
  scoreMeteo: number
  scorePrix: number
  scoreGlobal: number
  kiwiUrl: string
  bookingUrl: string
}
