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
  region?: string
  iata: string
  lat: number
  lon: number
  transport: 'avion' | 'train' | 'les deux'
  meteo: Meteo | null
  vol: number
  volSource: 'reel' | 'estime'
  train: number | null
  trainSource: 'reel' | 'estime' | null
  meilleurPrix: number
  meilleurTransport: 'avion' | 'train'
  hotel: number
  hotelTotal: number
  nbNuits: number
  totalEstime: number
  scoreMeteo: number
  scorePrix: number
  scoreGlobal: number
  kiwiUrl: string
  bookingUrl: string
  omioUrl: string
}
