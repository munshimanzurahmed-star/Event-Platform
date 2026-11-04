import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getEvent() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true },
      include: {
        ticketTypes: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        challenges: { where: { status: { in: ["PUBLISHED", "OPEN"] } }, take: 4 },
        speakers: { where: { status: "CONFIRMED", isFeatured: true }, take: 6 },
      },
    });
    return event;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const event = await getEvent();

  const name = event?.name ?? "BUSINESS ADD-ON";
  const tagline = event?.tagline ?? "Think Fast. Create Big. Build the Future.";
  const venue = event?.venueName ?? "Mumbai, Maharashtra, India";
  const tickets = event?.ticketTypes ?? [];
  const challenges = event?.challenges ?? [];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">
              BUSINESS <span className="text-[#d4af37]">ADD-ON</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/about" className="text-sm text-white/70 hover:text-[#d4af37] transition">About</Link>
            <Link href="/agenda" className="text-sm text-white/70 hover:text-[#d4af37] transition">Agenda</Link>
            <Link href="/challenges" className="text-sm text-white/70 hover:text-[#d4af37] transition">Challenges</Link>
            <Link href="/speakers" className="text-sm text-white/70 hover:text-[#d4af37] transition">Speakers</Link>
            <Link href="/sponsors" className="text-sm text-white/70 hover:text-[#d4af37] transition">Sponsors</Link>
            <Link href="/venue" className="text-sm text-white/70 hover:text-[#d4af37] transition">Venue</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/sponsor"
              className="hidden sm:inline-flex text-sm text-white/80 hover:text-white border border-white/20 px-4 py-2 rounded-full transition"
            >
              Become a Sponsor
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full bg-[#d4af37] px-5 py-2 text-sm font-semibold text-black hover:bg-[#f0d78c] transition"
            >
              Get Tickets
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e3a5f]/40 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#d4af37]">
            Mumbai · Three-Day Festival
          </p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            {name}
          </h1>
          <p className="mb-4 text-xl text-[#f0d78c] sm:text-2xl font-light">
            {tagline}
          </p>
          <p className="mx-auto mb-10 max-w-2xl text-base text-white/60 sm:text-lg">
            Business keynotes · Timed innovation challenges · Networking · Live entertainment.
            One platform for leaders, entrepreneurs, students, investors and creators.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#d4af37] px-8 py-3.5 text-base font-semibold text-black hover:bg-[#f0d78c] transition sm:w-auto"
            >
              Get Tickets / Register for Challenges
            </Link>
            <Link
              href="/sponsor"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/30 px-8 py-3.5 text-base font-medium text-white hover:border-[#d4af37] hover:text-[#d4af37] transition sm:w-auto"
            >
              Become a Sponsor / Partner
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/40">
            Venue & exact dates will be confirmed and published by the organisers.
          </p>
        </div>
      </section>

      {/* Three-day overview */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Three Days. Three Experiences.
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                day: "DAY 1",
                theme: "The Inspiration Day",
                subtitle: "Learn from the Best",
                points: ["Inauguration & keynotes", "Industry leader talks", "Fireside chats", "Opening challenge round", "Evening performance"],
              },
              {
                day: "DAY 2",
                theme: "The Challenge Day",
                subtitle: "Beat the Clock",
                points: ["Timed business challenges", "Startup sprint", "Crisis simulations", "Mentor interactions", "Expo & entertainment"],
              },
              {
                day: "DAY 3",
                theme: "The Opportunity Day",
                subtitle: "Turn Ideas into Reality",
                points: ["Final pitches", "Investor interactions", "Exhibition & networking", "Awards ceremony", "Closing performance"],
              },
            ].map((d) => (
              <div
                key={d.day}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:border-[#d4af37]/40 transition"
              >
                <p className="text-sm font-medium tracking-widest text-[#d4af37]">{d.day}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{d.theme}</h3>
                <p className="mt-1 text-sm text-white/50">{d.subtitle}</p>
                <ul className="mt-6 space-y-2">
                  {d.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges highlight */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold text-white">Signature Timed Challenges</h2>
              <p className="mt-2 text-white/60">The central differentiator – solve real business problems against the clock.</p>
            </div>
            <Link href="/challenges" className="text-sm font-medium text-[#d4af37] hover:underline">
              View all challenges →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(challenges.length > 0 ? challenges : [
              { title: "Brand Battle", durationMinutes: 30, brief: "Brand identity & marketing strategy" },
              { title: "Startup Sprint", durationMinutes: 60, brief: "Idea, customer profile & revenue model" },
              { title: "Budget Battle", durationMinutes: 30, brief: "Feasible plan within a budget" },
              { title: "Innovation Challenge", durationMinutes: 60, brief: "Solve a real consumer problem" },
            ]).map((c: any) => (
              <div key={c.title} className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
                <div className="mb-3 inline-flex rounded-full bg-[#d4af37]/10 px-3 py-1 text-xs font-medium text-[#d4af37]">
                  {c.durationMinutes ?? 60} min
                </div>
                <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-white/50 line-clamp-2">{c.brief}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Ticket Categories</h2>
          <p className="mb-12 text-center text-white/60">Choose the experience that fits you. All tickets include full event access unless noted.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(tickets.length > 0 ? tickets : [
              { name: "General Admission", price: 1499, benefits: ["All keynotes", "Exhibition", "Networking"] },
              { name: "Student Pass", price: 799, benefits: ["All sessions", "Challenge eligibility"] },
              { name: "Challenge Participant", price: 1999, benefits: ["Priority challenges", "Mentor access"] },
              { name: "VIP / Premium", price: 4999, benefits: ["VIP seating", "Exclusive lounge"] },
            ]).map((t: any) => (
              <div key={t.name} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                <p className="mt-4 text-3xl font-bold text-[#d4af37]">
                  ₹{Number(t.price).toLocaleString("en-IN")}
                </p>
                <ul className="mt-6 flex-1 space-y-2">
                  {(t.benefits || []).map((b: string) => (
                    <li key={b} className="text-sm text-white/60">• {b}</li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-6 block w-full rounded-full bg-white/10 py-2.5 text-center text-sm font-medium text-white hover:bg-[#d4af37] hover:text-black transition"
                >
                  Select
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to be part of it?</h2>
          <p className="mt-4 text-white/60">
            Whether you want to learn, compete, network or partner – BUSINESS ADD-ON is built for you.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="rounded-full bg-[#d4af37] px-8 py-3.5 font-semibold text-black hover:bg-[#f0d78c] transition">
              Register Now
            </Link>
            <Link href="/sponsor" className="rounded-full border border-white/30 px-8 py-3.5 font-medium text-white hover:border-[#d4af37] transition">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="text-lg font-bold text-white">BUSINESS <span className="text-[#d4af37]">ADD-ON</span></p>
              <p className="mt-1 text-sm text-white/40">Mumbai · Think Fast. Create Big. Build the Future.</p>
            </div>
            <div className="flex gap-6 text-sm text-white/50">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <Link href="/admin" className="hover:text-[#d4af37]">Admin</Link>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-white/30">
            Planning assumptions (attendance targets, programme, venue) remain editable until officially confirmed.
            All speakers, artists and sponsors shown as confirmed only after administrator approval.
          </p>
        </div>
      </footer>
    </div>
  );
}
