import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, amount } = await req.json();

    if (!email || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const resp = await fetch("https://api.tryspeed.com/v1/payment-links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SPEED_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "USD",
        metadata: { email },
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Speed error", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({
      qrCode: data.qr_code_url,
      paymentUrl: data.url,
    });
  } catch (err) {
    console.error("Server error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
