import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_ID = process.env.STRIPE_PRICE_ID!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uplift-agency.fr";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const { email, firstName, answers, segment } = body as Record<string, unknown>;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: typeof email === "string" ? email : undefined,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        source: "quiz_audit",
        segment: typeof segment === "string" ? segment : "",
        firstName: typeof firstName === "string" ? firstName : "",
        answers: JSON.stringify(answers ?? {}),
      },
      success_url: `${BASE_URL}/audit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/audit`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[AUDIT_CHECKOUT]", err);
    return NextResponse.json({ error: "Erreur Stripe." }, { status: 500 });
  }
}
