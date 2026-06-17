import Hero from "@/components/Hero";
import SkillsGraph from "@/components/SkillsGraph";

export default function Home() {
  return (
    /*
     * Outer wrapper: full viewport, scrollable but scrollbar hidden via CSS.
     * Inner pages snap naturally at 100vh boundaries.
     */
    <div
      className="
        h-screen overflow-y-scroll
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        scroll-smooth
      "
    >
      {/* ── Page 1 : Portfolio / Hero ── */}
      <section
        id="portfolio"
        className="relative h-screen bg-[#ECECEC] dark:bg-[#0a0a0a] transition-colors duration-500"
      >
        <div
          className="
            absolute
            left-8
            top-1/2
            -translate-y-1/2
            z-40
            pointer-events-none
          "
        >
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