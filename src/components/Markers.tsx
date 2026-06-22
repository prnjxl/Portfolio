"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Markers() {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const markerPositions = [
    { 
      id: 1, 
      top: "40%", 
      left: "20%",
      text: "Oh!? Hey there, Welcome to my portfolio webiste.",
      dropdownClass: "top-full mt-1 left-1/2 -translate-x-1/2"
    },
    { 
      id: 2, 
      top: "35%", 
      left: "60%",
      text: "I'm Pranjal and I'll be interacting with you through these markers.",
      dropdownClass: "bottom-full mb-9 translate-x-1/2"
    },
    { 
      id: 3, 
      top: "70%", 
      left: "80%",
      text: "There are some easter eggs too. Like triple click the website anywhere. Cool right!",
      dropdownClass: "top-full mt-1 right-0"
    },
    { 
      id: 4, 
      top: "110%", 
      left: "15%",
      text: "Here are some of my skills which I grinded over the past years.",
      dropdownClass: "top-full mt-1 left-0"
    },
    { 
      id: 5, 
      top: "90%", 
      left: "50%",
      text: "More about me as we explore the website.",
      dropdownClass: "bottom-full mb-9 right-0"
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // If we clicked on an element with the "marker-container" class, don't close
      const target = e.target as HTMLElement;
      if (!target.closest(".marker-container")) {
        setSelectedMarker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {markerPositions.map((m) => (
        <div
          key={m.id}
          className="absolute z-30 marker-container"
          style={{ top: m.top, left: m.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="
              relative cursor-pointer z-40
              -translate-x-1/2 -translate-y-1/2
              transition-transform duration-200 hover:scale-110
            "
            onClick={() => setSelectedMarker(selectedMarker === m.id ? null : m.id)}
          >
            <span className="
              flex h-8 w-8 items-center justify-center rounded-full 
              bg-[#222] text-white 
              dark:bg-white dark:text-[#222] 
              shadow-md
            ">
              <motion.div
                animate={{ rotate: selectedMarker === m.id ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus size={16} strokeWidth={2.5} />
              </motion.div>
            </span>
          </button>

          {/* Dropdown Card */}
          <AnimatePresence>
            {selectedMarker === m.id && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`
                  absolute
                  ${m.dropdownClass}
                  w-64 p-5 rounded-[3px] shadow-xl
                  bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-zinc-800
                  z-50
                `}
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {m.text}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}
