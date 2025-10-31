import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount } = body;

    if (!email || !amount) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const response = await fetch('https://api.tryspeed.com/v1/payment-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SPEED_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'USD',
        metadata: { email },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Speed error:', data);
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }

    // Return the payment link or QR code URL
    return NextResponse.json({
      paymentUrl: data.url,
      qrCode: data.qr_code_url || null,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
a
