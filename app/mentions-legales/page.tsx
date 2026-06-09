export const metadata = {
  title: 'Mentions légales — WeekendIdéal',
  description: 'Mentions légales du site WeekendIdéal',
}

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-sky-400 hover:underline text-sm mb-6 inline-block">← Retour à l&apos;accueil</a>
        <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Éditeur du site</h2>
          <p className="text-slate-300 leading-relaxed">
            Le site WeekendIdéal est édité par <strong>Édouard</strong>, particulier établi à Paris (France).<br />
            Contact : <a href="mailto:joeblack170420@gmail.com" className="text-sky-400 hover:underline">joeblack170420@gmail.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Directeur de la publication</h2>
          <p className="text-slate-300">Édouard, en sa qualité d&apos;éditeur du site.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Hébergement</h2>
          <p className="text-slate-300 leading-relaxed">
            Le site est hébergé par <strong>Vercel Inc.</strong><br />
            440 N Barranca Ave PMB 4133<br />
            Covina, CA 91723<br />
            États-Unis<br />
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">vercel.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Nature du site</h2>
          <p className="text-slate-300 leading-relaxed">
            WeekendIdéal est un projet personnel <strong>en phase bêta non commerciale</strong>. Le site propose des recommandations de destinations de weekend en France basées sur la météo prévisionnelle et une estimation du budget. <strong>Aucune commission n&apos;est perçue sur les liens externes</strong> pendant cette phase. Les redirections vers Booking.com, Omio ou Kiwi sont des liens publics sans accord d&apos;affiliation actif.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Sources des données affichées</h2>
          <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-1">
            <li>Météo : <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Open-Meteo</a> (API publique gratuite)</li>
            <li>Cartographie : <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">OpenStreetMap</a> via CARTO</li>
            <li>Découpage des régions : <a href="https://github.com/gregoiredavid/france-geojson" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">France-GeoJSON</a></li>
            <li>Photos : <a href="https://fr.wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Wikipédia</a> via l&apos;API REST publique</li>
            <li>Prix train : estimés à partir des grilles SNCF (non garantis, à vérifier sur les sites de réservation)</li>
            <li>Prix voiture : estimés selon le barème fiscal 2024 (0,21 €/km)</li>
            <li>Prix hôtel : moyennes estimées à vérifier sur Booking.com</li>
          </ul>
          <p className="text-slate-400 text-sm mt-4 italic">
            ⚠️ Tous les prix et données affichés sont fournis à titre indicatif et ne constituent pas une offre commerciale. Les tarifs réels sont à vérifier directement auprès des prestataires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Propriété intellectuelle</h2>
          <p className="text-slate-300 leading-relaxed">
            Le code source du site et son design sont la propriété d&apos;Édouard. Les photos affichées proviennent de Wikipédia / Wikimedia Commons et restent la propriété de leurs auteurs respectifs sous licences libres (CC-BY-SA, domaine public, etc.).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Limitation de responsabilité</h2>
          <p className="text-slate-300 leading-relaxed">
            WeekendIdéal s&apos;efforce de fournir des informations aussi précises que possible. Toutefois, l&apos;éditeur ne peut être tenu responsable des erreurs ou omissions dans les données affichées, ni des conséquences d&apos;une décision prise sur la base de ces informations. Les utilisateurs sont invités à vérifier les prix, disponibilités et conditions auprès des prestataires officiels avant toute réservation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Loi applicable</h2>
          <p className="text-slate-300 leading-relaxed">
            Les présentes mentions légales sont régies par la loi française. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <p className="text-xs text-slate-500 mt-8">
          Dernière mise à jour : juin 2026
        </p>
      </div>
    </main>
  )
}
