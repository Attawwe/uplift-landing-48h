import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit gratuit — Votre présence web en 60 secondes | Uplift Agency",
  description:
    "Découvrez combien de clients vous perdez chaque mois sans site professionnel. Audit personnalisé gratuit, aucune carte bancaire.",
  robots: "noindex",
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
