'use client';
import React, { useState } from 'react';

export default function DepositForm() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentUrl('');
    setQrCode('');

    const res = await fetch('/api/create-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.paymentUrl) {
      setPaymentUrl(data.paymentUrl);
      setQrCode(data.qrCode);
    } else {
      alert('Failed to create payment.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-black/70 p-6 rounded-2xl text-center text-white">
      <h2 className="text-2xl font-bold mb-4">Deposit Funds</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          className="w-full p-3 rounded bg-gray-900 border border-pink-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount (USD)"
          className="w-full p-3 rounded bg-gray-900 border border-pink-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded transition"
        >
          {loading ? 'Generating...' : 'Generate Deposit QR'}
        </button>
      </form>

      {qrCode && (
        <div className="mt-6">
          <p className="mb-2">Scan this QR code to pay:</p>
          <img src={qrCode} alt="Payment QR" className="mx-auto w-48 h-48" />
        </div>
      )}

      {paymentUrl && (
        <p className="mt-4">
          Or open directly:{" "}
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 underline"
          >
            {paymentUrl}
          </a>
        </p>
      )}
    </div>
  );
}
