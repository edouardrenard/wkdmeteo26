export const metadata = {
  title: 'Politique de confidentialité — WeekendIdéal',
  description: 'Politique de confidentialité et protection des données personnelles',
}

export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-sky-400 hover:underline text-sm mb-6 inline-block">← Retour à l&apos;accueil</a>
        <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-slate-400 mb-8">Conforme au Règlement Général sur la Protection des Données (RGPD)</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Responsable du traitement</h2>
          <p className="text-slate-300 leading-relaxed">
            Édouard, particulier établi à Paris (France).<br />
            Contact : <a href="mailto:joeblack140720@gmail.com" className="text-sky-400 hover:underline">joeblack14072@gmail.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Quelles données sont collectées ?</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            WeekendIdéal ne demande aucune inscription. Le site collecte uniquement les données suivantes, et seulement avec votre consentement préalable :
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-3">
            <h3 className="font-semibold mb-2">📊 Statistiques de visite (Google Analytics 4)</h3>
            <ul className="text-slate-300 text-sm leading-relaxed list-disc list-inside space-y-1">
              <li>Adresse IP anonymisée</li>
              <li>Pays / ville (au niveau régional)</li>
              <li>Type d&apos;appareil et navigateur</li>
              <li>Pages visitées et durée</li>
              <li>Source du trafic (Google, lien direct, réseau social...)</li>
            </ul>
            <p className="text-xs text-slate-400 mt-3">
              <strong>Finalité :</strong> comprendre l&apos;audience du site et améliorer l&apos;expérience utilisateur.<br />
              <strong>Base légale :</strong> votre consentement (bannière cookies).<br />
              <strong>Durée de conservation :</strong> 14 mois maximum.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="font-semibold mb-2">🍪 Cookies techniques essentiels</h3>
            <ul className="text-slate-300 text-sm leading-relaxed list-disc list-inside space-y-1">
              <li>Préférences d&apos;affichage (mode carte/liste)</li>
              <li>Choix de consentement aux cookies</li>
            </ul>
            <p className="text-xs text-slate-400 mt-3">
              Ces cookies sont nécessaires au bon fonctionnement du site et ne nécessitent pas de consentement.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Ce qui n&apos;est PAS collecté</h2>
          <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-1">
            <li>Aucun compte utilisateur, aucun mot de passe</li>
            <li>Aucune donnée bancaire ou financière</li>
            <li>Aucune adresse email (pas de newsletter pour le moment)</li>
            <li>Aucune donnée de réservation (le site ne permet pas de réserver)</li>
            <li>Aucun cookie publicitaire ou de tracking marketing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Partage des données</h2>
          <p className="text-slate-300 leading-relaxed">
            Vos données ne sont <strong>jamais vendues, échangées ou louées</strong> à des tiers. Elles sont uniquement partagées avec :
          </p>
          <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-1 mt-3">
            <li><strong>Google Analytics 4</strong> (Google Ireland Limited) — pour les statistiques de visite. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Politique de Google</a></li>
            <li><strong>Vercel Inc.</strong> (États-Unis) — hébergement du site. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Politique de Vercel</a></li>
          </ul>
          <p className="text-slate-400 text-sm mt-3 italic">
            ℹ️ Le transfert de données vers les États-Unis est encadré par le <em>Data Privacy Framework</em> auquel adhèrent Google et Vercel.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Vos droits</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-1">
            <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Droit d&apos;opposition</strong> : refuser le traitement de vos données</li>
            <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format lisible</li>
            <li><strong>Droit de retirer votre consentement</strong> à tout moment via la bannière cookies</li>
          </ul>
          <p className="text-slate-300 leading-relaxed mt-4">
            Pour exercer ces droits, contactez-moi à : <a href="mailto:nom.prenom@gmail.com" className="text-sky-400 hover:underline">nom.prenom@gmail.com</a>. Une réponse sera apportée dans un délai d&apos;un mois maximum.
          </p>
          <p className="text-slate-400 text-sm mt-3">
            En cas de litige non résolu, vous pouvez déposer une réclamation auprès de la CNIL : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">cnil.fr/fr/plaintes</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Gestion des cookies</h2>
          <p className="text-slate-300 leading-relaxed">
            Lors de votre première visite, une bannière vous demande votre consentement pour les cookies de statistiques. Vous pouvez à tout moment modifier votre choix en supprimant les cookies du site dans les paramètres de votre navigateur, ou en cliquant sur le lien « Gérer les cookies » en bas de page (à venir).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">Modifications de la politique</h2>
          <p className="text-slate-300 leading-relaxed">
            Cette politique peut être mise à jour pour refléter des changements dans le fonctionnement du site ou la législation. La date de dernière mise à jour est indiquée en bas de cette page.
          </p>
        </section>

        <p className="text-xs text-slate-500 mt-8">
          Dernière mise à jour : juin 2026
        </p>
      </div>
    </main>
  )
}
