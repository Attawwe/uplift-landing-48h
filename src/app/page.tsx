import { ContactForm } from "@/components/ContactForm";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-6 pt-20 pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
            Uplift Agency
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Votre site professionnel
            <br />
            <span className="text-accent">livré en 48 h</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
            Un site moderne, rapide et optimisé pour convertir vos visiteurs en
            clients. Design sur-mesure, hébergement inclus, zéro prise de tête.
          </p>
          <p className="mt-8 text-3xl font-bold text-accent">490 € TTC</p>
          <p className="mt-1 text-sm text-gray-500">
            Paiement unique — pas d&apos;abonnement caché
          </p>
        </div>
      </section>

      {/* Avantages */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {[
            {
              title: "Rapide",
              desc: "Livraison en 48h chrono après validation du brief.",
            },
            {
              title: "Clé en main",
              desc: "Design, développement, hébergement et mise en ligne inclus.",
            },
            {
              title: "Optimisé",
              desc: "SEO, mobile-first, performances maximales dès le lancement.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire + WhatsApp */}
      <section id="contact" className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-2 text-center text-2xl font-bold">
            Démarrez votre projet
          </h2>
          <p className="mb-8 text-center text-gray-600">
            Remplissez le formulaire ou contactez-nous directement sur WhatsApp.
          </p>
          <ContactForm />
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="text-sm text-gray-400">ou</span>
            <WhatsAppCTA />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Uplift Agency. Tous droits réservés.
      </footer>
    </>
  );
}
