export interface SearchParams {
  departDate: string
  retourDate: string
  nbNuits: number
  budget: number
  meteoPreference: 'soleil' | 'doux' | 'peu_pluie'
  partirVendredi: boolean
}

export interface Meteo {
  temp: number
  pluie: number
  soleil: number
}

export interface Transport {
  type: 'train' | 'voiture' | 'avion'
  prixAR: number
  source: 'reel' | 'estime'
  lien: string
  duree?: string
}

export interface Destination {
  nom: string
  region: string
  pays: string
  lat: number
  lon: number
  iata?: string
  transports: Transport[]
  meilleurTransport: Transport
  hotelNuit: number
  hotelTotal: number
  nbNuits: number
  totalEstime: number
  meteo: Meteo | null
  scoreMeteo: number
  scorePrix: number
  scoreGlobal: number
  bookingUrl: string
}
