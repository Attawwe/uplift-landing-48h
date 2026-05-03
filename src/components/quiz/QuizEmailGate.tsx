"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quiz-store";
import { trackEvent } from "@/lib/tracking";

export function QuizEmailGate() {
  const { email, setEmail, firstName, setFirstName, finalize } = useQuizStore((s) => ({
    email: s.email,
    setEmail: s.setEmail,
    firstName: s.firstName,
    setFirstName: s.setFirstName,
    finalize: s.finalize,
  }));

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Entrez un email valide.");
      return;
    }
    setError("");
    setLoading(true);
    trackEvent("email_captured", { source: "audit", page: "audit", email });
    finalize();
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center px-6 py-10 max-w-lg mx-auto text-center"
    >
      <div className="w-full bg-violet-100 rounded-full h-1.5 mb-8">
        <div className="bg-violet-600 h-1.5 rounded-full w-full" />
      </div>

      <div className="text-4xl mb-4">🎯</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre audit est prêt.</h2>
      <p className="text-gray-500 text-sm mb-8">
        Entrez votre email pour accéder à votre plan personnalisé.
        <br />
        Aucune carte bancaire. Aucun engagement.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Votre prénom (optionnel)"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="votre@email.fr"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        {error && <p className="text-red-500 text-xs text-left">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-base transition-all active:scale-95"
        >
          {loading ? "Chargement..." : "Accéder à mon audit gratuit →"}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-4">
        Pas de spam. Pas de relances quotidiennes. Juste votre plan.
      </p>
    </motion.div>
  );
}
