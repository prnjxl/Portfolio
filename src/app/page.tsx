import Hero from "@/components/Hero";
import SkillsGraph from "@/components/SkillsGraph";
import Markers from "@/components/Markers";

export default function Home() {
  return (
    <div className="w-full">
      {/* ── Page 1 : Portfolio / Hero ── */}
      <section
        id="portfolio"
        className="relative h-screen w-full flex items-center justify-center"
      >
        <Markers />
        <div className="z-40 pointer-events-none">
          <Hero />
        </div>
      </section>

      {/* ── Page 2 : Skills Graph ── */}
      <SkillsGraph />

      {/* ── Spacer ── */}
      <div className="h-[100px] shrink-0" />
    </div>
  );
}