import { Destination, Meteo, SearchParams, Transport } from './types'

const TP_TOKEN = '74f9e5198dc096bdda20fec145988527'
const BOOKING_AID = '397594'

// Coût voiture au km (barème fiscal 2024, véhicule 5CV)
const COUT_KM = 0.21

// Destinations avec distances depuis Paris en km
const DESTINATIONS_BASE = [
  // France — train + voiture
  { nom: 'Lyon', region: 'Auvergne-Rhône-Alpes', pays: 'France', lat: 45.75, lon: 4.85, iata: 'LYS', distanceKm: 465, trainMin: 19, trainMax: 89, trainDuree: '2h', hotel: 85 },
  { nom: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', pays: 'France', lat: 43.30, lon: 5.38, iata: 'MRS', distanceKm: 775, trainMin: 19, trainMax: 109, trainDuree: '3h20', hotel: 80 },
  { nom: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', pays: 'France', lat: 43.71, lon: 7.26, iata: 'NCE', distanceKm: 930, trainMin: 29, trainMax: 129, trainDuree: '5h30', hotel: 90 },
  { nom: 'Bordeaux', region: 'Nouvelle-Aquitaine', pays: 'France', lat: 44.84, lon: -0.58, iata: 'BOD', distanceKm: 580, trainMin: 19, trainMax: 79, trainDuree: '2h', hotel: 80 },
  { nom: 'Toulouse', region: 'Occitanie', pays: 'France', lat: 43.60, lon: 1.44, iata: 'TLS', distanceKm: 680, trainMin: 19, trainMax: 89, trainDuree: '4h20', hotel: 75 },
  { nom: 'Nantes', region: 'Pays de la Loire', pays: 'France', lat: 47.22, lon: -1.55, iata: 'NTE', distanceKm: 385, trainMin: 19, trainMax: 79, trainDuree: '2h10', hotel: 75 },
  { nom: 'Strasbourg', region: 'Grand Est', pays: 'France', lat: 48.58, lon: 7.75, iata: 'SXB', distanceKm: 490, trainMin: 19, trainMax: 79, trainDuree: '1h50', hotel: 80 },
  { nom: 'Dijon', region: 'Bourgogne-Franche-Comté', pays: 'France', lat: 47.32, lon: 5.04, iata: 'DIJ', distanceKm: 310, trainMin: 14, trainMax: 59, trainDuree: '1h35', hotel: 65 },
  { nom: 'Lille', region: 'Hauts-de-France', pays: 'France', lat: 50.63, lon: 3.07, iata: 'LIL', distanceKm: 220, trainMin: 14, trainMax: 59, trainDuree: '1h', hotel: 75 },
  { nom: 'Montpellier', region: 'Occitanie', pays: 'France', lat: 43.61, lon: 3.88, iata: 'MPL', distanceKm: 750, trainMin: 19, trainMax: 99, trainDuree: '3h20', hotel: 75 },
  { nom: 'Rennes', region: 'Bretagne', pays: 'France', lat: 48.11, lon: -1.68, iata: 'RNS', distanceKm: 350, trainMin: 19, trainMax: 69, trainDuree: '2h05', hotel: 70 },
  { nom: 'Avignon', region: 'Provence-Alpes-Côte d\'Azur', pays: 'France', lat: 43.95, lon: 4.81, iata: 'AVN', distanceKm: 690, trainMin: 19, trainMax: 79, trainDuree: '2h40', hotel: 70 },
  { nom: 'Nîmes', region: 'Occitanie', pays: 'France', lat: 43.84, lon: 4.36, iata: 'NIM', distanceKm: 720, trainMin: 19, trainMax: 89, trainDuree: '2h50', hotel: 65 },
  { nom: 'Biarritz', region: 'Nouvelle-Aquitaine', pays: 'France', lat: 43.48, lon: -1.56, iata: 'BIQ', distanceKm: 760, trainMin: 29, trainMax: 99, trainDuree: '4h30', hotel: 90 },
  { nom: 'Annecy', region: 'Auvergne-Rhône-Alpes', pays: 'France', lat: 45.90, lon: 6.12, iata: 'NCY', distanceKm: 545, trainMin: 24, trainMax: 79, trainDuree: '3h30', hotel: 85 },
  // Europe — avion
  { nom: 'Lisbonne', region: 'Portugal', pays: 'Portugal', lat: 38.72, lon: -9.14, iata: 'LIS', distanceKm: 1800, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 70 },
  { nom: 'Barcelone', region: 'Catalogne', pays: 'Espagne', lat: 41.39, lon: 2.16, iata: 'BCN', distanceKm: 1100, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 90 },
  { nom: 'Rome', region: 'Latium', pays: 'Italie', lat: 41.90, lon: 12.50, iata: 'FCO', distanceKm: 1400, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 95 },
  { nom: 'Amsterdam', region: 'Hollande', pays: 'Pays-Bas', lat: 52.37, lon: 4.90, iata: 'AMS', distanceKm: 500, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 100 },
  { nom: 'Prague', region: 'Bohême', pays: 'Tchéquie', lat: 50.08, lon: 14.44, iata: 'PRG', distanceKm: 1100, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 55 },
  { nom: 'Séville', region: 'Andalousie', pays: 'Espagne', lat: 37.39, lon: -5.99, iata: 'SVQ', distanceKm: 1700, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 60 },
  { nom: 'Budapest', region: 'Pannonie', pays: 'Hongrie', lat: 47.50, lon: 19.04, iata: 'BUD', distanceKm: 1500, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 50 },
  { nom: 'Marrakech', region: 'Maroc', pays: 'Maroc', lat: 31.63, lon: -8.00, iata: 'RAK', distanceKm: 2300, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 50 },
  { nom: 'Athènes', region: 'Attique', pays: 'Grèce', lat: 37.98, lon: 23.73, iata: 'ATH', distanceKm: 2400, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 70 },
  { nom: 'Madrid', region: 'Castille', pays: 'Espagne', lat: 40.42, lon: -3.70, iata: 'MAD', distanceKm: 1300, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 75 },
]

async function fetchMeteo(lat: number, lon: number, satDate: string, sunDate: string): Promise<Meteo | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,sunshine_duration&timezone=Europe%2FParis&start_date=${satDate}&end_date=${sunDate}`
    const r = await fetch(url)
    const d = await r.json()
    if (!d.daily?.temperature_2m_max?.length) return null
    const n = d.daily.temperature_2m_max.length
    return {
      temp: Math.round(d.daily.temperature_2m_max.reduce((a: number, b: number) => a + b, 0) / n),
      pluie: Math.round(d.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0) / n * 10) / 10,
      soleil: Math.round(d.daily.sunshine_duration.reduce((a: number, b: number) => a + b, 0) / n / 3600),
    }
  } catch { return null }
}

async function fetchPrixVol(destIata: string, departDate: string, retourDate: string): Promise<number | null> {
  try {
    const [r1, r2] = await Promise.all([
      fetch(`https://api.travelpayouts.com/v2/prices/latest?origin=PAR&destination=${destIata}&depart_date=${departDate}&currency=eur&one_way=true&token=${TP_TOKEN}`),
      fetch(`https://api.travelpayouts.com/v2/prices/latest?origin=${destIata}&destination=PAR&depart_date=${retourDate}&currency=eur&one_way=true&token=${TP_TOKEN}`)
    ])
    const [d1, d2] = await Promise.all([r1.json(), r2.json()])
    const aller = d1.success && d1.data?.length ? Math.min(...d1.data.slice(0,3).map((v: any) => v.value)) : null
    const retour = d2.success && d2.data?.length ? Math.min(...d2.data.slice(0,3).map((v: any) => v.value)) : null
    if (!aller && !retour) return null
    return Math.round((aller || 0) + (retour || 0))
  } catch { return null }
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
  const { departDate, retourDate, nbNuits, budget, meteoPreference } = params

  // Dates météo : toujours sam + dim
  const satDate = nbNuits === 1 ? departDate : (() => {
    const d = new Date(departDate); d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })()
  const sunDate = retourDate

  const resultats: Destination[] = []
  const BATCH = 4

  for (let i = 0; i < DESTINATIONS_BASE.length; i += BATCH) {
    const batch = DESTINATIONS_BASE.slice(i, i + BATCH)
    const fetches = batch.map(d => Promise.all([
      fetchMeteo(d.lat, d.lon, satDate, sunDate),
      d.trainMin < 500 ? Promise.resolve(null) : fetchPrixVol(d.iata!, departDate, retourDate),
    ]))
    const batchResults = await Promise.all(fetches)

    batch.forEach((d, j) => {
      const [meteo, prixVol] = batchResults[j]

      const transports: Transport[] = []

      // Train (destinations françaises)
      if (d.trainMin < 500) {
        const prixTrainAR = Math.round((d.trainMin + d.trainMax) / 2 * 2)
        transports.push({
          type: 'train',
          prixAR: prixTrainAR,
          source: 'estime',
          lien: `https://www.omio.fr/trains/paris/${encodeURIComponent(d.nom.toLowerCase())}?departureDate=${departDate}&returnDate=${retourDate}`,
          duree: d.trainDuree,
        })
      }

      // Voiture (toutes destinations < 1000km)
      if (d.distanceKm < 1000) {
        const prixVoitureAR = Math.round(d.distanceKm * 2 * COUT_KM)
        transports.push({
          type: 'voiture',
          prixAR: prixVoitureAR,
          source: 'estime',
          lien: `https://www.viamichelin.fr/web/itineraires?from=Paris&to=${encodeURIComponent(d.nom)}`,
          duree: `~${Math.round(d.distanceKm / 100)}h`,
        })
      }

      // Avion (destinations européennes)
      if (d.trainMin >= 500) {
        const prixAvion = prixVol ?? Math.round(d.distanceKm * 0.07 + 30)
        transports.push({
          type: 'avion',
          prixAR: prixAvion,
          source: prixVol ? 'reel' : 'estime',
          lien: `https://www.kiwi.com/fr/search/results/Paris/${encodeURIComponent(d.nom)}/${departDate}/${retourDate}?affilid=${TP_TOKEN}`,
        })
      }

      if (!transports.length) return

      // Meilleur transport = le moins cher
      const meilleurTransport = transports.reduce((a, b) => a.prixAR < b.prixAR ? a : b)

      const hotelNuit = d.hotel
      const hotelTotal = hotelNuit * nbNuits
      const totalEstime = meilleurTransport.prixAR + hotelTotal

      const sm = scoreMeteo(meteo, meteoPreference)
      const sp = scorePrix(meilleurTransport.prixAR, hotelTotal, budget)
      const sg = Math.round(sm * 0.55 + sp * 0.45)

      const bookingUrl = `https://www.booking.com/searchresults.fr.html?ss=${encodeURIComponent(d.nom)}&checkin=${departDate}&checkout=${retourDate}&aid=${BOOKING_AID}`

      resultats.push({
        nom: d.nom,
        region: d.region,
        pays: d.pays,
        lat: d.lat,
        lon: d.lon,
        iata: d.iata,
        transports,
        meilleurTransport,
        hotelNuit,
        hotelTotal,
        nbNuits,
        totalEstime,
        meteo,
        scoreMeteo: sm,
        scorePrix: sp,
        scoreGlobal: sg,
        bookingUrl,
      })
    })
  }

  return resultats
    .filter(r => r.totalEstime <= budget * 1.3)
    .sort((a, b) => b.scoreGlobal - a.scoreGlobal)
    .slice(0, 25)
}
