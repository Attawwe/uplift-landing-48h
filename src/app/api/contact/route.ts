import { NextResponse } from "next/server";
import { validateContact, hasErrors } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Payload JSON invalide.", errors: {} },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "Payload invalide.", errors: {} },
      { status: 400 }
    );
  }

  const { nom, email, telephone, type_projet } = body as Record<string, string>;
  const errors = validateContact({ nom, email, telephone, type_projet });

  if (hasErrors(errors)) {
    return NextResponse.json(
      { success: false, message: "Champs invalides.", errors },
      { status: 400 }
    );
  }

  try {
    // TODO: intégrer avec CRM / email / webhook
    console.log("[LEAD]", {
      nom,
      email,
      telephone,
      type_projet,
      ts: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Demande enregistrée avec succès.",
    });
  } catch (err) {
    console.error("[LEAD_ERROR]", err);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
