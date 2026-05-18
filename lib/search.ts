import { Destination, Meteo, SearchParams, Transport } from './types'

const TP_TOKEN = '74f9e5198dc096bdda20fec145988527'
const BOOKING_AID = '397594'
const COUT_KM = 0.21

const DESTINATIONS_BASE = [
  { nom: 'Lyon', region: 'Auvergne-Rhône-Alpes', pays: 'France', lat: 45.75, lon: 4.85, iata: 'LYS', distanceKm: 465, trainMin: 19, trainMax: 89, trainDuree: '2h', hotel: 85 },
  { nom: 'Annecy', region: 'Auvergne-Rhône-Alpes', pays: 'France', lat: 45.90, lon: 6.12, iata: 'NCY', distanceKm: 545, trainMin: 24, trainMax: 79, trainDuree: '3h30', hotel: 85 },
  { nom: 'Clermont-Ferrand', region: 'Auvergne-Rhône-Alpes', pays: 'France', lat: 45.78, lon: 3.08, iata: 'CFE', distanceKm: 425, trainMin: 19, trainMax: 69, trainDuree: '3h30', hotel: 65 },
  { nom: 'Marseille', region: 'Provence-Alpes-Côte dAzur', pays: 'France', lat: 43.30, lon: 5.38, iata: 'MRS', distanceKm: 775, trainMin: 19, trainMax: 109, trainDuree: '3h20', hotel: 80 },
  { nom: 'Nice', region: 'Provence-Alpes-Côte dAzur', pays: 'France', lat: 43.71, lon: 7.26, iata: 'NCE', distanceKm: 930, trainMin: 29, trainMax: 129, trainDuree: '5h30', hotel: 90 },
  { nom: 'Avignon', region: 'Provence-Alpes-Côte dAzur', pays: 'France', lat: 43.95, lon: 4.81, iata: 'AVN', distanceKm: 690, trainMin: 19, trainMax: 79, trainDuree: '2h40', hotel: 70 },
  { nom: 'Bordeaux', region: 'Nouvelle-Aquitaine', pays: 'France', lat: 44.84, lon: -0.58, iata: 'BOD', distanceKm: 580, trainMin: 19, trainMax: 79, trainDuree: '2h', hotel: 80 },
  { nom: 'Biarritz', region: 'Nouvelle-Aquitaine', pays: 'France', lat: 43.48, lon: -1.56, iata: 'BIQ', distanceKm: 760, trainMin: 29, trainMax: 99, trainDuree: '4h30', hotel: 90 },
  { nom: 'La Rochelle', region: 'Nouvelle-Aquitaine', pays: 'France', lat: 46.16, lon: -1.15, iata: 'LRH', distanceKm: 470, trainMin: 19, trainMax: 79, trainDuree: '3h', hotel: 75 },
  { nom: 'Toulouse', region: 'Occitanie', pays: 'France', lat: 43.60, lon: 1.44, iata: 'TLS', distanceKm: 680, trainMin: 19, trainMax: 89, trainDuree: '4h20', hotel: 75 },
  { nom: 'Montpellier', region: 'Occitanie', pays: 'France', lat: 43.61, lon: 3.88, iata: 'MPL', distanceKm: 750, trainMin: 19, trainMax: 99, trainDuree: '3h20', hotel: 75 },
  { nom: 'Nimes', region: 'Occitanie', pays: 'France', lat: 43.84, lon: 4.36, iata: 'NIM', distanceKm: 720, trainMin: 19, trainMax: 89, trainDuree: '2h50', hotel: 65 },
  { nom: 'Nantes', region: 'Pays de la Loire', pays: 'France', lat: 47.22, lon: -1.55, iata: 'NTE', distanceKm: 385, trainMin: 19, trainMax: 79, trainDuree: '2h10', hotel: 75 },
  { nom: 'Le Mans', region: 'Pays de la Loire', pays: 'France', lat: 47.99, lon: 0.20, iata: '', distanceKm: 210, trainMin: 19, trainMax: 49, trainDuree: '1h', hotel: 65 },
  { nom: 'Strasbourg', region: 'Grand Est', pays: 'France', lat: 48.58, lon: 7.75, iata: 'SXB', distanceKm: 490, trainMin: 19, trainMax: 79, trainDuree: '1h50', hotel: 80 },
  { nom: 'Reims', region: 'Grand Est', pays: 'France', lat: 49.26, lon: 4.03, iata: '', distanceKm: 145, trainMin: 14, trainMax: 49, trainDuree: '45min', hotel: 75 },
  { nom: 'Nancy', region: 'Grand Est', pays: 'France', lat: 48.69, lon: 6.18, iata: '', distanceKm: 305, trainMin: 19, trainMax: 69, trainDuree: '1h30', hotel: 70 },
  { nom: 'Dijon', region: 'Bourgogne-Franche-Comté', pays: 'France', lat: 47.32, lon: 5.04, iata: 'DIJ', distanceKm: 310, trainMin: 14, trainMax: 59, trainDuree: '1h35', hotel: 65 },
  { nom: 'Besançon', region: 'Bourgogne-Franche-Comté', pays: 'France', lat: 47.24, lon: 6.02, iata: '', distanceKm: 405, trainMin: 19, trainMax: 69, trainDuree: '2h05', hotel: 65 },
  { nom: 'Lille', region: 'Hauts-de-France', pays: 'France', lat: 50.63, lon: 3.07, iata: 'LIL', distanceKm: 220, trainMin: 14, trainMax: 59, trainDuree: '1h', hotel: 75 },
  { nom: 'Amiens', region: 'Hauts-de-France', pays: 'France', lat: 49.89, lon: 2.30, iata: '', distanceKm: 135, trainMin: 14, trainMax: 39, trainDuree: '1h10', hotel: 60 },
  { nom: 'Rennes', region: 'Bretagne', pays: 'France', lat: 48.11, lon: -1.68, iata: 'RNS', distanceKm: 350, trainMin: 19, trainMax: 69, trainDuree: '2h05', hotel: 70 },
  { nom: 'Brest', region: 'Bretagne', pays: 'France', lat: 48.39, lon: -4.49, iata: 'BES', distanceKm: 595, trainMin: 29, trainMax: 89, trainDuree: '4h', hotel: 70 },
  { nom: 'Saint-Malo', region: 'Bretagne', pays: 'France', lat: 48.65, lon: -2.03, iata: '', distanceKm: 410, trainMin: 24, trainMax: 79, trainDuree: '2h45', hotel: 80 },
  { nom: 'Tours', region: 'Centre-Val de Loire', pays: 'France', lat: 47.39, lon: 0.69, iata: '', distanceKm: 240, trainMin: 19, trainMax: 49, trainDuree: '1h10', hotel: 70 },
  { nom: 'Orléans', region: 'Centre-Val de Loire', pays: 'France', lat: 47.90, lon: 1.91, iata: '', distanceKm: 130, trainMin: 14, trainMax: 35, trainDuree: '1h', hotel: 65 },
  { nom: 'Rouen', region: 'Normandie', pays: 'France', lat: 49.44, lon: 1.10, iata: '', distanceKm: 135, trainMin: 14, trainMax: 39, trainDuree: '1h25', hotel: 70 },
  { nom: 'Caen', region: 'Normandie', pays: 'France', lat: 49.18, lon: -0.37, iata: '', distanceKm: 230, trainMin: 19, trainMax: 49, trainDuree: '2h', hotel: 75 },
  { nom: 'Deauville', region: 'Normandie', pays: 'France', lat: 49.36, lon: 0.07, iata: '', distanceKm: 200, trainMin: 19, trainMax: 49, trainDuree: '2h', hotel: 95 },
  { nom: 'Fontainebleau', region: 'Île-de-France', pays: 'France', lat: 48.40, lon: 2.70, iata: '', distanceKm: 65, trainMin: 9, trainMax: 19, trainDuree: '40min', hotel: 75 },
  { nom: 'Versailles', region: 'Île-de-France', pays: 'France', lat: 48.80, lon: 2.13, iata: '', distanceKm: 25, trainMin: 5, trainMax: 12, trainDuree: '30min', hotel: 80 },
  { nom: 'Ajaccio', region: 'Corse', pays: 'France', lat: 41.93, lon: 8.74, iata: 'AJA', distanceKm: 1250, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 95 },
  { nom: 'Bastia', region: 'Corse', pays: 'France', lat: 42.70, lon: 9.45, iata: 'BIA', distanceKm: 1180, trainMin: 999, trainMax: 999, trainDuree: '', hotel: 90 },
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

async function fetchMeteo(latitude: number, longitude: number, satDate: string, sunDate: string): Promise<Meteo | null> {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=temperature_2m_max,precipitation_sum,sunshine_duration&timezone=Europe%2FParis&start_date=' + satDate + '&end_date=' + sunDate
    const r = await fetch(url)
    const json = await r.json()
    const daily = json.daily
    if (!daily || !daily.temperature_2m_max || !daily.temperature_2m_max.length) return null
    const n = daily.temperature_2m_max.length
    const sumTemp = daily.temperature_2m_max.reduce((a: number, b: number) => a + b, 0)
    const sumPluie = daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0)
    const sumSoleil = daily.sunshine_duration.reduce((a: number, b: number) => a + b, 0)
    return {
      temp: Math.round(sumTemp / n),
      pluie: Math.round((sumPluie / n) * 10) / 10,
      soleil: Math.round((sumSoleil / n) / 3600),
    }
  } catch { return null }
}

async function fetchPrixVol(destIata: string, departDate: string, retourDate: string): Promise<number | null> {
  try {
    const u1 = 'https://api.travelpayouts.com/v2/prices/latest?origin=PAR&destination=' + destIata + '&depart_date=' + departDate + '&currency=eur&one_way=true&token=' + TP_TOKEN
    const u2 = 'https://api.travelpayouts.com/v2/prices/latest?origin=' + destIata + '&destination=PAR&depart_date=' + retourDate + '&currency=eur&one_way=true&token=' + TP_TOKEN
    const [r1, r2] = await Promise.all([fetch(u1), fetch(u2)])
    const j1 = await r1.json()
    const j2 = await r2.json()
    const arr1 = j1.success && j1.data && j1.data.length ? j1.data.slice(0, 3).map((v: any) => v.value) : []
    const arr2 = j2.success && j2.data && j2.data.length ? j2.data.slice(0, 3).map((v: any) => v.value) : []
    const aller = arr1.length ? Math.min(...arr1) : null
    const retour = arr2.length ? Math.min(...arr2) : null
    if (!aller && !retour) return null
    return Math.round((aller || 0) + (retour || 0))
  } catch { return null }
}

async function fetchPhotoWiki(nom: string): Promise<string | null> {
  try {
    const url = 'https://fr.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(nom)
    const r = await fetch(url)
    if (!r.ok) return null
    const d = await r.json()
    if (d.thumbnail && d.thumbnail.source) {
      return d.thumbnail.source.replace(/\/\d+px-/, '/600px-')
    }
    return null
  } catch { return null }
}

function scoreMeteo(m: Meteo | null): number {
  if (!m) return 30
  let s = 0
  if (m.pluie === 0) s += 50
  else if (m.pluie < 0.3) s += 40
  else if (m.pluie < 1) s += 25
  else if (m.pluie < 2) s += 12
  else if (m.pluie < 4) s += 4
  else s += 0
  s += Math.min(30, m.soleil * 3.5)
  if (m.temp >= 24) s += 20
  else if (m.temp >= 20) s += 15
  else if (m.temp >= 16) s += 8
  else if (m.temp >= 12) s += 3
  else s += 0
  return Math.min(100, Math.max(0, Math.round(s)))
}

function scorePrix(meilleurPrix: number, hotelTotal: number, budget: number): number {
  const total = meilleurPrix + hotelTotal
  if (total <= budget * 0.7) return 100
  if (total <= budget) return Math.round(70 + ((budget - total) / (budget * 0.3)) * 30)
  const depassement = (total - budget) / budget
  if (depassement < 0.1) return 50
  if (depassement < 0.2) return 35
  if (depassement < 0.3) return 20
  if (depassement < 0.5) return 10
  return 0
}

export async function searchDestinations(params: SearchParams): Promise<Destination[]> {
  const { departDate, retourDate, nbNuits, budget } = params

  let satDate: string
  if (nbNuits === 1) {
    satDate = departDate
  } else {
    const tmp = new Date(departDate)
    tmp.setDate(tmp.getDate() + 1)
    satDate = tmp.toISOString().split('T')[0]
  }
  const sunDate = retourDate

  const resultats: Destination[] = []
  const BATCH = 4

  for (let i = 0; i < DESTINATIONS_BASE.length; i += BATCH) {
    const batch = DESTINATIONS_BASE.slice(i, i + BATCH)
    const fetches = batch.map((dest) => Promise.all([
      fetchMeteo(dest.lat, dest.lon, satDate, sunDate),
      dest.trainMin < 500 || !dest.iata ? Promise.resolve(null) : fetchPrixVol(dest.iata, departDate, retourDate),
      fetchPhotoWiki(dest.nom),
    ]))
    const batchResults = await Promise.all(fetches)

    batch.forEach((d, j) => {
      const meteo = batchResults[j][0]
      const prixVol = batchResults[j][1]
      const photoWiki = batchResults[j][2]
      const transports: Transport[] = []

      if (d.trainMin < 500) {
        const prixTrainAR = Math.round((d.trainMin + d.trainMax) / 2 * 2)
        transports.push({
          type: 'train',
          prixAR: prixTrainAR,
          source: 'estime',
          lien: 'https://www.omio.fr/trains/paris/' + encodeURIComponent(d.nom.toLowerCase()) + '?departureDate=' + departDate + '&returnDate=' + retourDate,
          duree: d.trainDuree,
        })
      }

      if (d.distanceKm < 1000) {
        const prixVoitureAR = Math.round(d.distanceKm * 2 * COUT_KM)
        transports.push({
          type: 'voiture',
          prixAR: prixVoitureAR,
          source: 'estime',
          lien: 'https://www.viamichelin.fr/web/itineraires?from=Paris&to=' + encodeURIComponent(d.nom),
          duree: '~' + Math.round(d.distanceKm / 100) + 'h',
        })
      }

      if (d.trainMin >= 500 && d.iata) {
        const prixAvion = prixVol !== null ? prixVol : Math.round(d.distanceKm * 0.07 + 30)
        transports.push({
          type: 'avion',
          prixAR: prixAvion,
          source: prixVol !== null ? 'reel' : 'estime',
          lien: 'https://www.kiwi.com/fr/search/results/Paris/' + encodeURIComponent(d.nom) + '/' + departDate + '/' + retourDate + '?affilid=' + TP_TOKEN,
        })
      }

      if (!transports.length) return

      const meilleurTransport = transports.reduce((a, b) => a.prixAR < b.prixAR ? a : b)
      const hotelNuit = d.hotel
      const hotelTotal = hotelNuit * nbNuits
      const totalEstime = meilleurTransport.prixAR + hotelTotal
      const sm = scoreMeteo(meteo)
      const sp = scorePrix(meilleurTransport.prixAR, hotelTotal, budget)
      const sg = Math.round(sm * 0.70 + sp * 0.30)
      const bookingUrl = 'https://www.booking.com/searchresults.fr.html?ss=' + encodeURIComponent(d.nom) + '&checkin=' + departDate + '&checkout=' + retourDate + '&aid=' + BOOKING_AID

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
        photo: photoWiki || undefined,
      })
    })
  }

  return resultats
    .sort((a, b) => b.scoreGlobal - a.scoreGlobal)
    .slice(0, 50)
}
