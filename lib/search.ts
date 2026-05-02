import { Destination, Meteo, SearchParams } from './types'

const TP_TOKEN = '74f9e5198dc096bdda20fec145988527'
const BOOKING_AID = '397594'

const VOL_AJUST: Record<string, number> = {
  Paris: 0, Lyon: 15, Marseille: 10, Bordeaux: 20, Lille: 10,
}

const DESTINATIONS_BASE = [
  { nom: 'Lisbonne',         pays: 'Portugal',   iata: 'LIS', lat: 38.72, lon: -9.14,  vol_est: 89,  hotel_est: 70  },
  { nom: 'Séville',          pays: 'Espagne',     iata: 'SVQ', lat: 37.39, lon: -5.99,  vol_est: 79,  hotel_est: 60  },
  { nom: 'Barcelone',        pays: 'Espagne',     iata: 'BCN', lat: 41.39, lon: 2.16,   vol_est: 69,  hotel_est: 90  },
  { nom: 'Valence',          pays: 'Espagne',     iata: 'VLC', lat: 39.47, lon: -0.38,  vol_est: 74,  hotel_est: 55  },
  { nom: 'Porto',            pays: 'Portugal',   iata: 'OPO', lat: 41.16, lon: -8.63,  vol_est: 84,  hotel_est: 60  },
  { nom: 'Madrid',           pays: 'Espagne',     iata: 'MAD', lat: 40.42, lon: -3.70,  vol_est: 72,  hotel_est: 75  },
  { nom: 'Rome',             pays: 'Italie',      iata: 'FCO', lat: 41.90, lon: 12.50,  vol_est: 89,  hotel_est: 95  },
  { nom: 'Amsterdam',        pays: 'Pays-Bas',    iata: 'AMS', lat: 52.37, lon: 4.90,   vol_est: 79,  hotel_est: 100 },
  { nom: 'Prague',           pays: 'Tchéquie',    iata: 'PRG', lat: 50.08, lon: 14.44,  vol_est: 69,  hotel_est: 55  },
  { nom: 'Nice',             pays: 'France',      iata: 'NCE', lat: 43.71, lon: 7.26,   vol_est: 49,  hotel_est: 85  },
  { nom: 'Palma de Majorque',pays: 'Espagne',     iata: 'PMI', lat: 39.57, lon: 2.65,   vol_est: 94,  hotel_est: 65  },
  { nom: 'Athènes',          pays: 'Grèce',       iata: 'ATH', lat: 37.98, lon: 23.73,  vol_est: 114, hotel_est: 70  },
  { nom: 'Bruxelles',        pays: 'Belgique',    iata: 'BRU', lat: 50.85, lon: 4.35,   vol_est: 44,  hotel_est: 75  },
  { nom: 'Milan',            pays: 'Italie',      iata: 'MXP', lat: 45.46, lon: 9.19,   vol_est: 64,  hotel_est: 85  },
  { nom: 'Budapest',         pays: 'Hongrie',     iata: 'BUD', lat: 47.50, lon: 19.04,  vol_est: 84,  hotel_est: 50  },
  { nom: 'Cracovie',         pays: 'Pologne',     iata: 'KRK', lat: 50.06, lon: 19.94,  vol_est: 79,  hotel_est: 45  },
  { nom: 'Malte',            pays: 'Malte',       iata: 'MLA', lat: 35.90, lon: 14.51,  vol_est: 104, hotel_est: 65  },
  { nom: 'Dublin',           pays: 'Irlande',     iata: 'DUB', lat: 53.33, lon: -6.25,  vol_est: 99,  hotel_est: 95  },
  { nom: 'Marrakech',        pays: 'Maroc',       iata: 'RAK', lat: 31.63, lon: -8.00,  vol_est: 109, hotel_est: 50  },
]

// Récupère météo sur plusieurs jours et retourne la moyenne
async function fetchMeteo(lat: number, lon: number, startDate: string, endDate: string): Promise<Meteo | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,sunshine_duration&timezone=Europe%2FParis&start_date=${startDate}&end_date=${endDate}`
    const r = await fetch(url)
    const d = await r.json()
    if (!d.daily || !d.daily.temperature_2m_max.length) return null
    const n = d.daily.temperature_2m_max.length
    const avgTemp    = d.daily.temperature_2m_max.reduce((a: number, b: number) => a + b, 0) / n
    const avgPluie   = d.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0) / n
    const avgSoleil  = d.daily.sunshine_duration.reduce((a: number, b: number) => a + b, 0) / n
    return {
      temp:   Math.round(avgTemp),
      pluie:  Math.round(avgPluie * 10) / 10,
      soleil: Math.round(avgSoleil / 3600),
    }
  } catch { return null }
}

// Moyenne des 3 prix les moins chers aller + 3 prix les moins chers retour sur dates exactes
async function fetchPrixVol(
  origIata: string,
  destIata: string,
  departDate: string,
  retourDate: string
): Promise<number | null> {
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

    const moyAller  = volsAller.length  ? volsAller.reduce((a, b)  => a + b, 0) / volsAller.length  : 0
    const moyRetour = volsRetour.length ? volsRetour.reduce((a, b) => a + b, 0) / volsRetour.length : 0

    return Math.round(moyAller + moyRetour)
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

function scorePrix(vol: number, hotelTotal: number, budget: number): number {
  const total = vol + hotelTotal
  if (total > budget) return Math.max(0, Math.round(100 - (total - budget) / budget * 80))
  return Math.round(80 + ((budget - total) / budget) * 20)
}

export async function searchDestinations(params: SearchParams): Promise<Destination[]> {
  const { depart, departIata, budget, meteoPreference, departDate, retourDate, nbNuits } = params
  const ajust = VOL_AJUST[depart] || 0
  const resultats: Destination[] = []
  const BATCH = 4

  // Date de début météo = date de départ, fin = date de retour
  const meteoStart = departDate
  const meteoEnd   = retourDate

  for (let i = 0; i < DESTINATIONS_BASE.length; i += BATCH) {
    const batch = DESTINATIONS_BASE.slice(i, i + BATCH)
    const fetches = batch.map(d => Promise.all([
      fetchMeteo(d.lat, d.lon, meteoStart, meteoEnd),
      fetchPrixVol(departIata, d.iata, departDate, retourDate),
    ]))
    const batchResults = await Promise.all(fetches)

    batch.forEach((d, j) => {
      const [meteo, prixReel] = batchResults[j]
      const vol        = prixReel ?? (d.vol_est + ajust)
      const volSource: 'reel' | 'estime' = prixReel ? 'reel' : 'estime'
      // Prix hôtel total = prix moyen/nuit × nombre de nuits
      const hotelNuit  = d.hotel_est
      const hotelTotal = hotelNuit * nbNuits
      const totalEstime = vol + hotelTotal

      const sm = scoreMeteo(meteo, meteoPreference)
      const sp = scorePrix(vol, hotelTotal, budget)
      const sg = Math.round(sm * 0.55 + sp * 0.45)

      const kiwiUrl   = `https://www.kiwi.com/fr/search/results/${encodeURIComponent(depart)}/${encodeURIComponent(d.nom)}/${departDate}/${retourDate}?affilid=${TP_TOKEN}`
      const bookingUrl = `https://www.booking.com/searchresults.fr.html?ss=${encodeURIComponent(d.nom)}&checkin=${departDate}&checkout=${retourDate}&aid=${BOOKING_AID}`

      resultats.push({
        ...d,
        meteo,
        vol,
        volSource,
        hotel: hotelNuit,
        hotelTotal,
        nbNuits,
        totalEstime,
        scoreMeteo: sm,
        scorePrix: sp,
        scoreGlobal: sg,
        kiwiUrl,
        bookingUrl,
      })
    })
  }

  return resultats
    .filter(r => r.totalEstime <= budget * 1.25)
    .sort((a, b) => b.scoreGlobal - a.scoreGlobal)
    .slice(0, 8)
}
