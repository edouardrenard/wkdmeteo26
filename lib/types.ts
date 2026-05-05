export interface SearchParams {
  departDate: string   // date de départ (vendredi ou samedi)
  retourDate: string   // toujours dimanche
  nbNuits: number      // 1 (sam-dim) ou 2 (ven-dim)
  budget: number
  meteoPreference: 'soleil' | 'doux' | 'peu_pluie'
  partirVendredi: boolean
}

export interface Meteo {
  temp: number    // température moyenne sam+dim
  pluie: number   // précipitations moyennes sam+dim
  soleil: number  // heures de soleil moyennes sam+dim
}

export interface Transport {
  type: 'train' | 'voiture' | 'avion'
  prixAR: number
  source: 'reel' | 'estime'
  lien: string
  duree?: string
}

export interface Destination {
  // Identité
  nom: string
  region: string
  pays: string
  lat: number
  lon: number
  iata?: string

  // Transports disponibles
  transports: Transport[]
  meilleurTransport: Transport

  // Hébergement
  hotelNuit: number   // prix moyen par nuit
  hotelTotal: number  // × nbNuits

  // Total
  totalEstime: number

  // Météo
  meteo: Meteo | null

  // Scores
  scoreMeteo: number
  scorePrix: number
  scoreGlobal: number

  // Liens affiliation
  bookingUrl: string
}
