import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { phone, email, amount, description } = await req.json();

    const SPACE_ID = process.env.MONIME_SPACE_ID;
    const API_KEY = process.env.MONIME_API_KEY;

    if (!SPACE_ID || !API_KEY) {
      return NextResponse.json({ error: "Monime API credentials are not configured" }, { status: 500 });
    }

    // Amount comes in as a string like "600 SLE", we need to parse it to a number
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));

    // Prepare Monime Payment Request
    const monimePayload = {
      name: description || "Payment for beat license",
      amount: {
        currency: "SLE",
        value: numericAmount
      },
      // Include metadata to track the buyer
      metadata: {
        buyer_email: email,
        buyer_phone: phone,
      }
    };

    const idempotencyKey = randomUUID();

    const response = await fetch("https://api.monime.io/v1/payments", {
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

    if (!response.ok) {
      console.error("Monime API Error:", data);
      return NextResponse.json({ error: data.message || "Failed to initiate payment" }, { status: response.status });
    }

    return NextResponse.json({ success: true, payment: data }, { status: 200 });

  } catch (error: any) {
    console.error("Monime Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
