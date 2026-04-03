"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { trackEvent } from "@/lib/tracking";
import { validateContact, hasErrors } from "@/lib/validation";
import type { FieldErrors } from "@/lib/validation";

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  type_projet: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    email: "",
    telephone: "",
    type_projet: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerMessage("");

    // Client-side validation
    const errors = validateContact(formData);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        // Server returned validation errors
        if (json.errors && Object.keys(json.errors).length > 0) {
          setFieldErrors(json.errors);
        }
        setServerMessage(json.message || "Erreur lors de l'envoi.");
        setStatus("error");
        return;
      }

      trackEvent("form_submit", {
        type: "contact",
        source: "landing",
        page: "home",
        offre: "site-48h",
        projet: formData.type_projet,
      });
      setStatus("sent");
    } catch {
      setServerMessage("Impossible de contacter le serveur. Réessayez.");
      setStatus("error");
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: undefined });
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">
          Merci ! Nous vous recontactons sous 24h.
        </p>
      </div>
    );
  }

  const inputClass = (field: keyof FormData) =>
    `w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:border-accent focus:ring-accent/20"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="nom" className="block text-sm font-medium mb-1">
          Nom complet
        </label>
        <input
          id="nom"
          type="text"
          value={formData.nom}
          onChange={(e) => update("nom", e.target.value)}
          className={inputClass("nom")}
          placeholder="Jean Dupont"
        />
        {fieldErrors.nom && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.nom}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClass("email")}
          placeholder="jean@exemple.fr"
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="telephone" className="block text-sm font-medium mb-1">
          Téléphone
        </label>
        <input
          id="telephone"
          type="tel"
          value={formData.telephone}
          onChange={(e) => update("telephone", e.target.value)}
          className={inputClass("telephone")}
          placeholder="06 12 34 56 78"
        />
        {fieldErrors.telephone && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.telephone}</p>
        )}
      </div>

      <div>
        <label htmlFor="type_projet" className="block text-sm font-medium mb-1">
          Type de projet
        </label>
        <select
          id="type_projet"
          value={formData.type_projet}
          onChange={(e) => update("type_projet", e.target.value)}
          className={inputClass("type_projet")}
        >
          <option value="">Choisir...</option>
          <option value="vitrine">Site vitrine</option>
          <option value="ecommerce">E-commerce</option>
          <option value="portfolio">Portfolio</option>
          <option value="landing">Landing page</option>
          <option value="autre">Autre</option>
        </select>
        {fieldErrors.type_projet && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.type_projet}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Envoi en cours..." : "Obtenir mon site en 48h"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600 text-center">
          {serverMessage ||
            "Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp."}
        </p>
      )}
    </form>
  );
}
