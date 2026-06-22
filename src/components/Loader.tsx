"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide the loader after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0a0a0a]"
        >
          {/* UIkit style spinner using pure CSS for instant start */}
          <div className="animate-spin">
            <svg
              width="40"
              height="40"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black dark:text-white"
            >
              <circle
                fill="none"
                stroke="currentColor"
                cx="15"
                cy="15"
                r="14"
                strokeWidth="1.5"
                strokeDasharray="80"
                strokeDashoffset="60"
              ></circle>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
