"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quiz-store";
import { trackEvent } from "@/lib/tracking";

const CALENDLY_URL = "https://cal.eu/upliftagency/20min";

export function QuizPaywall() {
  const { result, email, firstName, answers } = useQuizStore((s) => ({
    result: s.result,
    email: s.email,
    firstName: s.firstName,
    answers: s.answers,
  }));

  const [loadingStripe, setLoadingStripe] = useState(false);
  const [error, setError] = useState("");

  async function handleStripeCheckout() {
    trackEvent("paywall_plan_selected", { source: "audit", page: "audit", plan: "stripe_490" });
    setLoadingStripe(true);
    setError("");

    try {
      const res = await fetch("/api/audit/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, answers, segment: result?.segment }),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      const { url } = await res.json() as { url: string };
      trackEvent("checkout_initiated", { source: "audit", page: "audit" });
      window.location.href = url;
    } catch {
      setError("Une erreur est survenue. Réessayez ou appelez-nous directement.");
      setLoadingStripe(false);
    }
  }

  function handleCalendly() {
    trackEvent("paywall_plan_selected", { source: "audit", page: "audit", plan: "call_expert" });
    window.open(CALENDLY_URL, "_blank");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col px-6 py-8 max-w-lg mx-auto"
    >
      <div className="text-center mb-6">
        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          ✅ Votre plan est prêt
        </span>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          Passez à l&apos;action maintenant.
          <br />
          Votre site en ligne dans 48h.
        </h2>
      </div>

      <ul className="space-y-2 mb-6">
        {[
          "Site professionnel sur mesure (pas un template WordPress)",
          "Adapté à votre métier et votre zone géographique",
          "Visible sur Google dès la première semaine",
          "Numéro cliquable · Formulaire · WhatsApp",
          "Livré en 48h après votre appel de 15 min",
          "30 jours de modifications gratuites",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-500 mt-0.5 shrink-0">✅</span>
            {item}
          </li>
        ))}
      </ul>

      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 mb-1">Un seul nouveau client = votre site rentabilisé.</p>
        <p className="text-3xl font-black text-gray-900">490 € TTC</p>
        <p className="text-xs text-gray-400">Tout compris · Une seule fois · Pas d&apos;abonnement caché</p>
      </div>

      {error && (
        <p className="text-red-500 text-xs text-center mb-3">{error}</p>
      )}

      <button
        onClick={handleStripeCheckout}
        disabled={loadingStripe}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-base transition-all active:scale-95 mb-3"
      >
        {loadingStripe ? "Redirection..." : "Créer mon site maintenant — 490 € →"}
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button
        onClick={handleCalendly}
        className="w-full border-2 border-violet-200 hover:border-violet-400 text-violet-700 font-semibold py-4 rounded-2xl text-sm transition-all active:scale-95"
      >
        Parler à un expert d&apos;abord (appel gratuit 15 min)
      </button>

      <p className="text-xs text-gray-400 text-center mt-4">
        🛡️ 30 jours de modifications gratuites · Paiement sécurisé · Support inclus
      </p>
    </motion.div>
  );
}
