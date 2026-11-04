import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tickets = await prisma.ticketType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        benefits: true,
        capacity: true,
        soldCount: true,
      },
    });
    return NextResponse.json({ tickets });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ tickets: [], error: "Database not ready" }, { status: 200 });
  }
}
