import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * One-time browser-accessible setup endpoint.
 * Protected by SETUP_SECRET (or falls back to a simple check).
 * Call: POST /api/setup with header x-setup-secret: <value>
 * or body { secret: "..." }
 *
 * Students can hit this once after deploying to push schema + seed
 * without needing a terminal.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-setup-secret") || (await req.json().catch(() => ({}))).secret;
    const expected = process.env.CRON_SECRET || process.env.AUTH_SECRET || "business-add-on-setup";

    if (secret !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Simple connectivity + count check
    const eventCount = await prisma.event.count();
    if (eventCount > 0) {
      return NextResponse.json({
        message: "Database already contains event data. Setup skipped.",
        events: eventCount,
      });
    }

    // Minimal seed if empty (full seed is better run via prisma db seed when possible)
    const passwordHash = await bcrypt.hash("Admin@12345", 12);
    await prisma.user.create({
      data: {
        email: "admin@businessaddon.in",
        name: "Super Admin",
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });

    await prisma.event.create({
      data: {
        id: "business-add-on-main",
        name: "BUSINESS ADD-ON",
        tagline: "Think Fast. Create Big. Build the Future.",
        description: "Three-day mega business, innovation & entertainment festival in Mumbai.",
        isPublished: true,
        primaryColor: "#d4af37",
        secondaryColor: "#1e3a5f",
        backgroundColor: "#0a0a0f",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Minimal seed applied. Prefer running full seed via Vercel build or local prisma when possible.",
      admin: "admin@businessaddon.in / Admin@12345",
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
