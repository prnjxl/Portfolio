"use client";

import { motion } from "framer-motion";
import { DM_Sans } from "next/font/google";
import { sections } from "@/lib/constants";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400"] });

export default function FloatingMenu() {
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="absolute top-0 left-0 w-full z-50 py-8 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          flex
          items-center
          gap-6
          md:gap-12
        "
      >
        {/* We can include 'portfolio' explicitly as requested previously, or just the 5 sections.
            The user said "displaying the 5 items". The constants file has 5 items:
            Projects, Skills, About Me, Experience, Contact. */}
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`
              ${dmSans.className}
              text-sm
              font-normal
              tracking-tighter
              underline-offset-4
              whitespace-nowrap
              dark:text-white
              transition-colors
              duration-500
              hover:text-blue-500
            `}
          >
            {section.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}