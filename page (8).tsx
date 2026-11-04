import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TicketPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { verificationToken: token },
    include: {
      registration: {
        include: {
          ticketType: true,
          event: true,
        },
      },
    },
  });

  if (!ticket) notFound();

  const reg = ticket.registration;
  const event = reg.event;

  // Find assigned SPOC
  const assignment = await prisma.spocAssignment.findFirst({
    where: { ticketTypeId: reg.ticketTypeId },
    include: { spoc: true },
  });

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-[#d4af37]/40 bg-gradient-to-b from-white/10 to-transparent p-8 shadow-2xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-[#d4af37]">Official Ticket</p>
            <h1 className="mt-2 text-2xl font-bold text-white">{event.name}</h1>
            <p className="text-sm text-white/50">{event.tagline}</p>
          </div>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Name</span>
              <span className="font-medium text-white">{reg.fullName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Ticket Type</span>
              <span className="text-white">{reg.ticketType.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Ticket No.</span>
              <span className="font-mono text-[#d4af37]">{ticket.ticketNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Status</span>
              <span className={ticket.isCheckedIn ? "text-green-400" : "text-white"}>
                {ticket.isCheckedIn ? "Checked In" : "Valid"}
              </span>
            </div>
          </div>

          {ticket.qrCodeDataUrl && (
            <div className="mt-8 flex justify-center">
              <img src={ticket.qrCodeDataUrl} alt="Ticket QR Code" className="h-48 w-48 rounded-lg bg-white p-2" />
            </div>
          )}

          {assignment?.spoc && (
            <div className="mt-8 rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-wider text-white/40">Your Point of Contact</p>
              <p className="mt-1 font-medium text-white">{assignment.spoc.name}</p>
              <p className="text-sm text-white/60">{assignment.spoc.designation}</p>
              <p className="mt-2 text-sm text-[#d4af37]">{assignment.spoc.email}</p>
              {assignment.spoc.phone && (
                <p className="text-sm text-white/70">{assignment.spoc.phone}</p>
              )}
            </div>
          )}

          <p className="mt-8 text-center text-xs text-white/30">
            Present this QR code at the venue for check-in. Do not share the ticket link publicly.
          </p>
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/50 hover:text-[#d4af37]">← Back to event</Link>
        </div>
      </div>
    </div>
  );
}
