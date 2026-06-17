"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { DM_Sans } from "next/font/google";
import { sections } from "@/lib/constants";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400"] });

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);

  const scrollToSection = (id: string) => {
    // Find the element and its nearest scrollable ancestor
    const target = document.getElementById(id);
    if (!target) return;

    // Walk up to find the overflow-y-scroll container
    let scrollParent: HTMLElement | null = target.parentElement;
    while (scrollParent) {
      const style = window.getComputedStyle(scrollParent);
      const overflow = style.overflowY;
      if (overflow === "scroll" || overflow === "auto") break;
      scrollParent = scrollParent.parentElement;
    }

    if (scrollParent) {
      scrollParent.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    } else {
      // Fallback: native scrollIntoView
      target.scrollIntoView({ behavior: "smooth" });
    }

    setOpen(false);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex flex-col items-center gap-4">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              className="
                flex
                items-center
                gap-6
                md:gap-10
              "
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() =>
                    scrollToSection(section.id)
                  }
                  className={`
                    ${dmSans.className}
                    text-lg
                    font-normal
                    tracking-tighter
                    underline-offset-4
                    whitespace-nowrap
                    dark:text-white
                    transition-colors
                    duration-500
                  `}
                >
                  {section.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen(!open)}
          className="w-fit dark:text-white transition-colors duration-500"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="x"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
              >
                <Plus size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}