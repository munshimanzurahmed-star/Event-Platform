"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TicketType = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  benefits: string[];
};

export default function RegisterPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ ticketNumber: string; token: string } | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    city: "",
  });

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then((d) => {
        if (d.tickets) {
          setTickets(d.tickets);
          if (d.tickets[0]) setSelected(d.tickets[0].id);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ticketTypeId: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess({ ticketNumber: data.ticketNumber, token: data.verificationToken });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-[#d4af37]/30 bg-white/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/20 text-3xl">✓</div>
          <h1 className="text-2xl font-bold text-white">Registration Confirmed</h1>
          <p className="mt-2 text-white/60">Your ticket has been generated.</p>
          <p className="mt-6 text-sm text-white/50">Ticket Number</p>
          <p className="text-xl font-mono text-[#d4af37]">{success.ticketNumber}</p>
          <Link
            href={`/ticket/${success.token}`}
            className="mt-8 inline-block rounded-full bg-[#d4af37] px-6 py-3 font-semibold text-black"
          >
            View Ticket & QR Code
          </Link>
          <p className="mt-4 text-xs text-white/40">A confirmation email will be sent if email delivery is configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4">
        <Link href="/" className="text-sm text-white/50 hover:text-[#d4af37]">← Back to home</Link>
        <h1 className="mt-6 text-3xl font-bold text-white">Register for BUSINESS ADD-ON</h1>
        <p className="mt-2 text-white/60">Select a ticket category and complete your details.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Ticket Category</label>
            <div className="grid gap-3">
              {tickets.map((t) => (
                <label
                  key={t.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    selected === t.id ? "border-[#d4af37] bg-[#d4af37]/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="ticket"
                    value={t.id}
                    checked={selected === t.id}
                    onChange={() => setSelected(t.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-white">{t.name}</span>
                      <span className="text-[#d4af37] font-semibold">₹{Number(t.price).toLocaleString("en-IN")}</span>
                    </div>
                    {t.description && <p className="mt-1 text-sm text-white/50">{t.description}</p>}
                  </div>
                </label>
              ))}
              {tickets.length === 0 && (
                <p className="text-sm text-white/40">Loading ticket categories… (ensure database is set up)</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-white/70 mb-1">Full Name *</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Organization</label>
              <input
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Designation</label>
              <input
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || !selected}
            className="w-full rounded-full bg-[#d4af37] py-3.5 font-semibold text-black hover:bg-[#f0d78c] disabled:opacity-50 transition"
          >
            {loading ? "Processing…" : "Complete Registration"}
          </button>
          <p className="text-xs text-white/40 text-center">
            Payment is currently recorded as pending. Organisers will confirm payment instructions after registration.
          </p>
        </form>
      </div>
    </div>
  );
}
