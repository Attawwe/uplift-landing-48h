"use client";

import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quiz-store";
import { trackEvent } from "@/lib/tracking";

export function QuizIntro() {
  const setStep = useQuizStore((s) => s.setStep);

  function handleStart() {
    trackEvent("quiz_started", { source: "audit", page: "audit" });
    setStep("question");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center px-6 py-10 max-w-lg mx-auto"
    >
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
        <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: "0%" }} />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
        Votre site ramène-t-il des clients ?
        <br />
        Faites le test en 60 secondes.
      </h1>

      <p className="text-gray-500 text-sm mb-8">
        Audit gratuit · Aucune carte bancaire · Résultat immédiat
      </p>

      <button
        onClick={handleStart}
        className="w-full bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all"
      >
        Lancer mon audit →
      </button>

      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
        <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
        47 artisans ont fait leur audit cette semaine
      </p>
    </motion.div>
  );
}
