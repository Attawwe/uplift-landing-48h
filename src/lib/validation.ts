export interface ContactPayload {
  nom: string;
  email: string;
  telephone: string;
  type_projet: string;
}

export interface FieldErrors {
  nom?: string;
  email?: string;
  telephone?: string;
  type_projet?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = ["vitrine", "ecommerce", "portfolio", "landing", "autre"];

export function validateContact(data: ContactPayload): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.nom || data.nom.trim().length === 0) {
    errors.nom = "Le nom est requis.";
  }

  if (!data.email || !EMAIL_RE.test(data.email)) {
    errors.email = "Email invalide.";
  }

  if (!data.telephone || data.telephone.replace(/\s/g, "").length < 8) {
    errors.telephone = "Téléphone invalide (8 caractères minimum).";
  }

  if (!data.type_projet || !VALID_TYPES.includes(data.type_projet)) {
    errors.type_projet = "Sélectionnez un type de projet.";
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
