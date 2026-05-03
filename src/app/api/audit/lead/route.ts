import { NextResponse } from "next/server";

const CRM_URL = process.env.CRM_URL ?? "https://uplift-crm-app-production.up.railway.app";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const { email, firstName, answers, segment, score } = body as Record<string, unknown>;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ success: false, message: "Email requis." }, { status: 400 });
  }

  try {
    const res = await fetch(`${CRM_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        firstName: firstName ?? "",
        source: "quiz_audit",
        segment,
        quizScore: score,
        quizAnswers: answers,
        status: "new",
      }),
    });

    if (!res.ok) {
      console.error("[AUDIT_LEAD] CRM error", res.status, await res.text());
    }
  } catch (err) {
    console.error("[AUDIT_LEAD] fetch failed", err);
  }

  // Always return 200 — ne pas bloquer le quiz si CRM down
  return NextResponse.json({ success: true });
}
