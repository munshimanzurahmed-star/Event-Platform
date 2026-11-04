import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  let stats = {
    registrations: 0,
    confirmed: 0,
    checkedIn: 0,
    speakers: 0,
    sponsors: 0,
    challenges: 0,
  };

  try {
    const [regs, confirmed, checkedIn, speakers, sponsors, challenges] = await Promise.all([
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "CONFIRMED" } }),
      prisma.ticket.count({ where: { isCheckedIn: true } }),
      prisma.speaker.count(),
      prisma.sponsor.count(),
      prisma.challenge.count(),
    ]);
    stats = { registrations: regs, confirmed, checkedIn, speakers, sponsors, challenges };
  } catch {
    // DB may not be ready
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">BUSINESS ADD-ON Admin</h1>
          <p className="text-sm text-white/50">Logged in as {session.user.email} · {session.user.role}</p>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-white/60 hover:text-white">View site</Link>
          <Link href="/api/auth/signout" className="text-sm text-[#d4af37]">Sign out</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold mb-8">Dashboard Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Total Registrations", value: stats.registrations },
            { label: "Confirmed", value: stats.confirmed },
            { label: "Checked In", value: stats.checkedIn },
            { label: "Speakers", value: stats.speakers },
            { label: "Sponsors", value: stats.sponsors },
            { label: "Challenges", value: stats.challenges },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/50">{s.label}</p>
              <p className="mt-2 text-3xl font-bold text-[#d4af37]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-medium mb-4">Quick Links</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-lg border border-white/10 p-4 text-white/60">
              Event Configuration (coming in full release)
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-white/60">
              Registrations & Tickets
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-white/60">
              Speakers / Sponsors / Artists
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-white/60">
              Challenges & Judging
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-white/60">
              SPOC Management
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-white/60">
              Email & Reminders
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-white/60">
              QR Check-in
            </div>
            <div className="rounded-lg border border-white/10 p-4 text-white/60">
              Reports & Export
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
          <h3 className="font-medium text-amber-200">Implementation Status</h3>
          <p className="mt-2 text-sm text-white/70">
            This is a solid foundation of the BUSINESS ADD-ON platform. Core features working:
            public site with premium design, dynamic ticket registration, unique QR tickets,
            SPOC assignment on tickets, database schema, seed data, Auth.js login, and admin overview.
          </p>
          <p className="mt-2 text-sm text-white/50">
            Full CRUD modules for every entity, dynamic form builder, email campaigns, reminder cron,
            and advanced challenge judging are structured in the schema and can be extended module-by-module.
          </p>
        </div>
      </main>
    </div>
  );
}
