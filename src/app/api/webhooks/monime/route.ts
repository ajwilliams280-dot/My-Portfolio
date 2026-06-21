import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Log the webhook payload so we can see what Monime sends
    console.log("Monime Webhook received:", JSON.stringify(payload, null, 2));

    // For now, we simply acknowledge the webhook so Monime knows we received it.
    // In the future, you can check if payload.status === "successful"
    // and automatically send the beat to the buyer via email here!

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
