import { Destination, Meteo, SearchParams } from './types'

const TP_TOKEN = '74f9e5198dc096bdda20fec145988527'
const BOOKING_AID = '397594'

// Prix train SNCF indicatifs depuis Paris (min/max Open Data SNCF)
// Source : ressources.data.sncf.com/explore/dataset/tarifs-tgv-inoui-ouigo
const TRAINS_FR: Record<string, { prix_min: number, prix_max: number, duree: string }> = {
  'LYS': { prix_min: 19, prix_max: 89, duree: '2h' },
  'MRS': { prix_min: 19, prix_max: 109, duree: '3h20' },
  'NCE': { prix_min: 29, prix_max: 129, duree: '5h30' },
  'BOD': { prix_min: 19, prix_max: 79, duree: '2h' },
  'TLS': { prix_min: 19, prix_max: 89, duree: '4h20' },
  'NTE': { prix_min: 19, prix_max: 79, duree: '2h10' },
  'RNS': { prix_min: 19, prix_max: 69, duree: '2h' },
  'SXB': { prix_min: 19, prix_max: 79, duree: '1h50' },
  'DIJ': { prix_min: 14, prix_max: 59, duree: '1h35' },
  'LIL': { prix_min: 14, prix_max: 59, duree: '1h' },
  'MPL': { prix_min: 19, prix_max: 99, duree: '3h20' },
  'REN': { prix_min: 19, prix_max: 69, duree: '2h05' },
  'CLF': { prix_min: 19, prix_max: 69, duree: '2h50' },
  'NIM': { prix_min: 19, prix_max: 89, duree: '2h50' },
  'AVN': { prix_min: 19, prix_max: 79, duree: '2h40' },
}

const DESTINATIONS_BASE = [
  // Destinations avion Europe
  { nom: 'Lisbonne', pays: 'Portugal', region: 'Portugal', iata: 'LIS', lat: 38.72, lon: -9.14, vol_est: 89, hotel_est: 70, transport: 'avion' as const },
  { nom: 'Séville', pays: 'Espagne', region: 'Andalousie', iata: 'SVQ', lat: 37.39, lon: -5.99, vol_est: 79, hotel_est: 60, transport: 'avion' as const },
  { nom: 'Barcelone', pays: 'Espagne', region: 'Catalogne', iata: 'BCN', lat: 41.39, lon: 2.16, vol_est: 69, hotel_est: 90, transport: 'avion' as const },
  { nom: 'Rome', pays: 'Italie', region: 'Latium', iata: 'FCO', lat: 41.90, lon: 12.50, vol_est: 89, hotel_est: 95, transport: 'avion' as const },
  { nom: 'Amsterdam', pays: 'Pays-Bas', region: 'Hollande', iata: 'AMS', lat: 52.37, lon: 4.90, vol_est: 79, hotel_est: 100, transport: 'avion' as const },
  { nom: 'Prague', pays: 'Tchéquie', region: 'Bohême', iata: 'PRG', lat: 50.08, lon: 14.44, vol_est: 69, hotel_est: 55, transport: 'avion' as const },
  { nom: 'Athènes', pays: 'Grèce', region: 'Attique', iata: 'ATH', lat: 37.98, lon: 23.73, vol_est: 114, hotel_est: 70, transport: 'avion' as const },
  { nom: 'Budapest', pays: 'Hongrie', region: 'Pannonie', iata: 'BUD', lat: 47.50, lon: 19.04, vol_est: 84, hotel_est: 50, transport: 'avion' as const },
  { nom: 'Malte', pays: 'Malte', region: 'Malte', iata: 'MLA', lat: 35.90, lon: 14.51, vol_est: 104, hotel_est: 65, transport: 'avion' as const },
  { nom: 'Marrakech', pays: 'Maroc', region: 'Maroc', iata: 'RAK', lat: 31.63, lon: -8.00, vol_est: 109, hotel_est: 50, transport: 'avion' as const },
  // Destinations train France
  { nom: 'Lyon', pays: 'France', region: 'Auvergne-Rhône-Alpes', iata: 'LYS', lat: 45.75, lon: 4.85, vol_est: 999, hotel_est: 85, transport: 'train' as const },
  { nom: 'Marseille', pays: 'France', region: 'Provence-Alpes-Côte d\'Azur', iata: 'MRS', lat: 43.30, lon: 5.38, vol_est: 999, hotel_est: 80, transport: 'train' as const },
  { nom: 'Nice', pays: 'France', region: 'Provence-Alpes-Côte d\'Azur', iata: 'NCE', lat: 43.71, lon: 7.26, vol_est: 999, hotel_est: 90, transport: 'train' as const },
  { nom: 'Bordeaux', pays: 'France', region: 'Nouvelle-Aquitaine', iata: 'BOD', lat: 44.84, lon: -0.58, vol_est: 999, hotel_est: 80, transport: 'train' as const },
  { nom: 'Toulouse', pays: 'France', region: 'Occitanie', iata: 'TLS', lat: 43.60, lon: 1.44, vol_est: 999, hotel_est: 75, transport: 'train' as const },
  { nom: 'Nantes', pays: 'France', region: 'Pays de la Loire', iata: 'NTE', lat: 47.22, lon: -1.55, vol_est: 999, hotel_est: 75, transport: 'train' as const },
  { nom: 'Strasbourg', pays: 'France', region: 'Grand Est', iata: 'SXB', lat: 48.58, lon: 7.75, vol_est: 999, hotel_est: 80, transport: 'train' as const },
  { nom: 'Dijon', pays: 'France', region: 'Bourgogne-Franche-Comté', iata: 'DIJ', lat: 47.32, lon: 5.04, vol_est: 999, hotel_est: 65, transport: 'train' as const },
  { nom: 'Lille', pays: 'France', region: 'Hauts-de-France', iata: 'LIL', lat: 50.63, lon: 3.07, vol_est: 999, hotel_est: 75, transport: 'train' as const },
  { nom: 'Montpellier', pays: 'France', region: 'Occitanie', iata: 'MPL', lat: 43.61, lon: 3.88, vol_est: 999, hotel_est: 75, transport: 'train' as const },
  { nom: 'Rennes', pays: 'France', region: 'Bretagne', iata: 'REN', lat: 48.11, lon: -1.68, vol_est: 999, hotel_est: 70, transport: 'train' as const },
  { nom: 'Clermont-Ferrand', pays: 'France', region: 'Auvergne-Rhône-Alpes', iata: 'CLF', lat: 45.78, lon: 3.08, vol_est: 999, hotel_est: 60, transport: 'train' as const },
  { nom: 'Nîmes', pays: 'France', region: 'Occitanie', iata: 'NIM', lat: 43.84, lon: 4.36, vol_est: 999, hotel_est: 65, transport: 'train' as const },
  { nom: 'Avignon', pays: 'France', region: 'Provence-Alpes-Côte d\'Azur', iata: 'AVN', lat: 43.95, lon: 4.81, vol_est: 999, hotel_est: 70, transport: 'train' as const },
]

async function fetchMeteo(lat: number, lon: number, startDate: string, endDate: string): Promise<Meteo | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,sunshine_duration&timezone=Europe%2FParis&start_date=${startDate}&end_date=${endDate}`
    const r = await fetch(url)
    const d = await r.json()
    if (!d.daily || !d.daily.temperature_2m_max.length) return null
    const n = d.daily.temperature_2m_max.length
    return {
      temp: Math.round(d.daily.temperature_2m_max.reduce((a: number, b: number) => a + b, 0) / n),
      pluie: Math.round(d.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0) / n * 10) / 10,
      soleil: Math.round(d.daily.sunshine_duration.reduce((a: number, b: number) => a + b, 0) / n / 3600),
    }
  } catch { return null }
}

async function fetchPrixVol(origIata: string, destIata: string, departDate: string, retourDate: string): Promise<number | null> {
  try {
    const [resAller, resRetour] = await Promise.all([
      fetch(`https://api.travelpayouts.com/v2/prices/latest?origin=${origIata}&destination=${destIata}&depart_date=${departDate}&currency=eur&one_way=true&token=${TP_TOKEN}`),
      fetch(`https://api.travelpayouts.com/v2/prices/latest?origin=${destIata}&destination=${origIata}&depart_date=${retourDate}&currency=eur&one_way=true&token=${TP_TOKEN}`)
    ])
    const [dataAller, dataRetour] = await Promise.all([resAller.json(), resRetour.json()])
    const volsAller: number[] = dataAller.success && dataAller.data?.length
      ? dataAller.data.map((v: any) => v.value).sort((a: number, b: number) => a - b).slice(0, 3)
      : []
    const volsRetour: number[] = dataRetour.success && dataRetour.data?.length
      ? dataRetour.data.map((v: any) => v.value).sort((a: number, b: number) => a - b).slice(0, 3)
      : []
    if (!volsAller.length && !volsRetour.length) return null
    const moyAller = volsAller.length ? volsAller.reduce((a, b) => a + b, 0) / volsAller.length : 0
    const moyRetour = volsRetour.length ? volsRetour.reduce((a, b) => a + b, 0) / volsRetour.length : 0
    return Math.round(moyAller + moyRetour)
  } catch { return null }
}

function getPrixTrain(iata: string): number | null {
  const data = TRAINS_FR[iata]
  if (!data) return null
  // Prix moyen A/R estimé = (min + max) / 2 * 2
  return Math.round((data.prix_min + data.prix_max) / 2 * 2)
}

function getDureeTrain(iata: string): string {
  return TRAINS_FR[iata]?.duree || ''
}

function scoreMeteo(m: Meteo | null, pref: string): number {
  if (!m) return 40
  let s = 0
  if (pref === 'soleil') {
    s += Math.min(40, m.soleil * 4)
    s += m.temp >= 24 ? 30 : m.temp >= 20 ? 20 : m.temp >= 16 ? 10 : 0
    s += m.pluie === 0 ? 30 : m.pluie < 2 ? 20 : m.pluie < 5 ? 10 : 0
  } else if (pref === 'doux') {
    s += m.temp >= 16 && m.temp <= 26 ? 40 : m.temp >= 12 ? 25 : 10
    s += Math.min(30, m.soleil * 3)
    s += m.pluie < 5 ? 30 : m.pluie < 10 ? 20 : 10
  } else {
    s += m.pluie === 0 ? 50 : m.pluie < 2 ? 40 : m.pluie < 5 ? 25 : m.pluie < 10 ? 10 : 0
    s += m.temp >= 14 ? 30 : m.temp >= 10 ? 20 : 10
    s += Math.min(20, m.soleil * 2)
  }
  return Math.min(100, Math.round(s))
}

function scorePrix(meilleurPrix: number, hotelTotal: number, budget: number): number {
  const total = meilleurPrix + hotelTotal
  if (total > budget) return Math.max(0, Math.round(100 - (total - budget) / budget * 80))
  return Math.round(80 + ((budget - total) / budget) * 20)
}

export async function searchDestinations(params: SearchParams): Promise<Destination[]> {
  const { departIata, budget, meteoPreference, departDate, retourDate, nbNuits } = params

  const satDate = nbNuits === 1 ? departDate : (() => {
    const d = new Date(departDate)
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })()

  const resultats: Destination[] = []
  const BATCH = 4

  for (let i = 0; i < DESTINATIONS_BASE.length; i += BATCH) {
    const batch = DESTINATIONS_BASE.slice(i, i + BATCH)
    const fetches = batch.map(d => Promise.all([
      fetchMeteo(d.lat, d.lon, satDate, retourDate),
      d.transport === 'avion' ? fetchPrixVol(departIata, d.iata, departDate, retourDate) : Promise.resolve(null),
    ]))
    const batchResults = await Promise.all(fetches)

    batch.forEach((d, j) => {
      const [meteo, prixVolReel] = batchResults[j]

      // Prix avion
      const vol = d.transport === 'avion' ? (prixVolReel ?? d.vol_est) : null
      const volSource: 'reel' | 'estime' = prixVolReel ? 'reel' : 'estime'

      // Prix train
      const train = d.transport === 'train' ? getPrixTrain(d.iata) : null
      const trainSource = d.transport === 'train' ? 'estime' as const : null

      // Meilleur transport
      const meilleurPrix = d.transport === 'train' ? (train ?? 999) : (vol ?? 999)
      const meilleurTransport = d.transport === 'train' ? 'train' as const : 'avion' as const

      const hotelNuit = d.hotel_est
      const hotelTotal = hotelNuit * nbNuits
      const totalEstime = meilleurPrix + hotelTotal

      const sm = scoreMeteo(meteo, meteoPreference)
      const sp = scorePrix(meilleurPrix, hotelTotal, budget)
      const sg = Math.round(sm * 0.55 + sp * 0.45)

      const kiwiUrl = `https://www.kiwi.com/fr/search/results/Paris/${encodeURIComponent(d.nom)}/${departDate}/${retourDate}?affilid=${TP_TOKEN}`
      const bookingUrl = `https://www.booking.com/searchresults.fr.html?ss=${encodeURIComponent(d.nom)}&checkin=${departDate}&checkout=${retourDate}&aid=${BOOKING_AID}`
      const omioUrl = `https://www.omio.fr/trains/paris/${encodeURIComponent(d.nom.toLowerCase())}?departureDate=${departDate}&returnDate=${retourDate}`

      resultats.push({
        ...d,
        meteo,
        vol: vol ?? 0,
        volSource,
        train,
        trainSource,
        meilleurPrix,
        meilleurTransport,
        hotel: hotelNuit,
        hotelTotal,
        nbNuits,
        totalEstime,
        scoreMeteo: sm,
        scorePrix: sp,
        scoreGlobal: sg,
        kiwiUrl,
        bookingUrl,
        omioUrl,
      })
    })
  }

  return resultats
    .filter(r => r.totalEstime <= budget * 1.25)
    .sort((a, b) => b.scoreGlobal - a.scoreGlobal)
    .slice(0, 20)
}
