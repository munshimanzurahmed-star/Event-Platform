import { PrismaClient, Role, RegistrationMode, PersonStatus, ChallengeStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BUSINESS ADD-ON platform...");

  // Super Admin
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@businessaddon.in" },
    update: {},
    create: {
      email: "admin@businessaddon.in",
      name: "Super Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log("✅ Super Admin:", admin.email, "(password: Admin@12345)");

  // Main Event
  const event = await prisma.event.upsert({
    where: { id: "business-add-on-main" },
    update: {},
    create: {
      id: "business-add-on-main",
      name: "BUSINESS ADD-ON",
      tagline: "Think Fast. Create Big. Build the Future.",
      description:
        "A three-day mega business, innovation & entertainment festival in Mumbai bringing together leaders, entrepreneurs, students, investors, creators and the public. Learn. Compete. Connect. Experience.",
      category: "Business Innovation Festival",
      timezone: "Asia/Kolkata",
      venueName: "To be announced – Mumbai, Maharashtra",
      venueAddress: "Mumbai, Maharashtra, India",
      organizerName: "BUSINESS ADD-ON Organising Committee",
      organizerEmail: "hello@businessaddon.in",
      organizerPhone: "+91-XXXXXXXXXX",
      primaryColor: "#d4af37",
      secondaryColor: "#1e3a5f",
      backgroundColor: "#0a0a0f",
      textColor: "#f8fafc",
      isPublished: true,
      registrationMode: RegistrationMode.OPEN,
      socialLinks: {
        instagram: "",
        linkedin: "",
        twitter: "",
        youtube: "",
      },
    },
  });
  console.log("✅ Event:", event.name);

  // Pages
  const pages = [
    { slug: "home", title: "Home", sortOrder: 0 },
    { slug: "about", title: "About the Event", sortOrder: 1 },
    { slug: "agenda", title: "Event Agenda", sortOrder: 2 },
    { slug: "speakers", title: "Speakers", sortOrder: 3 },
    { slug: "sponsors", title: "Sponsors", sortOrder: 4 },
    { slug: "artists", title: "Artists & Performers", sortOrder: 5 },
    { slug: "challenges", title: "Business Challenges", sortOrder: 6 },
    { slug: "venue", title: "Venue & Location", sortOrder: 7 },
    { slug: "register", title: "Registration", sortOrder: 8 },
    { slug: "tickets", title: "Ticket Details", sortOrder: 9 },
    { slug: "contact", title: "Contact", sortOrder: 10 },
    { slug: "privacy", title: "Privacy Policy", sortOrder: 11 },
    { slug: "terms", title: "Terms & Conditions", sortOrder: 12 },
  ];

  for (const p of pages) {
    await prisma.eventPage.upsert({
      where: { eventId_slug: { eventId: event.id, slug: p.slug } },
      update: {},
      create: {
        eventId: event.id,
        slug: p.slug,
        title: p.title,
        isEnabled: true,
        sortOrder: p.sortOrder,
        content: {},
      },
    });
  }
  console.log("✅ Pages created");

  // Ticket Types
  const general = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      name: "General Admission",
      description: "Full access to keynotes, panels, exhibition and evening entertainment.",
      price: 1499,
      currency: "INR",
      capacity: 5000,
      accessZones: ["general", "exhibition"],
      benefits: ["All keynotes & panels", "Exhibition access", "Networking lounge", "Evening performances"],
      sortOrder: 1,
      isActive: true,
    },
  });

  const student = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      name: "Student Pass",
      description: "Discounted pass for currently enrolled students (valid ID required).",
      price: 799,
      currency: "INR",
      capacity: 2000,
      accessZones: ["general", "exhibition", "challenge"],
      benefits: ["All sessions", "Challenge participation eligibility", "Student networking zone"],
      sortOrder: 2,
      isActive: true,
    },
  });

  const challenge = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      name: "Challenge Participant",
      description: "Register for one or more timed business challenges + full event access.",
      price: 1999,
      currency: "INR",
      capacity: 800,
      accessZones: ["general", "exhibition", "challenge", "networking"],
      benefits: ["Priority challenge registration", "Mentor access", "Pitch stage eligibility", "Certificate"],
      sortOrder: 3,
      isActive: true,
    },
  });

  const vip = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      name: "VIP / Premium",
      description: "Premium seating, VIP lounge, exclusive networking and priority access.",
      price: 4999,
      currency: "INR",
      capacity: 300,
      accessZones: ["general", "vip", "exhibition", "networking"],
      benefits: ["VIP seating", "Exclusive lounge", "Meet & greet opportunities", "Premium gift"],
      sortOrder: 4,
      isActive: true,
    },
  });
  console.log("✅ Ticket types created");

  // Sample SPOCs
  const spocReg = await prisma.spoc.create({
    data: {
      eventId: event.id,
      name: "Registration Desk Lead",
      designation: "Registration Coordinator",
      email: "registration@businessaddon.in",
      phone: "+91-9000000001",
      whatsapp: "+91-9000000001",
      responsibility: "Ticket verification, check-in support, general queries",
    },
  });

  await prisma.spocAssignment.createMany({
    data: [
      { spocId: spocReg.id, ticketTypeId: general.id },
      { spocId: spocReg.id, ticketTypeId: student.id },
      { spocId: spocReg.id, ticketTypeId: challenge.id },
      { spocId: spocReg.id, ticketTypeId: vip.id },
    ],
  });
  console.log("✅ SPOC + assignments created");

  // Sample Challenges
  const challenges = [
    {
      title: "Brand Battle",
      slug: "brand-battle",
      brief: "Create a complete brand identity and marketing strategy in 30 minutes.",
      durationMinutes: 30,
      teamSizeMax: 3,
      status: ChallengeStatus.PUBLISHED,
    },
    {
      title: "Startup Sprint",
      slug: "startup-sprint",
      brief: "Develop a business idea, customer profile and revenue model in 60 minutes.",
      durationMinutes: 60,
      teamSizeMax: 4,
      status: ChallengeStatus.PUBLISHED,
    },
    {
      title: "Budget Battle",
      slug: "budget-battle",
      brief: "Prepare a feasible business plan within a given budget – 30 minutes.",
      durationMinutes: 30,
      teamSizeMax: 3,
      status: ChallengeStatus.DRAFT,
    },
    {
      title: "Business Crisis Room",
      slug: "crisis-room",
      brief: "Respond to a surprise business disruption in 20 minutes.",
      durationMinutes: 20,
      teamSizeMax: 4,
      isSurprise: true,
      status: ChallengeStatus.DRAFT,
    },
    {
      title: "Innovation Challenge",
      slug: "innovation-challenge",
      brief: "Solve a real consumer or local business problem in 60 minutes.",
      durationMinutes: 60,
      teamSizeMax: 4,
      status: ChallengeStatus.PUBLISHED,
    },
    {
      title: "Investor Pitch",
      slug: "investor-pitch",
      brief: "Present your solution – 5-minute pitch + 3-minute Q&A.",
      durationMinutes: 8,
      teamSizeMax: 3,
      status: ChallengeStatus.DRAFT,
    },
  ];

  for (const c of challenges) {
    await prisma.challenge.create({
      data: {
        eventId: event.id,
        title: c.title,
        slug: c.slug,
        brief: c.brief,
        durationMinutes: c.durationMinutes,
        teamSizeMin: 1,
        teamSizeMax: c.teamSizeMax,
        status: c.status,
        isSurprise: c.isSurprise || false,
        submissionFormat: ["text", "url", "file"],
        showLeaderboard: false,
      },
    });
  }
  console.log("✅ Challenges seeded");

  // Sample confirmed speakers (status CONFIRMED so they show publicly)
  await prisma.speaker.createMany({
    data: [
      {
        eventId: event.id,
        name: "Speaker TBA",
        title: "Industry Leader",
        company: "To be announced",
        bio: "Details will be published once confirmed by the organising team.",
        status: PersonStatus.PROPOSED,
        isFeatured: true,
        sortOrder: 1,
      },
    ],
  });

  console.log("🎉 Seed completed successfully.");
  console.log("\n--- LOGIN CREDENTIALS ---");
  console.log("Email:    admin@businessaddon.in");
  console.log("Password: Admin@12345");
  console.log("-------------------------\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
