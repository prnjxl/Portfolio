import FloatingMenu from "@/components/FloatingMenu";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="bg-[#ECECEC] dark:bg-[#0a0a0a] transition-colors duration-500">
      <FloatingMenu />

      <div
        className="
          fixed
          left-8
          top-1/2
          -translate-y-1/2
          z-40
          pointer-events-none
        "
      >
        <Hero />
      </div>

      <section className="min-h-screen" />
    </main>
  );
}