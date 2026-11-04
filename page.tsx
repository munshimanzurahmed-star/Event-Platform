import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/" className="text-sm text-white/50 hover:text-[#d4af37]">← Home</Link>
        <h1 className="mt-6 text-4xl font-bold text-white">About BUSINESS ADD-ON</h1>
        <p className="mt-6 text-lg text-white/70 leading-relaxed">
          BUSINESS ADD-ON is a large-scale, premium business, innovation, networking and entertainment festival planned for Mumbai, Maharashtra.
        </p>
        <p className="mt-4 text-white/60 leading-relaxed">
          It brings together business leaders, entrepreneurs, students, professionals, investors, brands, speakers, hosts, artists, creators and the public on one platform for three consecutive days.
        </p>
        <h2 className="mt-10 text-2xl font-semibold text-white">Three connected experiences</h2>
        <ul className="mt-4 space-y-3 text-white/70">
          <li><strong className="text-[#d4af37]">BUSINESS</strong> — keynotes, panels, fireside chats, networking, sponsor activations and exhibition.</li>
          <li><strong className="text-[#d4af37]">INNOVATION</strong> — time-bound challenges, startup sprints, marketing & finance challenges, crisis simulations and final pitches.</li>
          <li><strong className="text-[#d4af37]">ENTERTAINMENT</strong> — artists, performers, celebrity/public-figure appearances and live entertainment.</li>
        </ul>
        <p className="mt-8 text-sm text-white/40">
          Exact dates, venue and confirmed talent will be published by the organisers once finalised. All planning assumptions remain editable in the administration dashboard.
        </p>
      </div>
    </div>
  );
}
