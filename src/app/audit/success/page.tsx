"use client";

import { motion } from "framer-motion";
import { trackEvent } from "@/lib/tracking";
import { useEffect } from "react";

const CALENDLY_URL = "https://cal.eu/upliftagency/20min";

export default function AuditSuccessPage() {
  useEffect(() => {
    trackEvent("purchase_completed", { source: "audit", page: "audit", plan: "stripe_490" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center px-6 py-12 max-w-lg mx-auto text-center"
    >
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-black text-gray-900 mb-3">
        Paiement reçu — merci !
      </h1>
      <p className="text-gray-600 text-sm mb-8">
        Votre site sera livré dans <strong>48h</strong>. Réservez votre appel de 15 min
        pour qu'on lance la production.
      </p>

      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-2xl text-base transition-all active:scale-95 text-center"
        onClick={() => trackEvent("call_booked", { source: "audit", page: "audit_success" })}
      >
        Réserver mon appel de lancement →
      </a>

      <p className="text-xs text-gray-400 mt-6">
        Un email de confirmation vous a été envoyé. Pour toute question : contact@uplift-agency.fr
      </p>
    </motion.div>
  );
}
