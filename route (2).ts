import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRegistrationId, generateTicketNumber } from "@/lib/utils";
import { randomBytes } from "crypto";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, organization, designation, city, ticketTypeId } = body;

    if (!fullName || !email || !ticketTypeId) {
      return NextResponse.json({ error: "Name, email and ticket type are required" }, { status: 400 });
    }

    const event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (!event) {
      return NextResponse.json({ error: "Event not found. Please run database setup." }, { status: 400 });
    }

    const ticketType = await prisma.ticketType.findUnique({ where: { id: ticketTypeId } });
    if (!ticketType || !ticketType.isActive) {
      return NextResponse.json({ error: "Invalid ticket type" }, { status: 400 });
    }

    const existing = await prisma.registration.findFirst({
      where: { email: email.toLowerCase(), eventId: event.id, status: { not: "CANCELLED" } },
    });
    if (existing) {
      return NextResponse.json({ error: "You are already registered with this email for this event." }, { status: 409 });
    }

    const registrationId = generateRegistrationId("BA");
    const ticketNumber = generateTicketNumber();
    const verificationToken = randomBytes(32).toString("hex");

    const result = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.create({
        data: {
          eventId: event.id,
          ticketTypeId,
          registrationId,
          fullName,
          email: email.toLowerCase(),
          phone: phone || null,
          organization: organization || null,
          designation: designation || null,
          city: city || null,
          status: "CONFIRMED",
          paymentStatus: "PENDING",
          amountPaid: 0,
        },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const verifyUrl = `${appUrl}/ticket/${verificationToken}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 300, margin: 2 });

      const ticket = await tx.ticket.create({
        data: {
          registrationId: reg.id,
          ticketNumber,
          verificationToken,
          qrCodeDataUrl: qrDataUrl,
        },
      });

      await tx.ticketType.update({
        where: { id: ticketTypeId },
        data: { soldCount: { increment: 1 } },
      });

      return { reg, ticket };
    });

    return NextResponse.json({
      success: true,
      registrationId: result.reg.registrationId,
      ticketNumber: result.ticket.ticketNumber,
      verificationToken: result.ticket.verificationToken,
    });
  } catch (e: any) {
    console.error("Registration error:", e);
    return NextResponse.json({ error: e.message || "Registration failed" }, { status: 500 });
  }
}
