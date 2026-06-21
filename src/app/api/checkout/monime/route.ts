import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { phone, email, amount, description } = await req.json();

    // Strip any accidental spaces or quotes from Vercel env variables
    const SPACE_ID = process.env.MONIME_SPACE_ID?.replace(/['"]/g, '').trim();
    const API_KEY = process.env.MONIME_API_KEY?.replace(/['"]/g, '').trim();

    if (!SPACE_ID || !API_KEY) {
      return NextResponse.json({ error: "Monime API credentials are not configured" }, { status: 500 });
    }

    const origin = req.headers.get("origin") || "https://altons-portfolio-site.vercel.app";

    // Amount comes in as a string like "600 SLE", we need to parse it to a number
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));

    // Prepare Monime Checkout Session Request
    const monimePayload = {
      name: "Payment for beat license",
      description: description || "Beat license purchase",
      successUrl: `${origin}/payment/success`,
      cancelUrl: `${origin}/payment/cancelled`,
      lineItems: [
        {
          type: "custom",
          name: description || "Beat License",
          price: {
            currency: "SLE",
            value: numericAmount
          },
          quantity: 1
        }
      ],
      // Include metadata to track the buyer
      metadata: {
        buyer_email: email,
        buyer_phone: phone,
      }
    };

    const idempotencyKey = randomUUID();

    const response = await fetch("https://api.monime.io/v1/checkout-sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "Monime-Space-Id": SPACE_ID
      },
      body: JSON.stringify(monimePayload)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Monime API Error:", data);
      return NextResponse.json({ error: data.error?.message || data.message || "Failed to initiate payment" }, { status: response.status || 500 });
    }

    // The checkout session response has a redirectUrl which the frontend will use
    return NextResponse.json({ 
      success: true, 
      payment: {
        checkoutUrl: data.result.redirectUrl,
        ...data.result
      } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Monime Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
