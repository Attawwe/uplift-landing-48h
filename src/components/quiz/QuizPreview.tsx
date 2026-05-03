"use client";

import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quiz-store";
import { SEGMENT_DATA } from "@/lib/quiz-data";
import { trackEvent } from "@/lib/tracking";

export function QuizPreview() {
  const { result, firstName, setStep } = useQuizStore((s) => ({
    result: s.result,
    firstName: s.firstName,
    setStep: s.setStep,
  }));

  if (!result) return null;

  const { displayScore, segment } = result;
  const segData = SEGMENT_DATA[segment];

  function handleContinue() {
    trackEvent("paywall_viewed", { source: "audit", page: "audit", segment });
    setStep("paywall");
  }

  const name = firstName ? `, ${firstName}` : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col px-6 py-8 max-w-lg mx-auto"
    >
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Score présence web</p>
        <p className="text-5xl font-black text-gray-900">
          {segData.scoreLabel} {displayScore}<span className="text-2xl text-gray-400">/10</span>
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
        {segData.headline.replace(".", `${name}.`)}
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-green-500 mt-0.5">✅</span>
          <p className="text-sm text-gray-700">Site professionnel adapté à votre métier</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-green-500 mt-0.5">✅</span>
          <p className="text-sm text-gray-700">Visible sur Google dans votre ville</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-green-500 mt-0.5">✅</span>
          <p className="text-sm text-gray-700">Numéro cliquable + formulaire de contact opérationnel en 48h</p>
        </div>
      </div>

      <div className="bg-violet-50 rounded-2xl p-4 mb-6 text-sm text-violet-800 font-medium">
        💡 {segData.paywallArg}
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold py-4 rounded-2xl text-base transition-all"
      >
        Voir mon plan →
      </button>
    </motion.div>
  );
}
